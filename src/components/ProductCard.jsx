'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, PackageCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  const { addToCart, cart } = useCart();
  const [imgError, setImgError] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const currentCartQty = cartItem ? cartItem.quantity : 0;
  const availableStock = Math.max(0, product.stock - currentCartQty);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency.toUpperCase(),
  }).format(product.price / 100);

  return (
    <div className="group relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md">
      
      {/* Product Image Container: Light Gray in Light Mode, Dark Slate in Dark Mode */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-image-placeholder)] cursor-pointer flex items-center justify-center"
        onClick={() => onSelect(product)}
      >
        {!imgError && product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-[var(--text-muted)]">
            <Sparkles className="w-10 h-10 mb-2 text-[var(--accent-gold)] opacity-70" />
            <span className="text-xs font-bold text-[var(--text-heading)]">{product.name}</span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Artisan Craft Preview</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
          {product.category}
        </span>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {availableStock > 3 ? (
            <span className="inline-flex items-center space-x-1 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
              <PackageCheck className="w-3 h-3 text-emerald-400" />
              <span>In Stock ({availableStock})</span>
            </span>
          ) : availableStock > 0 ? (
            <span className="inline-flex items-center space-x-1 bg-amber-950/95 border border-amber-500/50 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md animate-pulse">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Only {availableStock} Left!</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 bg-rose-950/95 border border-rose-500/50 text-rose-300 text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md">
              <span>Sold Out</span>
            </span>
          )}
        </div>

        {/* Quick Details Overlay Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/90 border border-amber-500/40 text-amber-200 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 backdrop-blur-md shadow-lg"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-serif text-lg font-black text-[var(--text-heading)] group-hover:text-[var(--accent-gold)] transition-colors cursor-pointer line-clamp-1"
            onClick={() => onSelect(product)}
          >
            {product.name}
          </h3>
          <p className="text-xs text-[var(--text-body)] mt-2 line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-extrabold">Price</span>
            <span className="text-xl font-black text-[var(--accent-gold)]">{formattedPrice}</span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={availableStock === 0}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 shadow-md ${
              availableStock > 0
                ? 'bg-[var(--accent-gold)] hover:opacity-90 text-white active:scale-95 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>{availableStock > 0 ? 'Add to Basket' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
