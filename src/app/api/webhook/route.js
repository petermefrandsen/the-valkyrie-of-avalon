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

  // Handle successful purchase events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`[ORDER COMPLETED] Session: ${session.id}, Customer: ${session.customer_details?.email}`);

      if (stripe && session.id) {
        try {
          // Retrieve session line items from Stripe to inspect purchased quantities
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            expand: ['data.price.product'],
          });

          for (const item of lineItems.data) {
            const product = item.price?.product;
            const productId = typeof product === 'string' ? product : product?.id;
            const purchasedQty = item.quantity || 1;

            if (productId) {
              // Retrieve current product details from Stripe
              const currentProduct = await stripe.products.retrieve(productId);
              const currentStockStr = currentProduct.metadata?.stock || currentProduct.metadata?.quantity || '0';
              const currentStock = parseInt(currentStockStr, 10);

              // Calculate new stock quantity (ensure it doesn't go below 0)
              const newStock = Math.max(0, currentStock - purchasedQty);

              // Update product metadata directly in Stripe
              await stripe.products.update(productId, {
                metadata: {
                  ...currentProduct.metadata,
                  stock: String(newStock),
                },
              });

              console.log(`[STOCK UPDATED] Product ${productId} (${currentProduct.name}) stock reduced from ${currentStock} to ${newStock}.`);
            }
          }
        } catch (updateErr) {
          console.error('[STOCK UPDATE ERROR] Failed to decrement Stripe product stock:', updateErr);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
