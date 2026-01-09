import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item => 
          item._id === product._id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1, cartItemId: `${product._id}-${Date.now()}` }];
    });
    // alert(`${product.name} added to cart!`); // Optional: removed to reduce spam or use toast in component
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateQuantity = useCallback((cartItemId, qty) => {
    setCart(prevCart => prevCart.map(item => 
      item.cartItemId === cartItemId ? { ...item, qty: Math.max(1, qty) } : item
    ));
  }, []);

  const value = { cart, addToCart, removeFromCart, clearCart, updateQuantity };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};