'use client';

import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { ShoppingBag, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--header-bg)] border-b border-[var(--border-color)] transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--border-color)] shadow-md group-hover:scale-105 transition-transform duration-300 bg-[var(--bg-card)]">
            <img
              src="/images/logo.png"
              alt="The Valkyrie of Avalon Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-black tracking-wider text-[var(--text-heading)] uppercase">
              The Valkyrie <span className="text-[var(--accent-gold)] font-extrabold">of Avalon</span>
            </h1>
            <p className="text-[10px] tracking-widest text-[var(--text-body)] font-bold uppercase">Handcrafted Artisan Goods</p>
          </div>
        </div>

        {/* Right Section: Security Badge, Theme Toggle & Basket Button */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* Security Badge */}
          <div className="hidden md:flex items-center space-x-2 text-xs font-bold text-[var(--text-body)] bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 rounded-full shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Stripe Encrypted</span>
          </div>

          {/* Theme Toggle Button - Pure White background in Light Mode */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--toggle-bg)] border border-[var(--toggle-border)] text-[var(--toggle-text)] hover:opacity-90 transition-all shadow-xs cursor-pointer flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-800 hover:-rotate-12 transition-transform" />
              )}
            </button>
          )}

          {/* High Contrast Basket Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative group flex items-center space-x-2 bg-[var(--accent-gold)] hover:opacity-90 text-white font-black px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md cursor-pointer active:scale-95"
            aria-label="View Shopping Basket"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-white" />
            <span className="text-sm font-black hidden sm:inline text-white">Basket</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-black text-slate-950 bg-white rounded-full animate-pulse shadow-md">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
