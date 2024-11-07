import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cartItems')) || []
  );

  const addToCart = (product) => {
    if (!product.clo_idx || !product.clo_price) {
      console.error('Product is missing required properties:', product);
      return;
    }

    const existingProductIndex = cartItems.findIndex(
      (item) => item.clo_idx === product.clo_idx
    );

    let updatedCart;

    if (existingProductIndex !== -1) {
      updatedCart = cartItems.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productIdx) => {
    const updatedCart = cartItems.filter((item) => item.clo_idx !== productIdx);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const updateQuantity = (productIdx, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.clo_idx === productIdx
        ? { ...item, quantity: Math.max((item.quantity || 1) + delta, 1) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems'));
    if (savedCart) setCartItems(savedCart);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
