'use client';

import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-20 border-b border-[var(--border-color)] transition-colors duration-300">
      {/* Background Glow Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        
        {/* Emblem Logo - Hidden on mobile, shown on tablet/desktop */}
        <div className="mx-auto mb-4 sm:mb-6 hidden sm:flex items-center justify-center">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-300 shadow-xl hover:scale-105 transition-transform duration-500">
            <img
              src="/images/logo.png"
              alt="The Valkyrie of Avalon Emblem"
              className="w-full h-full object-cover rounded-full bg-slate-900"
            />
          </div>
        </div>

        {/* Small Batch Badge */}
        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[var(--text-heading)] text-[var(--bg-main)] border border-[var(--border-color)] text-[10px] sm:text-xs font-extrabold tracking-wider uppercase mb-4 sm:mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span>Small Batch & Single-Edition Crafts</span>
        </div>

        {/* Responsive Headline */}
        <h2 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-heading)] leading-tight max-w-4xl mx-auto px-2">
          Forged in Avalon, <br className="hidden sm:inline" />
          <span className="text-[var(--accent-gold)] font-extrabold">
            Crafted by Hand for Eternity
          </span>
        </h2>

        {/* Story Subtitle */}
        <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-[var(--text-body)] font-medium max-w-2xl mx-auto leading-relaxed px-2">
          Welcome to my independent workshop atelier. Every leather bound journal, carved oak bowl, and forged silver talisman is produced in small numbered batches (1 to 10 items) using traditional tools and natural materials.
        </p>
      </div>
    </section>
  );
}
