'server only'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomMessage(to: string) {
    try {
        await resend.emails.send({
            from: 'CleanersCompare <noreply@cleanerscompare.com>',
            to,
            subject: 'Welcome to CleanersCompare – The Laundry Marketplace Built for You',
            html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
          <h2 style="color: #004080;">Welcome to CleanersCompare!</h2>
          <p>
            We're excited to have you join <strong>CleanersCompare.com</strong> — the world’s first comparison platform dedicated to the laundry and dry cleaning industry.
          </p>
          <p>
            Whether you're searching for <strong>new or used laundry equipment</strong>, <strong>sundries</strong>, or <strong>industry services</strong>, you've come to the right place.
          </p>
          <p>
            You can now:
            <ul>
              <li>🧺 Browse thousands of commercial machines and accessories</li>
              <li>🛠 Connect with trusted engineers and suppliers</li>
              <li>🔍 Compare top brands and exclusive deals</li>
              <li>🎥 Learn with helpful how-to videos and product insights</li>
            </ul>
          </p>
          <p>
            Ready to get started? Visit us anytime at 
            <a href="https://www.cleanerscompare.com" target="_blank" style="color: #0066cc;">CleanersCompare.com</a>.
          </p>
          <p>Welcome aboard, and enjoy comparing and selling!</p>
          <p>Warm regards,<br/>The CleanersCompare Team</p>
        </div>
      `,
        });

        console.log('Welcome email sent via Resend!');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}

export async function sendInquiryEmailNotification({
    to,
    senderName,
    senderRole,
    recipientRole,
    message,
    inquiryId
}: {
    to: string;
    senderName: string;
    senderRole: 'buyer' | 'seller';
    recipientRole: 'buyer' | 'seller';
    message: string;
    inquiryId: string;
}) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.cleanerscompare.com';
    const conversationLink = `${baseUrl}/messages/${inquiryId}`;

    try {
        await resend.emails.send({
            from: 'CleanersCompare <messages@cleanerscompare.com>',
            to,
            subject: `New message from ${senderName}`,
            html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #004080;">New Message Received</h2>
          <p>Hello ${recipientRole}, the ${senderRole} <strong>${senderName}</strong> sent you this message:</p>
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #004080; margin: 20px 0;">
            ${message}
          </div>
          <p>Click the button below to reply to the conversation:</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${conversationLink}" style="background-color: #004080; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reply to Conversation</a>
          </div>
          <p style="margin-top: 30px;">Warm regards,<br/>The CleanersCompare Team</p>
        </div>
      `,
        });
        console.log(`Notification email sent to ${to}`);
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
}
