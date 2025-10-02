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
        from: 'orders@yummymeatrecipes.com',
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
  return ['info@exclusivecleaners.co.uk', 'accounts@exclusivecleaners.co.uk']
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
          from: 'orders@yummymeatrecipes.com',
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