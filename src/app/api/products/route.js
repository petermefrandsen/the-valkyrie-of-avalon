import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export async function GET() {
  try {
    // If Stripe secret key is configured, fetch live products & prices from Stripe
    if (stripe && process.env.STRIPE_SECRET_KEY) {
      const productsResponse = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
      });

      const products = productsResponse.data.map((prod) => {
        const defaultPrice = prod.default_price;
        const priceInCents = defaultPrice ? defaultPrice.unit_amount : 0;
        const currency = defaultPrice ? defaultPrice.currency : 'usd';
        const priceId = defaultPrice ? defaultPrice.id : null;

        // Parse stock from metadata or default to 5
        const stock = prod.metadata?.stock ? parseInt(prod.metadata.stock, 10) : 5;
        const category = prod.metadata?.category || 'Crafts';
        const materials = prod.metadata?.materials || 'Artisan materials';
        const dimensions = prod.metadata?.dimensions || 'Standard size';

        return {
          id: prod.id,
          name: prod.name,
          description: prod.description || 'Handmade artisan craft.',
          price: priceInCents,
          currency: currency,
          priceId: priceId,
          category: category,
          images: prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
          stock: stock,
          batchSize: `Batch of ${stock} items`,
          materials: materials,
          dimensions: dimensions,
        };
      });

      return NextResponse.json({ products, source: 'stripe' });
    }

    // Fallback to rich mock craft data for instant preview & testing
    return NextResponse.json({ products: MOCK_PRODUCTS, source: 'mock' });
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json({ products: MOCK_PRODUCTS, source: 'mock_fallback', error: error.message });
  }
}
