import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const STOCK_KEYS = ['stock', 'quantity', 'inventory', 'count', 'available', 'in_stock'];

function getStock(metadata) {
  for (const key of STOCK_KEYS) {
    const value = metadata?.[key];
    if (value !== undefined && value !== null && value !== '') {
      const stock = Number.parseInt(value, 10);
      return Number.isNaN(stock) ? null : stock;
    }
  }

  return null;
}

async function updateProductStock(productId, purchasedQuantity, eventId) {
  const currentProduct = await stripe.products.retrieve(productId);

  if (currentProduct.metadata?.last_stock_event === eventId) {
    console.log(`[STOCK SKIP] product=${productId} event=${eventId} already processed`);
    return;
  }

  const currentStock = getStock(currentProduct.metadata);
  if (currentStock === null) {
    console.warn(`[STOCK SKIP] product=${productId} has no valid stock metadata`);
    return;
  }

  const newStock = Math.max(0, currentStock - purchasedQuantity);
  const metadata = {
    ...currentProduct.metadata,
    stock: String(newStock),
    last_stock_event: eventId,
  };

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await stripe.products.update(productId, { metadata });
      break;
    } catch (error) {
      const status = error?.statusCode;
      const retryable = status === 429 || (status >= 500 && status < 600);

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
    }
  }

  const verifiedProduct = await stripe.products.retrieve(productId);
  const verifiedStock = getStock(verifiedProduct.metadata);

  if (
    verifiedStock !== newStock ||
    verifiedProduct.metadata?.last_stock_event !== eventId
  ) {
    throw new Error(`Stock verification failed for product ${productId}`);
  }

  console.log(
    `[STOCK UPDATED] product=${productId} event=${eventId} stock=${currentStock}->${newStock}`,
  );
}

export async function POST(request) {
  if (!stripe || !process.env.STRIPE_SECRET_KEY) {
    console.error('[WEBHOOK CONFIG ERROR] STRIPE_SECRET_KEY is not configured');
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[WEBHOOK CONFIG ERROR] STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error(`[WEBHOOK SIGNATURE ERROR] ${error.message}`);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
      limit: 100,
    });

    for (const item of lineItems.data) {
      const product = item.price?.product;
      const productId = typeof product === 'string' ? product : product?.id;

      if (!productId) {
        throw new Error(`No product ID found for line item ${item.id}`);
      }

      await updateProductStock(productId, item.quantity || 1, event.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[WEBHOOK PROCESSING ERROR] event=${event.id}`, error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
