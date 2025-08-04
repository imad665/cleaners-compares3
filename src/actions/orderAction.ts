'use server'
import { prisma } from "@/lib/prisma";
import { captureSellerPayment } from "./checkoutAction";
import { sendShippingNotification } from "@/lib/payement/send-shipping-notification";

interface ShippingEmailProps {
  item: {
    product: {
      title: string;
      imagesUrl?: string[];
    };
    order: {
      user: {
        name: string | null;
        email: string;
      };
      id: string;
      shippingAddress?: string;
      shippingCity?: string;
      shippingCountry?: string;
    };
    seller: {
      name: string | null;
    };
    quantity: number;
    unitPrice: number;
  };
  productImage: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const ShippingEmailTemplate = ({
  item,
  productImage,
  trackingNumber,
  estimatedDelivery = '3-5 business days'
}: ShippingEmailProps) => {
  const orderNumber = item.order.id.slice(0, 8).toUpperCase();
  const totalPrice = (item.unitPrice).toFixed(2);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order Has Shipped</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .product-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #667eea; }
        .product-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #e9ecef; }
        .info-box { background: #e8f4fd; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
        .tracking-info { background: #f0f7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .divider { border-top: 1px solid #e9ecef; margin: 25px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">📦 Your Order Has Shipped!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order #${orderNumber}</p>
        </div>

        <!-- Content -->
        <div class="content">
          <p style="color: #2c3e50; font-size: 16px; margin-bottom: 20px;">
            Dear ${item.order.user.name || 'Valued Customer'},
          </p>
          <p style="color: #495057; font-size: 15px; margin-bottom: 25px;">
            We're excited to let you know that ${item.seller.name || 'the seller'} has shipped your order. 
            Your items are on their way to you!
          </p>

          ${trackingNumber ? `
            <!-- Tracking Information -->
            <div class="tracking-info">
              <h3 style="margin-top: 0; color: #0066cc;">Tracking Information</h3>
              <p style="margin-bottom: 5px;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
              <p style="margin: 0;"><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
            </div>
          ` : ''}

          <!-- Shipping Address 
          <div style="margin-bottom: 25px;">
            <h3 style="margin-top: 0; color: #2c3e50;">Shipping To:</h3>
            <p style="margin: 5px 0;">
              ${item.order.shippingAddress || 'Address not specified'}<br>
              ${item.order.shippingCity || ''} ${item.order.shippingCountry || ''}
            </p>
          </div> -->

          <!-- Product Card -->
          <div class="product-card">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="flex-shrink: 0;">
                <img src="${productImage}" alt="${item.product.title}" class="product-image">
              </div>
              <div style="flex: 1;">
                <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 18px;">${item.product.title}</h3>
                <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 14px;">
                  Quantity: ${item.quantity} | Price: £${(item.unitPrice / item.quantity).toFixed(2)}
                </p>
                <p style="margin: 0; color: #2c3e50; font-weight: 600;">
                  Total: £${totalPrice}
                </p>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="info-box">
            <h4 style="margin: 0 0 15px 0; color: #0066cc; font-size: 16px;">📋 What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #495057; font-size: 14px;">
              <li style="margin-bottom: 8px;">Track your package using the tracking number above</li>
              <!-- <li style="margin-bottom: 8px;">Expect delivery within ${estimatedDelivery}</li>-->
              <li style="margin-bottom: 8px;">Inspect your items upon arrival</li>
              <li>Contact ${item.seller.name || 'the seller'} if there are any issues</li>
            </ul>
          </div>-->

          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${baseUrl}/orders" class="button">
              View Order Details
            </a>
          </div>

          <div class="divider"></div>

          <!-- Support Section -->
          <div>
            <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">
              <strong>Need Help?</strong> Contact ${item.seller.name || 'the seller'} directly through our messaging system for any questions about your shipment.
            </p>
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              Thank you for shopping with us!
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0; color: #6c757d; font-size: 12px;">
            © ${new Date().getFullYear()} Cleaners Compare. All rights reserved.
          </p>
          <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 12px;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};





// actions/orderActions.ts
export async function updateOrderItemStatus(
  orderId: string,
  orderItemId: string,
  status: 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
) {
  try {
    const item = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status },
      include: {
        seller: true,
        order: true
      }
    });

    // If status is SHIPPED, notify buyer
    if (status === 'SHIPPED') {
      await sendShippingNotification(item.order.userId, item.id);
    }

    // If status is DELIVERED, capture payment
    if (status === 'DELIVERED') {
      await captureSellerPayment(orderId, item.sellerId);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update order item status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

import { Resend } from 'resend';
import Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function shipOrderItem(orderItemId: string) {
  try {
    // 1. Update order item status to SHIPPED
    const ord = await prisma.orderItem.findUnique({
      where: {
        id: orderItemId
      },
      select: {
        sellerId: true,
      }
    })
    if (!ord) return {success:false,error:'order not found for :'+orderItemId};

    const updatedItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        status: 'SHIPPED',
        createdAt: new Date()
      },
      include: {

        order: {
          include: {
            user: {
              select: {
                email: true,
                name: true
              }
            },
            orderItems: {
              where: { sellerId: ord!.sellerId },
              select: {
                product: {
                  select: {
                    title: true,
                    imagesUrl: true,

                  }
                },
                id: true,
              }
            }
          }
        },
        seller: {
          select: {
            name: true
          }
        }
      }
    });

    // 2. Send professional shipping notification to buyer with product image and redirect button

    const products = updatedItem.order.orderItems.map(o => o.product).map(p => ({
      title: p.title,
      imageUrl: p.imagesUrl?.[0] || '/uploads/ImageUnavailable.jpg'
    }));

    await resend.emails.send({
      from: 'notifications@yummymeatrecipes.com',
      to: updatedItem.order.user.email,
      subject: `📦 Your order has been shipped - ${products.length} Item${products.length > 1 ? 's' : ''}`,
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📦 Your Order is On Its Way!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Great news! Your item${products.length > 1 ? 's have' : ' has'} been shipped</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px 20px;">
        <!-- Products Section -->
        <div style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">
            Shipped Items (${products.length})
          </h3>
          
          ${products.map(item => `
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #667eea;">
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="flex-shrink: 0;">
                  <img src="${item.imageUrl}" alt="${item.title}" 
                       style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #e9ecef;">
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${item.title}</h4>
                  <p style="margin: 0; color: #6c757d; font-size: 14px;">Shipped by: <strong>${updatedItem.seller.name}</strong></p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Message -->
        <div style="margin-bottom: 25px;">
          <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
            Dear ${updatedItem.order.user.name || 'Valued Customer'},
          </p>
          <p style="color: #495057; font-size: 15px; line-height: 1.6; margin: 0 0 15px 0;">
            We're excited to inform you that ${products.length > 1 ? `${products.length} items from your order` : 'your item'} 
            ${products.length > 1 ? 'have' : 'has'} been processed and shipped by <strong>${updatedItem.seller.name}</strong>. 
            Your package${products.length > 1 ? 's are' : ' is'} now on the way and should arrive soon.
          </p>
        </div>

        <!-- Next Steps -->
        <div style="background-color: #e8f4fd; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 15px 0; color: #0066cc; font-size: 16px; font-weight: 600;">📋 What's Next?</h4>
          <ul style="margin: 0; padding-left: 20px; color: #495057; font-size: 14px; line-height: 1.6;">
            <li style="margin-bottom: 8px;">Track your package${products.length > 1 ? 's' : ''} and monitor delivery progress</li>
            <li style="margin-bottom: 8px;">Once received, please confirm delivery in your orders</li>
            <li style="margin-bottom: 8px;">Contact the seller directly if you have any questions</li>
            <!-- <li>Leave a review to help other buyers</li> -->
          </ul>
        </div>

        <!-- Action Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
            🛍️ View All My Orders
          </a>
        </div>

        <!-- Support Section -->
        <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 25px;">
          <p style="color: #6c757d; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
            <strong>Need Help?</strong> You can contact <strong>${updatedItem.seller.name}</strong> directly through our messaging system 
            for any questions about your shipment or delivery.
          </p>
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Thank you for choosing our platform. We appreciate your business!
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="margin: 0; color: #6c757d; font-size: 12px;">
          This is an automated notification. Please do not reply to this email.
        </p>
      </div>
    </div>
  `
    });

    return {
      success: true,
      message: 'Item marked as shipped and buyer notified'
    };
  } catch (error) {
    console.error('Shipping failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update shipping status'
    };
  }
}





export async function cancelOrderItem(orderItemId: string) {
  try {
    // 1. First get just the sellerId from the order item
    const sellerInfo = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { sellerId: true }
    });

    if (!sellerInfo) {
      throw new Error('Order item not found');
    }

    // 2. Now get the full order item details with payment info
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        product: {
          select: {
            title: true,
            imagesUrl: true
          }
        },
        seller: {
          select: {
            name: true
          }
        },
        order: {
          include: {
            user: {
              select: {
                email: true,
                name: true
              }
            },
            orderItems: {
              where: {
                sellerId: sellerInfo.sellerId,
              },
              select: {
                product: {
                  select: {
                    title: true,
                    imagesUrl: true,
                  }
                },
                unitPrice:true,
              }
            },
            orderPayments: {
              where: {
                sellerId: sellerInfo.sellerId // Use the sellerId we already fetched
              }
            }
          }
        }
      }
    });

    if (!orderItem) {
      throw new Error('Order item details not found');
    }

    // 3. Update order item status to CANCELLED
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status: 'CANCELLED' }
    });

    // 4. Handle payment cancellation/refund
    const s = orderItem.order.orderPayments[0]?.status
    //console.log(s, ';;;;;;;;;;;;llllllllllll');
    if (s === 'PAID') {
      // If payment was captured, issue refund
      await stripe.refunds.create({
        payment_intent: orderItem.order.orderPayments[0].paymentIntentId,
        amount: Math.round(orderItem.unitPrice * 100) // in cents
      });

      await prisma.orderPayment.update({
        where: { id: orderItem.order.orderPayments[0].id },
        data: { status: 'REFUNDED' }
      });
    } else if (s === 'REQUIRE_CAPTURE') {
      // If payment wasn't captured yet, just cancel
      await stripe.paymentIntents.cancel(
        orderItem.order.orderPayments[0].paymentIntentId
      );

      await prisma.orderPayment.update({
        where: { id: orderItem.order.orderPayments[0].id },
        data: { status: 'CANCELLED' }
      });
    }

    // 5. Send professional cancellation notification to buyer
    const productImage = orderItem.product.imagesUrl && orderItem.product.imagesUrl.length > 0
      ? orderItem.product.imagesUrl[0]
      : '/uploads/ImageUnavailable.jpg';

    const refundMessage = s === 'PAID'
      ? 'A full refund has been processed and will appear in your account within 5-10 business days.'
      : 'Your payment has been cancelled and no charges were made to your account.';


    const products = orderItem?.order?.orderItems?.map((o) => o.product)
    const totalAmount = orderItem?.order?.orderItems?.reduce((sum,o)=>sum+o.unitPrice,0);
    await resend.emails.send({
      from: 'notifications@yummymeatrecipes.com',
      to: orderItem.order.user.email,
      subject: `❌ Order Cancelled - ${products.length} Item${products.length > 1 ? 's' : ''}`,
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">❌ Order Cancelled</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">We're sorry to inform you about this cancellation</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px 20px;">
        <!-- Products Section -->
        <div style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">
            Cancelled Items (${products.length})
          </h3>
          
          ${products.map(item => `
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #dc3545;">
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="flex-shrink: 0;">
                  <img src="${item.imagesUrl?.[0] || 'https://via.placeholder.com/80'}" alt="${item.title}" 
                       style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #e9ecef; opacity: 0.7;">
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${item.title}</h4>
                  <p style="margin: 0; color: #6c757d; font-size: 14px;">Cancelled by: <strong>${orderItem.seller.name}</strong></p>
                  <p style="margin: 5px 0 0 0; color: #dc3545; font-size: 14px; font-weight: 600;">Status: CANCELLED</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Message -->
        <div style="margin-bottom: 25px;">
          <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
            Dear ${orderItem.order.user.name || 'Valued Customer'},
          </p>
          <p style="color: #495057; font-size: 15px; line-height: 1.6; margin: 0 0 15px 0;">
            We regret to inform you that <strong>${orderItem.seller.name}</strong> has cancelled ${products.length > 1 ? `${products.length} items from` : 'an item from'} your order. 
            We understand this may be disappointing and apologize for any inconvenience.
          </p>
        </div>

        <!-- Refund Information -->
        <div style="background-color: #d1ecf1; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #17a2b8;">
          <h4 style="margin: 0 0 15px 0; color: #0c5460; font-size: 16px; font-weight: 600;">💳 Payment & Refund Information</h4>
          <p style="margin: 0; color: #0c5460; font-size: 14px; line-height: 1.6;">
            ${refundMessage}
          </p>
          <p style="margin: 10px 0 0 0; color: #0c5460; font-size: 14px; line-height: 1.6;">
            <strong>Total Amount:</strong> £${totalAmount.toFixed(2)}
          </p>
        </div>

        <!-- Action Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            📋 View My Orders
          </a>
        </div>

        <!-- Support Section -->
        <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 25px;">
          <p style="color: #6c757d; font-size: 14px; line-height: 1.6; margin: 0;">
            <strong>Need Assistance?</strong> Our customer support team is here to help. You can also browse our marketplace 
            to find similar products from other trusted sellers.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="margin: 0; color: #6c757d; font-size: 12px;">
          This is an automated notification. Please do not reply to this email.
        </p>
      </div>
    </div>
  `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to cancel item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel item'
    };
  }
}

// actions/orderActions.ts

export async function confirmDelivery(orderItemId: string) {
  try {
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status: 'DELIVERED' }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to confirm delivery:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to confirm delivery'
    }
  }
}
