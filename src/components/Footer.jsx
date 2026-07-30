'use client';

import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-body)] text-xs py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-teal-500/40 shrink-0">
            <img
              src="/images/logo.png"
              alt="The Valkyrie of Avalon Emblem"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-serif font-bold text-[var(--text-heading)] uppercase tracking-wider">The Valkyrie of Avalon</p>
            <p className="text-[10px] text-[var(--text-muted)]">Handcrafted artisan goods & small-batch creations.</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-[var(--text-muted)]">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Stripe Encrypted Payments</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Made with passion</span>
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-muted)]">
          © {new Date().getFullYear()} The Valkyrie of Avalon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
