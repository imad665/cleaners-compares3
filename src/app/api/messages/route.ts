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

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');
        const sellerId = searchParams.get('sellerId');
        const buyerId = searchParams.get('buyerId');
        const isForBuyer = searchParams.get("isForBuyer");

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
        }

        let order;
        let userRole: 'buyer' | 'seller' = 'buyer';

        // First try to find as buyer
        order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: user.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                orderItems: {
                    include: {
                        seller: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                sellerProfile: {
                                    select: {
                                        businessName: true
                                    }
                                }
                            }
                        },
                        product: {
                            select: {
                                id: true,
                                title: true,
                                imagesUrl: true
                            }
                        }
                    }
                }
            }
        });

        // If not found as buyer, try as seller
        if (!order) {
            order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    orderItems: {
                        some: {
                            sellerId: user.id
                        }
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    orderItems: {
                        where: {
                            sellerId: user.id
                        },
                        include: {
                            seller: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                    sellerProfile: {
                                        select: {
                                            businessName: true
                                        }
                                    }
                                }
                            },
                            product: {
                                select: {
                                    id: true,
                                    title: true,
                                    imagesUrl: true
                                }
                            }
                        }
                    }
                }
            });

            if (order) {
                userRole = 'seller';
            }
        }

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        // Build message filter
        let messageFilter: any = {
            orderId: orderId
        };

        // For seller view, filter messages between seller and specific buyer
        if (userRole === 'seller' && buyerId) {
            messageFilter = {
                orderId: orderId,
                OR: [
                    { senderUserId: user.id, receiverUserId: buyerId },
                    { senderUserId: buyerId, receiverUserId: user.id }
                ]
            };
        }
        // For buyer view, filter messages between buyer and specific seller
        else if (userRole === 'buyer' && sellerId) {
            messageFilter = {
                orderId: orderId,
                OR: [
                    { senderUserId: user.id, receiverUserId: sellerId },
                    { senderUserId: sellerId, receiverUserId: user.id }
                ]
            };
        }

        // Get messages for this conversation
        const messages = await prisma.message.findMany({
            where: messageFilter,
            include: {
                senderUser: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                receiverUser: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        //console.log(messages, isForBuyer, 'i;;;;;;;;;;;;;;;;;;;;;;;mmmmmmmmmmmmm');
        if (isForBuyer) {
            await prisma.message.updateMany({
                where: {
                    sender: "SELLER",
                    isReceiverRead: false
                },
                data:{
                    isReceiverRead:true
                }
            })
        }else{
            await prisma.message.updateMany({
                where:{
                    sender:"BUYER",
                    isReceiverRead:false,
                },
                data:{
                    isReceiverRead:true,
                }
            })
        }
        // Transform messages to match the expected format
        const transformedMessages = messages.map(message => ({
            id: message.id,
            senderId: message.senderUserId,
            senderName: message.senderUser.name,
            senderAvatar: message.senderUser.image || '/logo-1.png',
            content: message.content,
            timestamp: message.createdAt.toISOString(),
            isRead: true // For now, mark all as read
        }));

        // Prepare conversation data based on user role
        let conversationData;

        if (userRole === 'seller') {
            // For seller view, show buyer information
            const firstOrderItem = order.orderItems[0];
            conversationData = {
                id: orderId,
                orderId: orderId,
                productId: firstOrderItem?.product?.id || '',
                productName: firstOrderItem?.product?.title || 'Unknown Product',
                productImage: firstOrderItem?.product?.imagesUrl?.[0] || '/logo-1.png',
                productCategory: 'Cleaners',
                sellerId: buyerId || order.user.id, // For seller view, this represents the buyer
                sellerName: order.user.name || 'Unknown Buyer',
                sellerAvatar: order.user.image || '/logo-1.png',
                sellerRating: 4.5,
                lastUpdated: messages.length > 0 ? messages[messages.length - 1].createdAt.toISOString() : order.createdAt.toISOString(),
                messages: transformedMessages,
                unreadCount: 0
            };
        } else {
            // For buyer view, show seller information
            let seller;
            let productInfo;

            if (sellerId) {
                const sellerOrderItem = order.orderItems.find(item => item.seller.id === sellerId);
                seller = sellerOrderItem?.seller;
                productInfo = sellerOrderItem?.product;
            } else {
                const firstOrderItem = order.orderItems[0];
                seller = firstOrderItem?.seller;
                productInfo = firstOrderItem?.product;
            }

            conversationData = {
                id: orderId,
                orderId: orderId,
                productId: productInfo?.id || '',
                productName: productInfo?.title || 'Unknown Product',
                productImage: productInfo?.imagesUrl?.[0] || '/logo-1.png',
                productCategory: 'Cleaners',
                sellerId: seller?.id || sellerId || '',
                sellerName: seller?.sellerProfile?.businessName || seller?.name || 'Unknown Seller',
                sellerAvatar: seller?.image || '/logo-1.png',
                sellerRating: 4.5,
                lastUpdated: messages.length > 0 ? messages[messages.length - 1].createdAt.toISOString() : order.createdAt.toISOString(),
                messages: transformedMessages,
                unreadCount: 0
            };
        }

        return NextResponse.json({
            success: true,
            data: conversationData
        });

    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
        }

        const { orderId, content, receiverId } = await req.json();

        if (!orderId || !content || !receiverId) {
            return NextResponse.json({
                success: false,
                message: 'Order ID, content, and receiver ID are required'
            }, { status: 400 });
        }

        // Check if user is buyer or seller for this order
        let order;
        let userRole: 'buyer' | 'seller' = 'buyer';

        // First try to find as buyer
        order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: user.id
            }
        });

        // If not found as buyer, try as seller
        if (!order) {
            order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    orderItems: {
                        some: {
                            sellerId: user.id
                        }
                    }
                }
            });

            if (order) {
                userRole = 'seller';
            }
        }

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        // Create the message
        const message = await prisma.message.create({
            data: {
                content: content,
                sender: userRole === 'buyer' ? 'BUYER' : 'SELLER',
                orderId: orderId,
                senderUserId: user.id,
                receiverUserId: receiverId
            },
            include: {
                senderUser: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        const transformedMessage = {
            id: message.id,
            senderId: message.senderUserId,
            senderName: message.senderUser.name,
            senderAvatar: message.senderUser.image || '/logo-1.png',
            content: message.content,
            timestamp: message.createdAt.toISOString(),
            isRead: true
        };

        return NextResponse.json({
            success: true,
            data: transformedMessage
        });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
