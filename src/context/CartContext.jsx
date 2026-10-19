'use client';

import { createContext, useCallback, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [stockNotification, setStockNotification] = useState(null);

  // Hydrate cart from localStorage on client load
  useEffect(() => {
    // Deferred so state is set from a callback rather than synchronously in the effect body
    queueMicrotask(() => {
      try {
        const savedCart = localStorage.getItem('valkyrie_crafts_cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
      } finally {
        setIsHydrated(true);
      }
    });
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('valkyrie_crafts_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cart, isHydrated]);

  const showNotification = (msg) => {
    setStockNotification(msg);
    setTimeout(() => {
      setStockNotification(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      const maxStock = product.stock || 10;

      if (existingIndex > -1) {
        const existingItem = prevCart[existingIndex];
        const newQty = existingItem.quantity + quantity;

        if (newQty > maxStock) {
          showNotification(`Maximum available batch stock reached for "${product.name}" (${maxStock} items available).`);
          const updated = [...prevCart];
          updated[existingIndex] = { ...existingItem, quantity: maxStock };
          return updated;
        }

        showNotification(`Added ${quantity}x "${product.name}" to your basket.`);
        const updated = [...prevCart];
        updated[existingIndex] = { ...existingItem, quantity: newQty };
        return updated;
      }

      const initialQty = Math.min(quantity, maxStock);
      if (quantity > maxStock) {
        showNotification(`Capped at maximum available stock (${maxStock} items available).`);
      } else {
        showNotification(`Added "${product.name}" to your basket.`);
      }

      return [...prevCart, { ...product, quantity: initialQty }];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const maxStock = item.stock || 10;
            if (newQuantity > maxStock) {
              showNotification(`Only ${maxStock} items available in stock.`);
              return { ...item, quantity: maxStock };
            }
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem('valkyrie_crafts_cart');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isHydrated,
        stockNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
