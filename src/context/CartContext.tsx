"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Poster, PosterSize } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (poster: Poster, size: PosterSize, quantity?: number) => void;
  removeFromCart: (posterId: string, sizeName: string) => void;
  updateQuantity: (posterId: string, sizeName: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "luxen-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart data");
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (poster: Poster, size: PosterSize, quantity = 1) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.poster.id === poster.id && item.selectedSize.name === size.name
      );

      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...current, { poster, selectedSize: size, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (posterId: string, sizeName: string) => {
    setItems((current) =>
      current.filter(
        (item) => !(item.poster.id === posterId && item.selectedSize.name === sizeName)
      )
    );
  };

  const updateQuantity = (posterId: string, sizeName: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(posterId, sizeName);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.poster.id === posterId && item.selectedSize.name === sizeName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.selectedSize.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
