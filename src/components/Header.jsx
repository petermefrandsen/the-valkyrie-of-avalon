'use client';

import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { ShoppingBag, ShieldCheck, Sun, Moon } from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[var(--header-bg)] border-b border-[var(--border-color)] transition-colors duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-900 dark:border-amber-400/60 shadow-md group-hover:scale-105 transition-transform duration-300 bg-[var(--bg-card)] shrink-0">
            <img
              src="/images/logo.png"
              alt="The Valkyrie of Avalon Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-serif text-sm sm:text-xl lg:text-2xl font-black tracking-wider text-[var(--text-heading)] uppercase">
              The Valkyrie <span className="text-[var(--accent-gold)] font-extrabold">of Avalon</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] tracking-widest text-[var(--text-body)] font-bold uppercase hidden sm:block">Handcrafted Artisan Goods</p>
          </div>
        </div>

        {/* Right Section: Instagram Link, Security Badge, Theme Toggle & Basket Button */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Instagram Social Link */}
          <a
            href="https://www.instagram.com/the_valkyrie_of_avalon/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-pink-600 dark:text-pink-400 hover:scale-105 transition-all shadow-xs flex items-center justify-center cursor-pointer"
            title="Follow on Instagram (@the_valkyrie_of_avalon)"
            aria-label="Instagram Profile"
          >
            <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>

          {/* Security Badge */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-bold text-[var(--text-body)] bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 rounded-full shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Stripe Encrypted</span>
          </div>

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-[var(--toggle-bg)] border border-[var(--toggle-border)] text-[var(--toggle-text)] hover:opacity-90 transition-all shadow-xs cursor-pointer flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800 hover:-rotate-12 transition-transform" />
              )}
            </button>
          )}

          {/* High Contrast Basket Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative group flex items-center space-x-1.5 sm:space-x-2 bg-[var(--accent-gold)] hover:opacity-90 text-white font-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 shadow-md cursor-pointer active:scale-95"
            aria-label="View Shopping Basket"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform text-white shrink-0" />
            <span className="text-xs sm:text-sm font-black text-white hidden sm:inline">Basket</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] sm:text-xs font-black text-slate-950 bg-white rounded-full animate-pulse shadow-md">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
