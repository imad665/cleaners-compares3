
import { formatDistanceToNow } from 'date-fns';
import { prisma } from '../prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';

type Notification = {
    id: string;
    type: 'order' | 'message' | 'alert';
    title: string;
    preview: string;
    time: string;
    link: string;
    isRead: boolean;
};



export async function getNotifications(): Promise<Notification[] | null> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;
    const userId = session.user.id;
    const role = session.user.role;
    // ------------------ MESSAGES ------------------
    const messages = await prisma.message.findMany({
        where: {
            receiverUserId: userId,
            isReceiverRead: false
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            order: {
                select: {
                    id: true,
                    
                    orderPayments: { select: { amount: true,id:true } }
                }
            },
             
        }
    });

    // Aggregate messages by orderId
    //console.log(messages,'yyyyyyyyyyyyyyyyyy')
    const aggregatedMessages = Object.values(
        messages.reduce((acc, msg) => {
            if (!acc[msg.orderId]) acc[msg.orderId] = { id: msg.orderId, messages: [], latestMessage: msg };
            acc[msg.orderId].messages.push(msg);
            if (msg.createdAt > acc[msg.orderId].latestMessage.createdAt) acc[msg.orderId].latestMessage = msg;
            return acc;
        }, {})
    );
     
    const messageNotifications = aggregatedMessages.map((group, index) => {
        const latest = group.latestMessage;
        console.log(latest,';;;;;;;;;;;;;;;');
        const isSenderSeller = latest.sender !='BUYER';
        return {
            id: String(index + 1),
            type: 'message',
            title: 'New Product Inquiry',
            preview: latest.content,
            time: formatDistanceToNow(new Date(latest.createdAt), { addSuffix: true }),
            link: !isSenderSeller?`/admin/myMessages/seller`/* ${group.id} */:`/orders`,/*  */
            msgCount: group.messages.length,
            
        };
    });

    // ------------------ SELLER ORDERS ------------------
    const unreadSellerOrders = await prisma.order.findMany({
        where: { orderItems: { some: { sellerId: userId, isReadSeller: false } } },
        select: { id: true, createdAt: true, orderPayments: { select: { amount: true } } }
    });

    const sellerNotifications = unreadSellerOrders.map((order, index) => {
        const totalAmount = order.orderPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            id: String(messageNotifications.length + index + 1),
            type: 'order',
            title: 'New Order Received',
            preview: `Order #${order.id} for £${totalAmount.toFixed(2)}`,
            time: formatDistanceToNow(new Date(order.createdAt), { addSuffix: true }),
            link: `/admin/dashboard/orders/${order.id}`
        };
    });

    // ------------------ BUYER ORDERS ------------------
    const unreadBuyerOrders = await prisma.order.findMany({
        where: {
            userId,
            orderItems: { some: { isReadBuyer: false, status: { in: ['SHIPPED', 'CANCELLED', 'PROCESSING'] } } }
        },
        select: { id: true, orderItems:{where:{status:{in:['SHIPPED','CANCELLED','PROCESSING']}}} , createdAt: true, status: true, orderPayments: { select: { amount: true } } }
    });

    const buyerNotifications = unreadBuyerOrders.map((order, index) => {
        let title = '', preview = '';
        switch (order.orderItems[0].status) {
            case 'SHIPPED':
                title = 'Order Shipped';
                preview = `Your order #${order.id} has been delivered`;
                break;
            case 'CANCELLED':
                title = 'Order Cancelled';
                preview = `Your order #${order.id} has been cancelled`;
                break;
            case 'PROCESSING':
                title = 'Order Processing';
                preview = `Your order #${order.id} is being processed`;
                break;
            default:
                title = 'Order Update';
                preview = `Update for your order #${order.id}`;
        }

        return {
            id: String(messageNotifications.length + sellerNotifications.length + index + 1),
            type: 'order',
            title,
            preview,
            time: formatDistanceToNow(new Date(order.createdAt), { addSuffix: true }),
            link: `/admin/dashboard/orders/${order.id}`
        };
    });

    // ------------------ MERGE & SORT ------------------
    const notifications = [...messageNotifications, ...sellerNotifications, ...buyerNotifications];

    // Optional: sort by newest first using createdAt date
    notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return notifications;
}
