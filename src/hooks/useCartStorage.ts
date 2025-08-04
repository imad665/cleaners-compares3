// useCartStorage.ts
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "cart";

export function useCartStorage() {
  const [cart, setCart] = useState<any[]>([]); // use your proper type instead of 'any'

  // Load cart on first render
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
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
