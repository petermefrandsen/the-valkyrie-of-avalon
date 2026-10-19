import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { loadCatalog } from '@/lib/catalog';

const MAX_LINE_ITEMS = 20;
const MAX_QUANTITY_PER_ITEM = 10;

const SHIPPING_RATES = {
  usd: { standard: 800, express: 1800 },
  dkk: { standard: 4900, express: 12000 },
  eur: { standard: 700, express: 1600 },
};

function resolveSiteUrl(request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  // Request headers are client-controlled, so only trust them outside production.
  if (process.env.NODE_ENV !== 'production') {
    return request.headers.get('origin') || 'http://localhost:3000';
  }
  return null;
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const requested = body?.items;
    if (!Array.isArray(requested) || requested.length === 0) {
      return NextResponse.json({ error: 'Basket is empty' }, { status: 400 });
    }
    if (requested.length > MAX_LINE_ITEMS) {
      return NextResponse.json({ error: 'Too many items in basket' }, { status: 400 });
    }

    const siteUrl = resolveSiteUrl(request);
    if (!siteUrl) {
      console.error('[CHECKOUT CONFIG ERROR] NEXT_PUBLIC_SITE_URL is not configured');
      return NextResponse.json({ error: 'Checkout is not configured' }, { status: 500 });
    }

    // Only product id and quantity are taken from the client; price, currency
    // and stock always come from the server-side catalog.
    const { products } = await loadCatalog();
    const catalog = new Map(products.map((p) => [p.id, p]));
    const quantities = new Map();

    for (const entry of requested) {
      const quantity = entry?.quantity;
      const product = typeof entry?.id === 'string' ? catalog.get(entry.id) : undefined;

      if (!product) {
        return NextResponse.json({ error: 'Unknown product in basket' }, { status: 400 });
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
      }
      quantities.set(product.id, (quantities.get(product.id) || 0) + quantity);
    }

    const cartItems = [];
    for (const [id, quantity] of quantities) {
      const product = catalog.get(id);
      if (quantity > MAX_QUANTITY_PER_ITEM || quantity > product.stock) {
        return NextResponse.json(
          { error: `Requested quantity not available for "${product.name}"` },
          { status: 400 },
        );
      }
      if (!Number.isInteger(product.price) || product.price <= 0) {
        return NextResponse.json({ error: `"${product.name}" is not available for purchase` }, { status: 400 });
      }
      cartItems.push({ product, quantity });
    }

    const cartCurrency = cartItems[0].product.currency.toLowerCase();
    if (cartItems.some(({ product }) => product.currency.toLowerCase() !== cartCurrency)) {
      return NextResponse.json({ error: 'Basket items must share one currency' }, { status: 400 });
    }

    const rates = SHIPPING_RATES[cartCurrency] || SHIPPING_RATES.usd;

    // If Stripe Secret Key is available, create real Stripe Checkout Session
    if (stripe && process.env.STRIPE_SECRET_KEY) {
      const lineItems = cartItems.map(({ product, quantity }) => {
        // Real Stripe Price IDs come from the server-side catalog, never the client
        if (product.priceId && product.priceId.startsWith('price_') && !product.priceId.includes('mock')) {
          return { price: product.priceId, quantity };
        }

        return {
          price_data: {
            currency: cartCurrency,
            product_data: {
              name: product.name,
              description: product.description || `Handcrafted craft item`,
              images: product.images && product.images.length > 0 ? [product.images[0]] : [],
            },
            unit_amount: product.price,
          },
          quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        shipping_address_collection: {
          allowed_countries: [
            'US', 'CA', 'GB', 'DK', 'SE', 'NO', 'FI', 'DE', 'FR', 'NL', 'BE', 'AT', 'CH', 'ES', 'IT', 'IE', 'AU', 'NZ'
          ],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: rates.standard,
                currency: cartCurrency,
              },
              display_name: 'Standard Artisan Shipping (Tracked Parcel)',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 3 },
                maximum: { unit: 'business_day', value: 7 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: rates.express,
                currency: cartCurrency,
              },
              display_name: 'Express Priority Courier',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 1 },
                maximum: { unit: 'business_day', value: 3 },
              },
            },
          },
        ],
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cancel`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Demo Mode fallback: Simulate successful redirect
    console.log('Stripe secret key not set. Simulating Checkout redirect...');
    return NextResponse.json({
      url: `${siteUrl}/success?demo=true&order_id=VALK-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
