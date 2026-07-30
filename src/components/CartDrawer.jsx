'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, Lock, ShoppingBag, ArrowRight, Truck, AlertCircle } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isCartOpen) return null;

  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal / 100);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'An error occurred during checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[var(--bg-card)] border-l border-[var(--border-color)] text-[var(--text-heading)] flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[var(--accent-gold)]" />
              <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--text-heading)]">Your Craft Basket</h2>
              <span className="text-xs bg-[var(--accent-gold)] text-white px-2 py-0.5 rounded-full font-bold">
                {totalItems} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[var(--text-muted)] py-12 px-4">
                <ShoppingBag className="w-12 h-12 opacity-30 mb-4" />
                <p className="font-serif text-base text-[var(--text-heading)] font-bold">Your basket is currently empty</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs">Explore our handcrafted items and add your favorite crafts.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Browse Store Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = (item.price * item.quantity) / 100;
                const formattedItemTotal = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: item.currency.toUpperCase(),
                }).format(itemTotal);

                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 sm:space-x-4 p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] relative"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-slate-700/50 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[var(--text-heading)] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[var(--accent-gold)] font-black mt-0.5">{formattedItemTotal}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Max available: {item.stock} items</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[var(--text-heading)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[var(--border-color)] bg-[var(--bg-card)] space-y-3 sm:space-y-4">
              
              {/* Shipping info banner */}
              <div className="flex items-center space-x-2 p-2.5 sm:p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-800 dark:text-cyan-300 text-xs">
                <Truck className="w-4 h-4 shrink-0 text-teal-600 dark:text-cyan-400" />
                <span className="text-[11px] sm:text-xs">Location-based shipping rates calculated securely by Stripe at checkout.</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-extrabold">Subtotal</span>
                <span className="text-xl sm:text-2xl font-black text-[var(--accent-gold)]">{formattedSubtotal}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full flex items-center justify-center space-x-2 bg-[var(--accent-gold)] hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg text-sm cursor-pointer active:scale-95"
              >
                {isCheckingOut ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Stripe...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Stripe Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
