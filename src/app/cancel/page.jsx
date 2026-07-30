'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  const { setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-main)] text-[var(--text-body)] transition-colors duration-300">
      <Header />

      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-xl">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-[var(--text-heading)]">
          Checkout Was Cancelled
        </h1>

        <p className="mt-4 text-[var(--text-body)] text-sm leading-relaxed">
          No charges were made to your account. Your craft basket remains saved in your browser so you can resume your checkout whenever you are ready.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-sm transition-all shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Open Basket & Resume Checkout</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-heading)] text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
        </div>
      </div>

      <CartDrawer />
      <Footer />
    </div>
  );
}
