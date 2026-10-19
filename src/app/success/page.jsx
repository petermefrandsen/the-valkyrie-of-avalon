'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, Sparkles, Package, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [fallbackOrderId] = useState(() => `VALK-${Math.floor(100000 + Math.random() * 900000)}`);
  const orderId = searchParams.get('order_id') || searchParams.get('session_id') || fallbackOrderId;

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Order Received</span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-heading)]">
        Thank You for Your Artisan Order!
      </h1>

      <p className="mt-4 text-[var(--text-body)] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
        Your payment has been securely processed by Stripe. I am preparing your handcrafted items in my atelier and will dispatch your package shortly.
      </p>

      {/* Order Details Card */}
      <div className="mt-8 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-left space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Order Reference</span>
          <span className="text-sm font-mono font-bold text-teal-700 dark:text-amber-300">{orderId}</span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-[var(--text-body)]">
          <Package className="w-4 h-4 text-teal-600 dark:text-cyan-400 shrink-0" />
          <span>Fulfillment Stage: <strong className="text-[var(--text-heading)]">Preparing Craft & Dispatch</strong></span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-[var(--text-body)]">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Confirmation email & tracking number sent to your email address.</span>
        </div>
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-sm transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workshop Catalog</span>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-main)] text-[var(--text-body)] transition-colors duration-300">
      <Header />
      <Suspense fallback={<div className="text-center py-20 text-[var(--text-muted)]">Loading order receipt...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
