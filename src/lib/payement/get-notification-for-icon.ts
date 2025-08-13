
import { formatDistanceToNow } from 'date-fns';
import { prisma } from '../prisma';

type Notification = {
    id: string;
    type: 'order' | 'message' | 'alert';
    title: string;
    preview: string;
    time: string;
    link: string;
    isRead: boolean;
};

export async function getNotifications(userId: string): Promise<Notification[]> {
    // Fetch recent messages (both sent and received)

    const messages = await prisma.message.findMany({
        where: {
            /* OR: [
              { senderUserId: userId },
              { receiverUserId: userId }
            ] */
            receiverUserId: userId,
            isReceiverRead: false
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
        include: {
            order: {
                select: {
                    id: true,
                    orderPayments: {
                        select: { amount: true }
                    }
                }
            }
        }
    });

    const unreadSellerOrders = await prisma.order.findMany({
        where: {
            orderItems: {
                some: {
                    sellerId: userId,
                    isReadSeller: false
                }
            }

        },
    });


    // Count of unread orders where user is the buyer
    const unreadBuyerOrders = await prisma.order.findMany({
        where: {
            userId: userId,
            orderItems: {
                some: {
                    isReadBuyer: false
                }
            }
        },
    });

    // Transform orders into notifications
    const orderNotifications: Notification[] = orders.map(order => {
        const productTitles = order.orderItems
            .map(item => item.product.title)
            .join(', ');

        return {
            id: order.id,
            type: 'order',
            title: `New ${order.status === 'SHIPPED' ? 'Shipped' : 'Received'} Order`,
            preview: `Order #${order.id.substring(0, 8)} for ${productTitles}`,
            time: formatDistanceToNow(order.createdAt, { addSuffix: true }),
            link: `/admin/dashboard/orders/${order.id}`,
            isRead: false // You might want to track order read status separately
        };
    });

    // Transform payments into notifications
    const paymentNotifications: Notification[] = payments.map(payment => ({
        id: payment.id,
        type: 'alert',
        title: 'Payment Processed',
        preview: `£${payment.amount.toFixed(2)} deposited to your account`,
        time: formatDistanceToNow(payment.createdAt, { addSuffix: true }),
        link: '/admin/dashboard/payments',
        isRead: false
    }));

    // Combine all notifications and sort by time
    const allNotifications = [
        ...messageNotifications,
        ...orderNotifications,
        ...paymentNotifications
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return allNotifications;
}