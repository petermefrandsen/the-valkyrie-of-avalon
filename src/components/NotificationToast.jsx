'use client';

import { useCart } from '@/context/CartContext';
import { Sparkles, Info } from 'lucide-react';

export default function NotificationToast() {
  const { stockNotification } = useCart();

  if (!stockNotification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn max-w-sm">
      <div className="bg-slate-900 border border-amber-500/40 text-amber-100 px-4 py-3 rounded-2xl shadow-2xl shadow-amber-950/80 flex items-center space-x-3 backdrop-blur-xl">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-xs font-medium text-amber-200">{stockNotification}</p>
      </div>
    </div>
  );
}
