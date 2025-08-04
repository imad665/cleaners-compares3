import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
        }

        // Get all orders for the buyer with the specified statuses
        const [update, orders] = await Promise.all([
            prisma.orderItem.updateMany({
                where: {
                    order: {
                        userId: user.id  // Find order items where the order belongs to this user
                    },
                    isReadBuyer: false  // Only update unread items
                },
                data: {
                    isReadBuyer: true  // Mark them as read
                }
            }),
            prisma.order.findMany({
                where: {
                    userId: user.id,
                    status: {
                        in: ['PAID', 'PENDING', 'REQUIRE_CAPTURE']
                    }
                },
                include: {
                    orderItems: {
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
                            },
                            seller: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    sellerProfile: {
                                        select: {
                                            businessName: true
                                        }
                                    }
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
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ])
        // Transform the data to group by seller
        const purchasesBySeller = orders.reduce((acc, order) => {
            order.orderItems.forEach(item => {
                const sellerId = item.sellerId;

                if (!acc[sellerId]) {
                    acc[sellerId] = {
                        seller: {
                            id: item.seller.id,
                            name: item.seller.name,
                            email: item.seller.email,
                            businessName: item.seller.sellerProfile?.businessName || ''
                        },
                        items: [],
                        totalAmount: 0,
                        conversations: [] // will be filled later
                    };
                }

                acc[sellerId].items.push({
                    orderId: order.id,
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    status: item.status,
                    paymentIntentId: item.paymentIntentId,
                    orderDate: order.createdAt,
                    orderStatus: order.status
                });

                acc[sellerId].totalAmount += item.unitPrice /* * item.quantity */;
            });

            return acc;
        }, {} as Record<string, any>);

        // Fetch conversations (Inquiry) for each seller
        const sellerIds = Object.keys(purchasesBySeller);
        const conversationsBySeller: Record<string, any[]> = {};

        if (sellerIds.length > 0) {
            const inquiries = await prisma.inquiry.findMany({
                where: {
                    buyerId: user.id,
                    sellerId: { in: sellerIds }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Group inquiries by sellerId
            for (const inquiry of inquiries) {
                if (!conversationsBySeller[inquiry.sellerId]) {
                    conversationsBySeller[inquiry.sellerId] = [];
                }
                conversationsBySeller[inquiry.sellerId].push(inquiry);
            }
        }

        // Attach conversations to each seller group
        for (const sellerId of sellerIds) {
            purchasesBySeller[sellerId].conversations = conversationsBySeller[sellerId] || [];
        }

        // Convert to array format
        const result = Object.values(purchasesBySeller);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error fetching buyer purchases:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}