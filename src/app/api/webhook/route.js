import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret && sig && stripe) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error(`Webhook Signature Verification Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`[ORDER SUCCESS] Payment received for session ${session.id}. Customer Email: ${session.customer_details?.email}`);
      // Here you can add email notifications, inventory reduction, or order fulfillment tracking
      break;
    }
    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
