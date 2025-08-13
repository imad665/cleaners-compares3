'use server';

import { OrderPaymentStatus } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";
import { notifySellerByEmail } from "@/lib/payement/notifySellerByEmail";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type ItemInfo = {
  productId: string;
  sellerId: string;
  quantity: number;
  priceExcVat: number;
};

export async function holdCustomerCheckout(
  totalPrice: number,
  info: ItemInfo[],
  shippingInfo: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return { success: false, redirect: "/login" };
  }


  // Group items by seller
  const itemsBySeller: Record<string, ItemInfo[]> = {};
  info.forEach(item => {
    if (!itemsBySeller[item.sellerId]) {
      itemsBySeller[item.sellerId] = [];
    }
    itemsBySeller[item.sellerId].push(item);
  });
  //console.log(itemsBySeller,'zzzzzzzzzzzzzz')
  // Create payment intents for each seller
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      userId: user.id
    }
  });


  const sellerPayments = await Promise.all(
    Object.entries(itemsBySeller).map(async ([sellerId, items]) => {
      const sellerAmount = items.reduce((sum, item) => sum + item.priceExcVat/*  * item.quantity */, 0);

      const paymentIntent = await stripe.paymentIntents.create({
        customer: customer.id,  // Associate with customer,
        amount: Math.round(sellerAmount * 100), // GBP cents
        currency: "gbp",
        capture_method: "manual",
        receipt_email: user.email,
        metadata: {
          type: "order",
          userId: user.id,
          sellerId,
          productIds: items.map(i => i.productId).join(','),
        },
      });

      return {
        sellerId,
        amount: sellerAmount,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret
      };
    })
  );

  // Create the Order and OrderItems in your database
  const rate = await prisma.adminSetting.findFirst({
    where: {
      key: 'commissionRate'
    }
  })
  const commissionRate = parseInt(rate?.value || '0')
  //console.log(commissionRate,'------------------------------+++++++++');

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalPrice,
      status: 'PENDING',
      shippingAddress: shippingInfo.address,
      shippingCity: shippingInfo.city,
      shippingCountry: shippingInfo.country,
      shippingPostalCode: shippingInfo.postalCode,
      shippingPhone: shippingInfo.phone,
      commisionRate: commissionRate,
      orderPayments: {
        create: sellerPayments.map(payment => ({
          sellerId: payment.sellerId,
          amount: payment.amount,
          paymentIntentId: payment.paymentIntentId,
          status: 'PENDING'
        }))
      },
      orderItems: {
        create: info.map(item => ({
          productId: item.productId,
          sellerId: item.sellerId,
          quantity: item.quantity,
          unitPrice: item.priceExcVat,
          status: "PENDING",
          paymentIntentId: sellerPayments.find(p => p.sellerId === item.sellerId)?.paymentIntentId
        })),
      },
    },
    include: {
      orderPayments: true
    }
  });

  // Return all client secrets (frontend will need to handle multiple confirmations)
  return {
    success: true,
    paymentIntents: sellerPayments,
    orderId: order.id,
  };
}


export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'PAID' | 'REQUIRE_CAPTURE' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        notificationOrder: {
          upsert: {
            create: { status: "UNREAD" },
            update: { status: "UNREAD" }
          }
        },

      },

      include: {
        orderItems: {
          include: {
            product: {
              select: {
                title: true,
                imagesUrl: true,
              }
            },
            seller: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Only send email for certain status changes
    if (['PAID', 'REQUIRE_CAPTURE'].includes(status)) {
      await notifySellerByEmail(order);
    }

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order status'
    };
  }
}

export async function cancelSellerPayment(orderId: string, sellerId: string) {
  // 1. Find the payment for this seller
  const orderPayment = await prisma.orderPayment.findFirst({
    where: {
      orderId,
      sellerId
    }
  });

  if (!orderPayment) {
    return { success: false, error: "Payment not found" };
  }

  // 2. Check if payment was already captured
  if (orderPayment.status === 'CAPTURED') {
    // Need to issue a refund
    const refund = await stripe.refunds.create({
      payment_intent: orderPayment.paymentIntentId,
    });

    await prisma.orderPayment.update({
      where: { id: orderPayment.id },
      data: { status: 'REFUNDED' }
    });
  } else {
    // Just cancel the uncaptured payment intent
    await stripe.paymentIntents.cancel(orderPayment.paymentIntentId);

    await prisma.orderPayment.update({
      where: { id: orderPayment.id },
      data: { status: 'CANCELLED' }
    });
  }

  // 3. Update order items status for this seller
  await prisma.orderItem.updateMany({
    where: {
      orderId,
      sellerId,
      paymentIntentId: orderPayment.paymentIntentId
    },
    data: {
      status: 'CANCELLED'
    }
  });

  return { success: true };
}




export async function updateSellerPaymentStatus(
  orderId: string,
  paymentIntentId: string,
  status: OrderPaymentStatus
) {
  try {
    // Update the payment status in database
    await prisma.orderPayment.update({
      where: { paymentIntentId },
      data: {
        status,
        ...(status === 'PAID' && { capturedAt: new Date() })
      }
    });

    // Update related order items if needed
    if (status === 'PAID' || status === 'REQUIRE_CAPTURE') {
      await prisma.orderItem.updateMany({
        where: {
          orderId,
          paymentIntentId
        },
        data: {
          status: 'PROCESSING'
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update payment status:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}




export async function captureSellerPayment(orderId: string, sellerId: string) {
  try {
    // 1. Get the payment intent for this seller

    

    const orderPayment = await prisma.orderPayment.findFirst({
      where: {
        orderId,
        sellerId,
        status: { in: ['REQUIRE_CAPTURE', 'PAID'] } // Only capture if not already captured
      },
      include: {
        order: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!orderPayment) {
      return { success: false, error: "Payment not found or already captured" };
    }

    // 2. Capture the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.capture(
      orderPayment.paymentIntentId
    );

    // 3. Update database status
    await prisma.$transaction([
      prisma.orderPayment.update({
        where: { id: orderPayment.id },
        data: {
          status: 'PAID',
          updatedAt: new Date()
        }
      }),
      prisma.orderItem.updateMany({
        where: {
          orderId,
          sellerId,
          paymentIntentId: orderPayment.paymentIntentId
        },
        data: {
          status: 'DELIVERED'
        }
      })
    ]);

    return {
      success: true,
      paymentIntent
    };
  } catch (error) {
    console.error('Failed to capture payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to capture payment'
    };
  }
}