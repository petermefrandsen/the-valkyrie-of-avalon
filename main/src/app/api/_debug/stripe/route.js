import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured on server' }, { status: 500 });
    }

    // Retrieve the account the server key belongs to
    let account = null;
    try {
      account = await stripe.accounts.retrieve();
    } catch (err) {
      // Some keys (platform integration) may not allow account retrieval; fall back
      account = { id: null, livemode: null };
    }

    // Fetch first page of active products to report count (limit=100)
    const productsResp = await stripe.products.list({ active: true, limit: 100 });
    const productCount = Array.isArray(productsResp.data) ? productsResp.data.length : 0;

    // Mask account id except last 6 chars
    const acctId = account && account.id ? account.id : null;
    const maskedAccountId = acctId ? acctId.replace(/.(?=.{6})/g, '*') : null;

    return NextResponse.json({
      accountId: maskedAccountId,
      liveMode: account?.livemode ?? null,
      productCount,
      has_more: productsResp.has_more ?? false,
    });
  } catch (err) {
    console.error('Debug stripe endpoint error:', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
