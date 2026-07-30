'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, ShieldCheck, Truck, Sparkles, Plus, Minus } from 'lucide-react';

export default function ProductModal({ product, onClose }) {
  const { addToCart, cart } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  if (!product) return null;

  const cartItem = cart.find((item) => item.id === product.id);
  const currentCartQty = cartItem ? cartItem.quantity : 0;
  const availableStock = Math.max(0, product.stock - currentCartQty);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency.toUpperCase(),
  }).format(product.price / 100);

  const handleAddToCart = () => {
    if (availableStock > 0) {
      addToCart(product, selectedQuantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-white hover:text-amber-400 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 relative bg-[var(--bg-image-placeholder)] min-h-[240px] sm:min-h-[300px]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-amber-300 text-xs px-3 py-1 rounded-full font-bold">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[var(--accent-gold)] text-xs tracking-wider uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{product.batchSize || 'Artisan Small Batch'}</span>
            </div>

            <h2 className="font-serif text-xl sm:text-3xl font-extrabold text-[var(--text-heading)] mt-2">
              {product.name}
            </h2>

            <div className="mt-2 sm:mt-3 flex items-baseline space-x-3">
              <span className="text-xl sm:text-2xl font-black text-[var(--accent-gold)]">{formattedPrice}</span>
              <span className="text-xs text-[var(--text-muted)]">Taxes included</span>
            </div>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[var(--text-body)] leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="mt-4 sm:mt-6 space-y-2 pt-4 border-t border-[var(--border-color)] text-xs">
              {product.materials && (
                <div className="flex justify-between text-[var(--text-body)]">
                  <span className="font-bold text-[var(--text-heading)]">Materials:</span>
                  <span className="text-right font-medium">{product.materials}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between text-[var(--text-body)]">
                  <span className="font-bold text-[var(--text-heading)]">Dimensions:</span>
                  <span className="text-right font-medium">{product.dimensions}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--text-body)]">
                <span className="font-bold text-[var(--text-heading)]">Available Stock:</span>
                <span className="text-right font-extrabold text-emerald-600 dark:text-emerald-400">{availableStock} items left</span>
              </div>
            </div>
          </div>

          {/* Add to Basket Control */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--border-color)]">
            {availableStock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] font-bold">Quantity:</span>
                  <div className="flex items-center space-x-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-1">
                    <button
                      onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 rounded-lg text-[var(--text-body)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer"
                      disabled={selectedQuantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-[var(--text-heading)]">
                      {selectedQuantity}
                    </span>
                    <button
                      onClick={() => setSelectedQuantity((q) => Math.min(availableStock, q + 1))}
                      className="p-1.5 rounded-lg text-[var(--text-body)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer"
                      disabled={selectedQuantity >= availableStock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center space-x-2 bg-[var(--accent-gold)] hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg text-sm cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Add {selectedQuantity} to Basket</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-center">
                <p className="text-sm font-bold text-rose-500">This batch is currently sold out.</p>
                <p className="text-xs text-slate-500 mt-1">Check back soon for the next craft batch release.</p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center space-x-6 text-[11px] text-[var(--text-muted)]">
              <div className="flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Tracked Delivery</span>
              </div>
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stripe Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
