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


 
 
export interface ContactToAdminParams {
  fromEmail: string;
  fromName: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  inquiryType?: string;
  to:string
}

export async function sendContactToAdmin(params: ContactToAdminParams) {
  try {
    const {
      fromEmail,
      fromName,
      subject,
      message,
      phone,
      company,
      inquiryType = 'General Inquiry',
      to,
    } = params;

    await resend.emails.send({
      from: 'CleanersCompare Contact <noreply@yummymeatrecipes.com>',
      to: to,//'admin@cleanerscompare.com', // Replace with your admin email
      //reply_to: fromEmail,
      subject: `New Contact: ${subject}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 10px !important;
            }
            .header {
                padding: 20px 15px !important;
            }
            .content {
                padding: 20px 15px !important;
            }
            .info-grid {
                display: block !important;
            }
            .info-item {
                margin-bottom: 15px !important;
            }
            .action-buttons {
                display: block !important;
                text-align: center !important;
            }
            .action-button {
                margin-bottom: 10px !important;
                display: block !important;
                width: 100% !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f8fb; font-family: Arial, Helvetica, sans-serif;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0; overflow: hidden;">
        New contact message from ${fromName} - ${subject}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f8fb">
        <tr>
            <td align="center">
                <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 30px 20px;">
                    <!-- Header -->
                    <tr>
                        <td class="header" style="background: linear-gradient(135deg, #0ea5e9, #22d3ee); padding: 30px 40px; color: #ffffff;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">CleanersCompare</h1>
                                        <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">New Contact Message</p>
                                    </td>
                                    <td align="right" style="vertical-align: top;">
                                        <div style="background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                                            📧 Contact
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Alert Banner -->
                    <tr>
                        <td style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="24" style="vertical-align: top; padding-right: 12px;">
                                        <div style="background: #ffc107; border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px; font-size: 12px; color: #856404;">⚠️</div>
                                    </td>
                                    <td>
                                        <p style="margin: 0; font-size: 14px; color: #856404; font-weight: 500;">
                                            New message requires your attention
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td class="content" style="padding: 40px;">
                            <!-- Sender Information -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
                                <tr>
                                    <td>
                                        <h2 style="margin: 0 0 25px 0; font-size: 20px; color: #1f2937; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #f3f4f6;">Message Details</h2>
                                        
                                        <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
                                            <div class="info-item" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                                <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">From</div>
                                                <div style="font-size: 16px; color: #1f2937; font-weight: 600;">${fromName}</div>
                                            </div>
                                            
                                            <div class="info-item" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                                <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">Email</div>
                                                <div style="font-size: 16px; color: #1f2937;">
                                                    <a href="mailto:${fromEmail}" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">${fromEmail}</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                            ${phone ? `
                                            <div class="info-item" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                                <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">Phone</div>
                                                <div style="font-size: 16px; color: #1f2937;">
                                                    <a href="tel:${phone}" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">${phone}</a>
                                                </div>
                                            </div>
                                            ` : ''}
                                            
                                            ${company ? `
                                            <div class="info-item" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                                <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">Company</div>
                                                <div style="font-size: 16px; color: #1f2937; font-weight: 500;">${company}</div>
                                            </div>
                                            ` : ''}
                                            
                                            <div class="info-item" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                                <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">Inquiry Type</div>
                                                <div style="font-size: 16px; color: #1f2937; font-weight: 500;">${inquiryType}</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message Content -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
                                <tr>
                                    <td>
                                        <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #1f2937; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #f3f4f6;">Message Content</h3>
                                        <div style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
                                            <div style="background: #0ea5e9; padding: 18px 24px;">
                                                <h4 style="margin: 0; font-size: 16px; color: #ffffff; font-weight: 600;">${subject}</h4>
                                            </div>
                                            <div style="padding: 28px; font-size: 15px; line-height: 1.7; color: #374151; white-space: pre-wrap; background: #ffffff;">
                                                ${message}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Quick Actions -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #1f2937; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #f3f4f6;">Quick Actions</h3>
                                        <table class="action-buttons" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="padding: 8px;">
                                                    <a href="mailto:${fromEmail}?subject=Re: ${encodeURIComponent(subject)}" 
                                                       class="action-button"
                                                       style="display: inline-block; background: #0ea5e9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; transition: all 0.2s; border: none; min-width: 200px;">
                                                       📧 Reply to ${fromName.split(' ')[0]}
                                                    </a>
                                                </td>
                                                ${phone ? `
                                                <td align="center" style="padding: 8px;">
                                                    <a href="tel:${phone}" 
                                                       class="action-button"
                                                       style="display: inline-block; background: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; transition: all 0.2s; border: none; min-width: 200px;">
                                                       📞 Call ${fromName.split(' ')[0]}
                                                    </a>
                                                </td>
                                                ` : ''}
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background: #1f2937; color: #d1d5db; font-size: 12px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <div style="margin-bottom: 8px; font-size: 13px;">
                                            <strong style="color: #ffffff;">CleanersCompare Platform</strong> • The Laundry Marketplace
                                        </div>
                                        <div style="color: #9ca3af; line-height: 1.5;">
                                            This message was sent via the Contact Us form on CleanersCompare.com<br>
                                            <span style="font-size: 11px;">Message ID: ${Date.now()}</span>
                                        </div>
                                    </td>
                                    <td align="right" style="vertical-align: top;">
                                        <div style="color: #9ca3af; text-align: right;">
                                            <div style="font-weight: 600; color: #d1d5db; margin-bottom: 4px;">Received</div>
                                            <div>${new Date().toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric'
                                            })}</div>
                                            <div>${new Date().toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
    });

    console.log('Contact message sent to admin successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error sending contact message to admin:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}