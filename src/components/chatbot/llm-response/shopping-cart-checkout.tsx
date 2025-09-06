// components/chat/shopping-cart-checkout.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useHomeContext } from '@/providers/homePageProvider';
 

export function ShoppingCartCheckOut() {
    const { cart } = useHomeContext();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
        <Link href="/shopCart" className="relative p-2 rounded-full hover:bg-indigo-700 transition-colors">
            <ShoppingCart className="w-5 h-5 text-white" />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                </span>
            )}
        </Link>
    );
}