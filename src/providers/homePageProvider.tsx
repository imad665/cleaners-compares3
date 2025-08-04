'use client';

import { useCartStorage } from '@/hooks/useCartStorage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type CartType = {
  productId: string
  quantity: number
}

interface HomeContextType {
  cart: CartType[];
  addProduct: (productId: string, quantity: number,isFromCart?:boolean) => void;
  clearCart:()=>void ,
  removeProduct:(productId: string)=>void,
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: string;
  }|undefined|null
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

interface HomeProviderProps {
  children: ReactNode;
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: string;
  } | undefined | null
}

export const HomeProvider = ({ children, user }: HomeProviderProps) => {
  const { cart, setCart } = useCartStorage();
  
  const removeProduct = (productId:string) => {
    setCart((prev) => prev.filter((p) => p.productId != productId))
  }
  
  const addProduct = (productId: string, quantity: number,isFromCart?:boolean) => {
    const product = cart.find((p) => p.productId === productId);
    if (product) {
      const newQuantity = (product?.quantity || 0) + quantity;
      
      if (newQuantity === 0 && !isFromCart) setCart((prev) => prev.filter((p) => p.productId != productId))
      setCart((prev) => prev.map((p) => ({ ...p, quantity: p.productId === productId ? newQuantity : p.quantity })))
    } else {
      setCart(prev => [...prev, { productId, quantity }])
    }
  }
  const clearCart = ()=>{
    localStorage.removeItem('cart');
    setCart([])
  }

  const value: HomeContextType = {
    cart,
    addProduct,
    clearCart,
    removeProduct,
    user,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

export const useHomeContext = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};