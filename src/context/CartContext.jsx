// src/context/CartContext.jsx
import { createContext, useState, useEffect, useMemo } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('ferremaxCart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ferremaxCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.ID_Producto === product.ID_Producto);
      if (existingItem) {
        return prevItems.map(item =>
          item.ID_Producto === product.ID_Producto
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.cantidad) }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.ID_Producto !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.ID_Producto === productId ? { ...item, quantity: Math.min(numQuantity, item.cantidad) } : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // --- AÑADIR/MODIFICAR ESTOS VALORES ---
  const SHIPPING_COST = 15000;
  const FREE_SHIPPING_THRESHOLD = 100000; // Por ejemplo, $100.000
  const TAX_RATE = 0.19; // 19% IVA

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity * item.precio_unitario, 0);
  }, [cartItems]);

  const shipping = useMemo(() => {
    return cartSubtotal > 0 && cartSubtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_COST : 0;
  }, [cartSubtotal]);

  const tax = useMemo(() => {
    return (cartSubtotal + shipping) * TAX_RATE;
  }, [cartSubtotal, shipping]);
  
  const cartTotal = useMemo(() => {
      return cartSubtotal + shipping + tax;
  }, [cartSubtotal, shipping, tax]);

  const value = { 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      // --- AÑADIR ESTOS NUEVOS VALORES AL CONTEXTO ---
      cartSubtotal,
      shipping,
      tax,
      cartTotal,
      FREE_SHIPPING_THRESHOLD
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};