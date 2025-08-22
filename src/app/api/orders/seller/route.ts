import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { equal } from "assert";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
        }

        // Get all orders where the current user is the seller with the specified statuses

        const [update, orders] = await Promise.all([
            prisma.orderItem.updateMany({
                where: {
                    order: {
                        userId: user.id  // Find order items where the order belongs to this user
                    },
                    isReadSeller: false  // Only update unread items
                },
                data: {
                    isReadSeller: true  // Mark them as read
                }
            }),
            prisma.order.findMany({
                where: {
                    orderItems: {
                        some: {
                            sellerId: user.id
                        }
                    },
                    status: {
                        in: ['PAID', 'PENDING', 'REQUIRE_CAPTURE']
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    },
                    orderItems: {
                        where: {
                            sellerId: user.id
                        },
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    title: true,
                                    price: true,
                                    discountPrice: true,
                                    imagesUrl: true,
                                    condition: true
                                }
                            }
                        }
                    },
                    orderPayments: {
                        select: {
                            paymentIntentId: true,
                            status: true,
                            amount: true
                        }
                    },
                    Message: true/* {
                        where:{
                            sender:"BUYER",
                            isReceiverRead:false,
                        },
                         
                    }, */

                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ])



        // Transform the data to group by buyer
        const salesByBuyer = orders.reduce((acc, order) => {
            const buyerId = order.userId;
            //console.log(order, 'nnnnnnnnnnnnnnnnnnnnnnnnn cmed3frib0006crr9th1e9oiu');
            const messagesLength = order.Message.length;
            if (messagesLength > 0) {
                if (!acc[buyerId]) {
                    acc[buyerId] = {
                        buyer: {
                            id: order.user.id,
                            name: order.user.name,
                            email: order.user.email,
                            image: order.user.image,
                            unreadMessageCount: order.Message.filter((m) => m.senderUserId === buyerId && m.sender === 'BUYER' && !m.isReceiverRead).length
                        },
                        items: [],
                        totalAmount: 0,
                        conversations: [] // will be filled later
                    };
                }

                order.orderItems.forEach(item => {
                    acc[buyerId].items.push({
                        orderId: order.id,
                        product: item.product,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        status: item.status,
                        paymentIntentId: item.paymentIntentId,
                        orderDate: order.createdAt,
                        orderStatus: order.status
                    });

                    acc[buyerId].totalAmount += item.unitPrice /* * item.quantity */;
                });
            }


            return acc;
        }, {} as Record<string, any>);
        console.log(salesByBuyer);

        // Fetch conversations (Inquiry) for each buyer
        const buyerIds = Object.keys(salesByBuyer);
        const conversationsByBuyer: Record<string, any[]> = {};

        if (buyerIds.length > 0) {
            const inquiries = await prisma.inquiry.findMany({
                where: {
                    sellerId: user.id,
                    buyerId: { in: buyerIds }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Group inquiries by buyerId
            for (const inquiry of inquiries) {
                if (!conversationsByBuyer[inquiry.buyerId]) {
                    conversationsByBuyer[inquiry.buyerId] = [];
                }
                conversationsByBuyer[inquiry.buyerId].push(inquiry);
            }
        }

        // Attach conversations to each buyer group
        for (const buyerId of buyerIds) {
            salesByBuyer[buyerId].conversations = conversationsByBuyer[buyerId] || [];
        }

        // Convert to array format
        const result = Object.values(salesByBuyer);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error fetching seller sales:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
