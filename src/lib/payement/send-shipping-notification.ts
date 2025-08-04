// utils/notifications.ts
'server only'
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendShippingNotification(userId: string, orderItemId: string) {
  try {
    // 1. Get order details
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        product: { select: { title: true } },
        order: {
          select: {
            id: true,
            user: { select: { email: true, name: true } },
          }
        }
      }
    });

    if (!orderItem || !orderItem.order.user.email) {
      throw new Error('Order details not found');
    }

    // 2. Send simple shipping notification email
    await resend.emails.send({
      from: 'orders@yummymeatrecipes.com',
      to: orderItem.order.user.email,
      subject: `Your order has shipped!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your ${orderItem.product.title} is on the way!</h2>
          <p>We've shipped your order and it should arrive soon.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
            <p>When you receive your package, please confirm delivery:</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderItem.order.id}/confirm" 
               style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
              Confirm Delivery
            </a>
          </div>
          
          <p>Thank you for shopping with us!</p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send shipping notification:', error);
    return { success: false };
  }
}