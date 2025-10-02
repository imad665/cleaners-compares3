// utils/sendBroadcastMessage.ts
'server only'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// buyers
export interface BroadcastEmailParams {
  to: string | string[];
  firstName: string;
  title: string;
  subtitleOrDate: string;
  introParagraph: string;
  benefits: {
    title1: string;
    text1: string;
    title2: string;
    text2: string;
    title3: string;
    text3: string;
  };
  images?: {
    heroImageUrl?: string;
    image1Url?: string;
    image1Caption?: string;
    image2Url?: string;
    image2Caption?: string;
  };
  links?: {
    videoUrl?: string;
    webpageUrl?: string;
    primaryCtaUrl: string;
    primaryCtaLabel: string;
    preferencesUrl?: string;
    unsubscribeUrl?: string;
  };
  preheaderText?: string;
}

export async function sendBuyerBroadcastMessage(params: BroadcastEmailParams) {
  try {
    const {
      to,
      firstName,
      title,
      subtitleOrDate,
      introParagraph,
      benefits,
      images = {},
      links = {},
      preheaderText = "Latest updates from Cleaners Compare"
    } = params;

    const {
      heroImageUrl = "https://images.unsplash.com/photo-1582735689256-79f97ec3d1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
      image1Url = "https://images.unsplash.com/photo-1582735689256-79f97ec3d1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=268&h=200&q=80",
      image1Caption = "Commercial laundry equipment",
      image2Url = "https://images.unsplash.com/photo-1582735689256-79f97ec3d1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=268&h=200&q=80",
      image2Caption = "Industry services"
    } = images;

    const {
      videoUrl = "https://www.youtube.com/watch?v=example",
      webpageUrl = "https://www.cleanerscompare.com",
      primaryCtaUrl,
      primaryCtaLabel,
      preferencesUrl = "https://www.cleanerscompare.com/preferences",
      unsubscribeUrl = "https://www.cleanerscompare.com/unsubscribe"
    } = links;

    const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <style>
      /* Mobile tweaks */
      @media screen and (max-width: 600px) {
        .container { width: 100% !important; }
        .px-24 { padding-left: 16px !important; padding-right: 16px !important; }
        .py-24 { padding-top: 16px !important; padding-bottom: 16px !important; }
        .stack { display: block !important; width: 100% !important; }
        .text-center-sm { text-align: center !important; }
        .button { display: block !important; width: 100% !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#f6f8fb; font-family:Arial, Helvetica, sans-serif; color:#17202a;">
    <!-- Preheader (hidden preview in inbox) -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheaderText}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fb;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" class="container" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); margin:24px 12px;">
            <!-- Header -->
            <tr>
              <td style="background:#0ea5e9; background:linear-gradient(90deg,#0ea5e9,#22d3ee); padding:20px 24px; color:#ffffff;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="text-center-sm" style="font-size:20px; font-weight:700; letter-spacing:0.2px;">Cleaners Compare</td>
                    <td align="right" class="text-center-sm" style="font-size:12px; font-weight:600; text-transform:uppercase;">
                      <span style="background:#ffffff; color:#0ea5e9; padding:6px 10px; border-radius:999px;">For Buyers</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Hero Title -->
            <tr>
              <td class="px-24" style="padding:28px 24px 8px 24px;">
                <h1 style="margin:0 0 6px; font-size:22px; line-height:1.3; color:#0b2538;">${title}</h1>
                <p style="margin:0; font-size:14px; color:#6b7a8a;">${subtitleOrDate}</p>
              </td>
            </tr>

            <!-- Optional Hero Image -->
            ${heroImageUrl ? `
            <tr>
              <td>
                <img src="${heroImageUrl}" alt="${title}" width="600" style="display:block; width:100%; height:auto;">
              </td>
            </tr>
            ` : ''}

            <!-- Main Content -->
            <tr>
              <td class="px-24 py-24" style="padding:20px 24px;">
                <p style="margin:0 0 12px; font-size:16px; line-height:1.6;">Hi ${firstName},</p>
                <p style="margin:0 0 12px; font-size:16px; line-height:1.6;">${introParagraph}</p>

                <!-- Benefits Cards (3-up on desktop, stack on mobile) -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 8px;">
                  <tr>
                    <td class="stack" width="33.33%" style="padding:8px;">
                      <table role="presentation" width="100%" style="border:1px solid #eef2f7; border-radius:10px;">
                        <tr>
                          <td style="padding:12px;">
                            <div style="font-weight:700; font-size:14px; color:#0ea5e9; margin-bottom:6px;">${benefits.title1}</div>
                            <div style="font-size:13px; color:#44525f; line-height:1.5;">${benefits.text1}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="stack" width="33.33%" style="padding:8px;">
                      <table role="presentation" width="100%" style="border:1px solid #eef2f7; border-radius:10px;">
                        <tr>
                          <td style="padding:12px;">
                            <div style="font-weight:700; font-size:14px; color:#0ea5e9; margin-bottom:6px;">${benefits.title2}</div>
                            <div style="font-size:13px; color:#44525f; line-height:1.5;">${benefits.text2}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="stack" width="33.33%" style="padding:8px;">
                      <table role="presentation" width="100%" style="border:1px solid #eef2f7; border-radius:10px;">
                        <tr>
                          <td style="padding:12px;">
                            <div style="font-weight:700; font-size:14px; color:#0ea5e9; margin-bottom:6px;">${benefits.title3}</div>
                            <div style="font-size:13px; color:#44525f; line-height:1.5;">${benefits.text3}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Optional Two-Image Row -->
                ${image1Url && image2Url ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">
                  <tr>
                    <td class="stack" width="50%" style="padding:8px;">
                      <img src="${image1Url}" alt="${image1Caption}" width="268" style="display:block; width:100%; max-width:268px; height:auto; border-radius:10px;">
                      <div style="font-size:12px; color:#6b7a8a; margin-top:6px;">${image1Caption}</div>
                    </td>
                    <td class="stack" width="50%" style="padding:8px;">
                      <img src="${image2Url}" alt="${image2Caption}" width="268" style="display:block; width:100%; max-width:268px; height:auto; border-radius:10px;">
                      <div style="font-size:12px; color:#6b7a8a; margin-top:6px;">${image2Caption}</div>
                    </td>
                  </tr>
                </table>
                ` : ''}

                <!-- Video / Webpage Links -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f7fb; border:1px solid #dbeaf3; border-radius:10px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <div style="font-weight:700; font-size:14px; color:#0b2538; margin-bottom:6px;">Learn More</div>
                      <div style="font-size:13px; color:#44525f; line-height:1.6;">
                        ${videoUrl ? `▶️ Video: <a href="${videoUrl}" style="color:#0ea5e9; text-decoration:none;">Watch here</a><br>` : ''}
                        ${webpageUrl ? `🌐 Webpage: <a href="${webpageUrl}" style="color:#0ea5e9; text-decoration:none;">Open link</a>` : ''}
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:20px auto 8px;">
                  <tr>
                    <td align="center" bgcolor="#0ea5e9" style="border-radius:8px;">
                      <a href="${primaryCtaUrl}" class="button" style="display:inline-block; padding:12px 22px; font-weight:700; font-size:14px; color:#ffffff; text-decoration:none; border-radius:8px; background:#0ea5e9;">${primaryCtaLabel}</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:12px 0 0; font-size:13px; color:#6b7a8a;">Need help? Reply to this email or contact <a href="mailto:support@cleanerscompare.com" style="color:#0ea5e9; text-decoration:none;">support@cleanerscompare.com</a>.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 24px; background:#0b2538; color:#c9d6e2; font-size:12px;">
                <div style="margin-bottom:6px;">You're receiving this because you're a registered buyer on Cleaners Compare.</div>
                <div>Manage preferences: <a href="${preferencesUrl}" style="color:#22d3ee; text-decoration:none;">Update alerts</a> · <a href="${unsubscribeUrl}" style="color:#22d3ee; text-decoration:none;">Unsubscribe</a></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;

    const result = await resend.emails.send({
      from: 'CleanersCompare <noreply@yummymeatrecipes.com>',
      to,
      subject: title,
      html,
    });

    console.log(`Broadcast email sent to ${Array.isArray(to) ? to.length : 1} recipient(s)`);
    return result;
  } catch (error) {
    console.error('Error sending broadcast email:', error);
    throw error;
  }
}

// Utility function for sending to multiple customers
export async function sendBulkBroadcast(customers: Array<{
  email: string;
  firstName: string;
}>, broadcastParams: Omit<BroadcastEmailParams, 'to' | 'firstName'>) {
  try {
    const results = [];
    
    for (const customer of customers) {
      try {
        const result = await sendBroadcastMessage({
          ...broadcastParams,
          to: customer.email,
          firstName: customer.firstName,
        });
        results.push({ email: customer.email, success: true, result });
      } catch (error) {
        results.push({ email: customer.email, success: false, error });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`Bulk broadcast completed: ${successful} successful, ${failed} failed`);
    return results;
  } catch (error) {
    console.error('Error in bulk broadcast:', error);
    throw error;
  }
}