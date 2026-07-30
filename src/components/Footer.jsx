'use client';

import { ShieldCheck, Heart } from 'lucide-react';

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

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-body)] text-xs py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/40 shrink-0">
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

        <div className="flex items-center space-x-6 text-[var(--text-body)]">
          <a
            href="https://www.instagram.com/the_valkyrie_of_avalon/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-semibold"
            aria-label="Follow on Instagram"
          >
            <InstagramIcon className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <span>@the_valkyrie_of_avalon</span>
          </a>

          <div className="flex items-center space-x-1.5 text-[var(--text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Stripe Encrypted</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[var(--text-muted)]">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Handmade</span>
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-muted)]">
          © {new Date().getFullYear()} The Valkyrie of Avalon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
