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

            if (!productId) {
              console.warn('[STOCK SKIP] no product id for line item', item);
              continue;
            }

            try {
              console.log(`[STOCK PROCESS] product=${productId} qty=${purchasedQty}`);

              // Retrieve current product details from Stripe
              const currentProduct = await stripe.products.retrieve(productId);
              const currentStockStr = currentProduct.metadata?.stock ?? currentProduct.metadata?.quantity ?? currentProduct.metadata?.inventory ?? currentProduct.metadata?.count ?? currentProduct.metadata?.available ?? currentProduct.metadata?.in_stock ?? '0';
              const currentStock = parseInt(currentStockStr, 10);
              const prevStock = isNaN(currentStock) ? 0 : currentStock;

              // Calculate new stock quantity (ensure it doesn't go below 0)
              const newStock = Math.max(0, prevStock - purchasedQty);

              const newMetadata = { ...currentProduct.metadata, stock: String(newStock) };

              // Update product metadata with retries for transient errors
              let updated = null;
              const maxAttempts = 3;
              for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                  updated = await stripe.products.update(productId, { metadata: newMetadata });
                  console.log(`[STOCK UPDATE] product=${productId} attempt=${attempt} updatedStock=${newStock}`);
                  break;
                } catch (err) {
                  const status = err && err.statusCode ? err.statusCode : null;
                  const isRetryable = status === 429 || (status >= 500 && status < 600);
                  console.error(`[STOCK UPDATE ERROR] product=${productId} attempt=${attempt}`, err?.message || err);
                  if (attempt < maxAttempts && isRetryable) {
                    const delayMs = 500 * Math.pow(2, attempt - 1);
                    await new Promise((res) => setTimeout(res, delayMs));
                    continue;
                  }
                  // Non-retryable or max attempts reached
                  throw err;
                }
              }

              // Verify update persisted
              try {
                const verified = await stripe.products.retrieve(productId);
                const verifiedStockStr = verified.metadata?.stock ?? verified.metadata?.quantity ?? '0';
                const verifiedStock = parseInt(verifiedStockStr, 10);
                console.log(`[STOCK VERIFIED] product=${productId} verifiedStock=${isNaN(verifiedStock) ? 'NaN' : verifiedStock}`);
              } catch (verErr) {
                console.error(`[STOCK VERIFY ERROR] product=${productId}`, verErr?.message || verErr);
              }
            } catch (procErr) {
              console.error(`[STOCK PROCESS ERROR] product=${productId}`, procErr?.message || procErr);
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
