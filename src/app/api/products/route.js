import { NextResponse } from 'next/server';
import { loadCatalog } from '@/lib/catalog';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export async function GET() {
  try {
    return NextResponse.json(await loadCatalog());
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json({ products: MOCK_PRODUCTS, source: 'mock_fallback' });
  }
}
