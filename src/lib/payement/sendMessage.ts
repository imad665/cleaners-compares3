// utils/sendWelcomeMessage.ts
'server only'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomMessage(to: string) {
  try {
    await resend.emails.send({
      from: 'CleanersCompare <noreply@yummymeatrecipes.com>',
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
          <p>Welcome aboard, and happy comparing!</p>
          <p>Warm regards,<br/>The CleanersCompare Team</p>
        </div>
      `,
    });

    console.log('Welcome email sent via Resend!');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}


export async function sendContactReply(to: string, name: string, response: string) {
  try {
    await resend.emails.send({
      from: 'CleanersCompare <noreply@yummymeatrecipes.com>',
      to,
      subject: 'Re: Your Message to CleanersCompare',
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
          <h2 style="color: #004080;">Hi ${name || 'there'},</h2>
          <p>Thank you for reaching out to <strong>CleanersCompare</strong>.</p>
          <p>We’ve reviewed your message and here’s our response:</p>

          <blockquote style="margin: 1em 0; padding: 1em; background-color: #f9f9f9; border-left: 4px solid #004080;">
            ${response}
          </blockquote>

          <p>If you have any further questions or need additional details, feel free to reply to this email anytime.</p>
          <p>
            You can also explore our marketplace at 
            <a href="https://www.cleanerscompare.com" target="_blank" style="color: #0066cc;">CleanersCompare.com</a>
            to browse commercial machines, services, and more.
          </p>
          <p>Warm regards,<br/>The CleanersCompare Team</p>
        </div>
      `,
    });

    console.log('Contact reply email sent successfully!');
  } catch (error) {
    console.error('Error sending contact reply email:', error);
  }
}


export async function sendAdminMessage(to: string, subject: string, message: string) {
  try {
    await resend.emails.send({
      from: 'YummyMeat Admin <noreply@yummymeatrecipes.com>',
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
          <p>${message}</p>
          <p style="margin-top: 2em;">Best regards,<br/>YummyMeat Admin Team</p>
        </div>
      `,
    });

    console.log('Admin message sent successfully to:', to);
  } catch (error) {
    console.error('Error sending admin message:', error);
  }
}


 
