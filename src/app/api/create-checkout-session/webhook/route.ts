import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text(); // Important: don't use `await req.json()`

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const metadata = session.metadata;
      const productId = metadata.productId;
      const days = parseInt(metadata.days);
      const type = metadata.type;
      console.log(metadata);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + days);

      if (type === 'service-feature') {
        await prisma.service.update({
          where: { id: productId },
          data: {
            isFeatured: true,
            featuredStartDate: startDate,
            featuredEndDate: endDate,
          }
        })
        console.log(`✅ service ${productId} is now featured for ${days} days`);
      
      } else {
        await prisma.product.update({
          where: { id: productId },
          data: {
            isFeatured: true,
            featuredStartDate: startDate,
            featuredEndDate: endDate,
          },
        });
        console.log(`✅ Product ${productId} is now featured for ${days} days`);
      }


    } catch (error) {
      console.error("❌ DB Update failed:", error);
      return new NextResponse("Failed to update product", { status: 500 });
    }
  }
  return NextResponse.json({ received: true });
}
