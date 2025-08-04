"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Box,
  Heart,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  UserCircle,
  ServerIcon,
  Video,
  CheckCircle,
  ListOrdered,
} from "lucide-react";

// Added notification badge component
const NotificationBadge = ({ count }: { count: number }) => (
  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
    {count}
  </span>
);

function getUserMenu(user, cart,sellerStats2) {
  // Placeholder data - replace with actual data from your backend
  const sellerStats = {
    soldProducts: 0, // Replace with actual count
    pendingOrders: 0, // Replace with actual count
  };
  
  if (sellerStats2){
    sellerStats.pendingOrders=sellerStats2.unreadSellerOrders;
    sellerStats.soldProducts= sellerStats2.unreadBuyerOrders;
  }

  if (user.role === 'ADMIN') {
    return [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { label: "My Products", icon: Box, path: "/admin/allProducts" },
      { label: "My Wanted Items", icon: Heart, path: "/admin/myWantedItems" },
      { label: "My Engineers", icon: ServerIcon, path: "/admin/myServices" },
      { label: "My Businesses for Sale", icon: ShoppingCart, path: "/admin/myBusinessesForSale" },
      { label: "Videos", icon: Video, path: "/admin/myVideos" },
      { 
        label: "Sold Products", 
        icon: CheckCircle, 
        path: "/orders",
        badge: sellerStats.soldProducts 
      },
      { 
        label: "Orders", 
        icon: ListOrdered, 
        path: "/admin/orders",
        badge: sellerStats.pendingOrders 
      },
    ];
  } else if (user.role === 'SELLER') {
    return [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { label: "My Products", icon: Box, path: "/admin/allProducts" },
      { 
        label: "Sold Products", 
        icon: CheckCircle, 
        path: "/orders",
        badge: sellerStats.soldProducts 
      },
      { 
        label: "Orders", 
        icon: ListOrdered, 
        path: "/admin/orders",
        badge: sellerStats.pendingOrders 
      },
      { label: "My Wanted Items", icon: Heart, path: "/admin/myWantedItems" },
      { label: "My Engineers", icon: ServerIcon, path: "/admin/myServices" },
      { label: "My Businesses for Sale", icon: ShoppingCart, path: "/admin/myBusinessesForSale" },
    ];
  } else {
    const cartCount = cart.reduce((sum, prev) => sum + prev.quantity, 0);
    return [
      { 
        label: `Cart`, 
        icon: ShoppingCart, 
        path: '/shopCart',
        badge: cartCount > 0 ? cartCount : undefined 
      },
      { 
        label: "Sold Products", 
        icon: CheckCircle, 
        path: "/orders",
        badge: sellerStats.soldProducts 
      },
    ];
  }
}

import { signOut } from "next-auth/react";
import { useHomeContext } from "@/providers/homePageProvider";
import NotificationBadge2 from "./notificationIcon";

const UserDropdownMenu = ({ user , recentOrderCount}: { user: any, recentOrderCount:any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { cart } = useHomeContext();
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  //console.log(recentOrderCount,';..................');
  const isRecentOrders = recentOrderCount && (recentOrderCount.unreadSellerOrders!=0 || recentOrderCount.unreadBuyerOrders!=0)
  const total = recentOrderCount?.unreadBuyerOrders + recentOrderCount?.unreadSellerOrders || 0;
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
    closeMenu();
  };

  return (
    <div className="relative z-[1000] text-sm">
      <button
        onClick={toggleMenu}
        className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt="User"
            className="w-8 h-8 rounded-full border-2"
          />
        ) : (
          
            <UserCircle className="w-8 h-8 text-gray-600" />
             
          
        )}
        {/* Notification dot for sellers */}
        {user?.role === 'SELLER' && isRecentOrders && (
          <div className="absolute top-0 right-0   bg-white rounded-full">
             <NotificationBadge2 count={total}/>
          </div>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-[-70px] md:right-0 mt-2 w-64 max-w-[90vw] bg-white rounded-md shadow-lg transition-all duration-300 overflow-auto max-h-[80vh]"
        >
          <div className="border-b px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-gray-800 font-semibold">My Account</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
            <button onClick={closeMenu} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-1">
            {getUserMenu(user, cart,recentOrderCount).map((item) => (
              <button
                key={item.label}
                onClick={() => navigateTo(item.path)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700 relative"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
                {'badge' in item && item.badge > 0 && (
                  <NotificationBadge count={item.badge} />
                )}
              </button>
            ))}

            <div className="border-t mt-1">
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdownMenu;