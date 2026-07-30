import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { MOCK_PRODUCTS } from '@/lib/mockData';

// Custom Stock Override Map for products where Stripe metadata has not been added yet
const STOCK_OVERRIDE_MAP = {
  'test thing': 2,
  'rhysand earrings': 5,
  'prod_uyryjzycdzuxr': 2,
  'prod_uyrtbkafnf1bdx': 5,
};

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
        const rawStock = meta.stock || meta.quantity || meta.inventory || meta.count || meta.available || meta.in_stock;

        // Lookup fallback override by product name or ID if metadata is empty
        const productNameLower = (prod.name || '').toLowerCase().trim();
        const productIdLower = (prod.id || '').toLowerCase().trim();
        const mapOverride = STOCK_OVERRIDE_MAP[productNameLower] ?? STOCK_OVERRIDE_MAP[productIdLower];

        let stock = mapOverride !== undefined ? mapOverride : 5;

        if (rawStock !== undefined && rawStock !== null && rawStock !== '') {
          stock = parseInt(rawStock, 10);
        } else {
          // Check description for stock hints (e.g., "Stock: 2", "2 items available")
          const descMatch = (prod.description || '').match(/(?:stock|available|quantity|inventory):\s*(\d+)/i);
          if (descMatch) {
            stock = parseInt(descMatch[1], 10);
          }
        }

        const category = meta.category || (productNameLower.includes('earring') || productNameLower.includes('jewelry') ? 'Forged Jewelry' : 'Crafts');
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
          stock: isNaN(stock) ? 5 : stock,
          batchSize: `Batch of ${isNaN(stock) ? 5 : stock} items`,
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
