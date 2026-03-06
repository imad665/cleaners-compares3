// utils/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sentToSeller(itemsBySeller: any, order: any, adminEmail?: string) {
  await Promise.all(
    Object.values(itemsBySeller).map(async (sellerData: any) => {
      const sellerItems = sellerData.items;
      const sellerEmail = adminEmail || sellerData.seller.email;//'programmingi77i@gmail.com' //;
      const baseUrl = process.env.NEXTAUTH_URL;
      const linkOrder = `${baseUrl}/admin/orders`
      await resend.emails.send({
        from: 'orders@cleanerscompare.com',
        to: sellerEmail,
        subject: `New Order #${order.id} - Your Products Need Shipping`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">New Order Received</h1>
              <p>You have new products that require shipping in order #${order.id}:</p>
              
              <h2 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 8px;">Your Items</h2>
              <ul style="list-style: none; padding: 0;">
                ${sellerItems.map((item: any) => `
                  <li style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                    <div style="display: flex; gap: 15px;">
                      <img 
                        src="${item.product.imagesUrl[0]}" 
                        alt="${item.product.title}" 
                        style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;"
                      >
                      <div>
                        <h3 style="margin: 0 0 5px 0;">${item.product.title}</h3>
                        <p style="margin: 0;">Quantity: ${item.quantity}</p>
                        <p style="margin: 0;">Price: £${(item.unitPrice/*  * item.quantity */).toFixed(2)}</p>
                      </div>
                    </div>
                  </li>
                `).join('')}
              </ul>
              
              <div style="margin-top: 20px; padding: 15px; background: #f8f8f8; border-radius: 4px;">
                <p style="margin: 0 0 10px 0;"><strong>Shipping Instructions:</strong></p>
                <p style="margin: 0;">Please ship these items within 2 business days.</p>
              </div>
              
              <div style="margin-top: 25px; text-align: center;">
                <a 
                  href="${linkOrder}" 
                  style="
                    display: inline-block; 
                    padding: 10px 20px; 
                    background: #2563eb; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 4px;
                  "
                >
                  View Full Order Details
                </a>
              </div>
            </div>
          `
      });
    })
  );
}

export function getAdminCompanyEmails() {
  return ['info@exclusivecleaners.co.uk', 'accounts@exclusivecleaners.co.uk', 'amirshahz77@yahoo.co.uk']
}

export async function notifySellerByEmail(order: any) {
  try {
    // Group order items by seller
    const itemsBySeller: Record<string, any> = {};

    order.orderItems.forEach((item: any) => {
      const sellerId = item.sellerId;
      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = {
          seller: item.seller,
          items: []
        };
      }
      itemsBySeller[sellerId].items.push(item);
    });

    //console.log(itemsBySeller);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    // Send email to each seller with their specific items
    await sentToSeller(itemsBySeller, order);
    for (const email of getAdminCompanyEmails()) {
      await delay(2000); // wait 2 seconds before sending each email
      await sentToSeller(itemsBySeller, order, email);
    }
    await Promise.all(
      Object.values(itemsBySeller).map(async (sellerData) => {
        const sellerItems = sellerData.items;
        const sellerEmail = sellerData.seller.email;//'programmingi77i@gmail.com' //;
        const baseUrl = process.env.NEXTAUTH_URL;
        const linkOrder = `${baseUrl}/admin/orders`
        await resend.emails.send({
          from: 'orders@cleanerscompare.com',
          to: sellerEmail,
          subject: `New Order #${order.id} - Your Products Need Shipping`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">New Order Received</h1>
              <p>You have new products that require shipping in order #${order.id}:</p>
              
              <h2 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 8px;">Your Items</h2>
              <ul style="list-style: none; padding: 0;">
                ${sellerItems.map((item: any) => `
                  <li style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                    <div style="display: flex; gap: 15px;">
                      <img 
                        src="${item.product.imagesUrl[0]}" 
                        alt="${item.product.title}" 
                        style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;"
                      >
                      <div>
                        <h3 style="margin: 0 0 5px 0;">${item.product.title}</h3>
                        <p style="margin: 0;">Quantity: ${item.quantity}</p>
                        <p style="margin: 0;">Price: £${(item.unitPrice/*  * item.quantity */).toFixed(2)}</p>
                      </div>
                    </div>
                  </li>
                `).join('')}
              </ul>
              
              <div style="margin-top: 20px; padding: 15px; background: #f8f8f8; border-radius: 4px;">
                <p style="margin: 0 0 10px 0;"><strong>Shipping Instructions:</strong></p>
                <p style="margin: 0;">Please ship these items within 2 business days.</p>
              </div>
              
              <div style="margin-top: 25px; text-align: center;">
                <a 
                  href="${linkOrder}" 
                  style="
                    display: inline-block; 
                    padding: 10px 20px; 
                    background: #2563eb; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 4px;
                  "
                >
                  View Full Order Details
                </a>
              </div>
            </div>
          `
        });
      })
    );
  } catch (error) {
    console.error('Failed to send seller notification email:', error);
    // Consider adding error logging service here
  }
}



/* FORWARD A MESSAGE FROM CUSTOMER TO SELLER WHEN CUSTOMER SEND A MESSAGE TO SELLER IN PRODUCT PAGE */

export interface MessageNotificationProps {
  productName: string;
  sellerName: string;
  sellerEmail: string;
  customerMessage: string;
  productImage?: string;
  productPath?:string;
 
}

export async function notifySellerOfCustomerMessage({
  productName,
  sellerName,
  sellerEmail,
  customerMessage,
  productImage,
  productPath,
 
}: MessageNotificationProps) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const productLink = `${baseUrl}/${productPath}`;
    const inboxLink = `${baseUrl}/inbox`;

    // Build contact information section
    const contactInfoHtml = ``;

    await resend.emails.send({
      from: 'messages@cleanerscompare.com',
      to: sellerEmail,
      subject: `New Message About Your Product: ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">📬 New Customer Inquiry</h1>
            <p style="color: #666; margin-top: 5px;">Someone is interested in your product</p>
          </div>

          <!-- Seller Greeting -->
          <div style="margin-bottom: 25px;">
            <p style="color: #333; font-size: 16px;">Hello ${sellerName},</p>
            <p style="color: #555; line-height: 1.5;">
              You've received a new message from a potential customer about your product:
              <strong style="color: #2563eb;">${productName}</strong>
            </p>
          </div>

          <!-- Product Info -->
          <div style="
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 25px;
          ">
            <div style="display: flex; gap: 15px; align-items: center;">
              ${productImage ? `
                <img 
                  src="${productImage}" 
                  alt="${productName}" 
                  style="
                    width: 80px; 
                    height: 80px; 
                    object-fit: cover; 
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                  "
                >
              ` : ''}
              <div>
                <h3 style="margin: 0 0 5px 0; color: #1e293b;">${productName}</h3>
                <a 
                  href="${productLink}" 
                  style="
                    color: #2563eb; 
                    text-decoration: none; 
                    font-size: 14px;
                  "
                >
                  View Product →
                </a>
              </div>
            </div>
          </div>

          <!-- Customer Message -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #333; margin-bottom: 10px; font-size: 16px;">✉️ Customer Message:</h3>
            <div style="
              background: #ffffff;
              border-left: 4px solid #2563eb;
              border-radius: 4px;
              padding: 15px;
              margin: 0;
              color: #1e293b;
              font-style: italic;
              line-height: 1.6;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            ">
              "${customerMessage}"
            </div>
          </div>

          <!-- Contact Information -->
          ${contactInfoHtml}

         

          <!-- Tips for Seller -->
           <!-- 
           <div style="
            background: #f8fafc;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #475569;
          ">
            <p style="margin: 0 0 8px 0;"><strong>💡 Tips for responding:</strong></p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Respond promptly - customers appreciate quick replies</li>
              <li>Be specific about product details they asked about</li>
              <li>Include relevant information about shipping or availability</li>
              <li>Keep your response professional and friendly</li>
            </ul>
          </div>
          -->

          <!-- Footer -->
          <div style="
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            margin-top: 20px;
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
          ">
            <p style="margin: 0 0 5px 0;">
              This message was sent via CleanersCompare marketplace
            </p>
            <p style="margin: 0;">
              © ${new Date().getFullYear()} CleanersCompare. All rights reserved.
            </p>
          </div>
        </div>
      `
    });

    console.log(`Message notification sent to seller: ${sellerEmail}`);
  } catch (error) {
    console.error('Failed to send message notification email:', error);
    throw error;
  }
}