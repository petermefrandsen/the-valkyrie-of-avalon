import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Basket is empty' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // If Stripe Secret Key is available, create real Stripe Checkout Session
    if (stripe && process.env.STRIPE_SECRET_KEY) {
      const lineItems = items.map((item) => {
        // If item has a valid Stripe Price ID (starts with 'price_'), use it directly
        if (item.priceId && item.priceId.startsWith('price_') && !item.priceId.includes('mock')) {
          return {
            price: item.priceId,
            quantity: item.quantity,
          };
        }

        // Otherwise construct inline price data for dynamic/test items
        return {
          price_data: {
            currency: item.currency || 'usd',
            product_data: {
              name: item.name,
              description: item.description || `Handcrafted craft item`,
              images: item.images && item.images.length > 0 ? [item.images[0]] : [],
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
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
                amount: 800, // $8.00 Standard Shipping
                currency: 'usd',
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
                amount: 1800, // $18.00 Express International
                currency: 'usd',
              },
              display_name: 'Express Priority Courier',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 1 },
                maximum: { unit: 'business_day', value: 3 },
              },
            },
          },
        ],
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Demo Mode fallback: Simulate successful redirect
    console.log('Stripe secret key not set. Simulating Checkout redirect...');
    return NextResponse.json({
      url: `${origin}/success?demo=true&order_id=VALK-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
