// useCartStorage.ts

import { getExisitingProducts } from "@/actions/addNewProductAction";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "cart";

export function useCartStorage() {
  const [cart, setCart] = useState<any[]>([]); // use your proper type instead of 'any'
  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([])
  }
  // Load cart on first render
  useEffect(() => {

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const products = JSON.parse(saved)

      try {
        getExisitingProducts(products.map(p => p.productId)).then((existingProducts) => {
          //console.log(existingProducts, 'dddddddddddddddddkfkfkfkdffg', products);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
          const newProducts = products.filter(p => (existingProducts).includes(p.productId))
          setCart(newProducts);
        })

      } catch (err) {
        console.error("Failed to parse cart from localStorage", err);
      }
    }
  }, []);

  // Save cart on tab close / refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cart]);

  return { cart, setCart };
}
