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
        const currency = defaultPrice ? defaultPrice.currency : 'dkk';
        const priceId = defaultPrice ? defaultPrice.id : null;

        // Extract stock quantity from product metadata (check keys: stock, quantity, inventory, count, available)
        const meta = prod.metadata || {};
        const rawStock = meta.stock ?? meta.quantity ?? meta.inventory ?? meta.count ?? meta.available ?? meta.in_stock;

        let stock = 0; // Default to 0 (Out of Stock / Sold Out) if no stock metadata is provided in Stripe

        if (rawStock !== undefined && rawStock !== null && rawStock !== '') {
          stock = parseInt(rawStock, 10);
        } else {
          // Check description for stock hints (e.g., "Stock: 2", "2 items available")
          const descMatch = (prod.description || '').match(/(?:stock|available|quantity|inventory):\s*(\d+)/i);
          if (descMatch) {
            stock = parseInt(descMatch[1], 10);
          }
        }

        const category = meta.category || 'Crafts';
        const materials = meta.materials || 'Artisan materials';
        const dimensions = meta.dimensions || 'Standard size';

        return {
          id: prod.id,
          name: prod.name,
          description: prod.description || 'Handmade artisan craft item.',
          price: priceInCents,
          currency: currency,
          priceId: priceId,
          category: category,
          images: prod.images && prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
          stock: isNaN(stock) ? 0 : Math.max(0, stock),
          batchSize: stock > 0 ? `Batch of ${stock} items` : 'Sold Out',
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
