'use client'

import { Logo } from "@/components/header/header";
import { NotificationDropdown } from "@/components/header/notificationButton2";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useHomeContext } from "@/providers/homePageProvider";
import {
    Bell, Box, ChevronDown, ChevronLeft, ChevronRight, Currency,
    FileText, FoldersIcon, Kanban, LayoutDashboard, LogOut,
    LucideIcon, Menu, MessageSquare, Settings, ShoppingCart,
    User, UserCog, Users2, Video, Package, Store, HelpCircle
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const iconColors: Record<string, string> = {
    'Dashboard': 'text-blue-500',
    'Blog Management': 'text-orange-500',
    'Payouts to Sellers': 'text-emerald-500',
    'Manage Categories': 'text-purple-500',
    'Manage Subcategories': 'text-indigo-500',
    'Videos': 'text-red-500',
    'User Management': 'text-cyan-500',
    'Messages': 'text-pink-500',
    'Settings': 'text-slate-500',
    'Profile': 'text-amber-500',
    'Orders': 'text-blue-600',
    'Products': 'text-emerald-600',
    'Wanted Items': 'text-orange-600',
    'Enginners': 'text-indigo-600',
    'Businesses for Sale': 'text-rose-600',
    'Cart': 'text-primary'
};

function getUserMenu(user: any, cart: any[]) {
    if (user?.role === 'ADMIN') {
        return [
            { Icon: LayoutDashboard, title: 'Dashboard', href: '/admin' },
            { Icon: FileText, title: 'Blog Management', href: '/admin/blog' },
            { Icon: Currency, title: 'Payouts to Sellers', href: '/admin/payouts' },
            { Icon: FoldersIcon, title: 'Manage Categories', href: '/admin/manageCategories' },
            { Icon: Kanban, title: 'Manage Subcategories', href: '/admin/manageSubcategories' },
            { Icon: Video, title: 'Videos', href: '/admin/myVideos' },
            { Icon: Users2, title: 'User Management', href: '/admin/userManagement' },
            { Icon: MessageSquare, title: 'Messages', href: '/admin/myMessages' },
            { Icon: Settings, title: 'Settings', href: '/admin/settings' },
            { Icon: User, title: 'Profile', href: '/admin/profile' },
        ]
    } else if (user?.role === 'SELLER') {
        return [
            { Icon: LayoutDashboard, title: 'Dashboard', href: '/admin' },
            { Icon: ListOrdered, title: 'Orders', href: '/admin/orders' },
            { Icon: ShoppingCart, title: 'Products', href: '/admin/allProducts' },
            { Icon: Box, title: 'Wanted Items', href: '/admin/myWantedItems' },
            { Icon: UserCog, title: 'Enginners', href: '/admin/myServices' },
            { Icon: Store, title: 'Businesses for Sale', href: '/admin/myBusinessesForSale' },
            { Icon: MessageSquare, title: 'Messages', href: '/admin/myMessages/seller' },
            { Icon: User, title: 'Profile', href: '/admin/profile' },
        ]
    } else {
        const cartCount = cart.reduce((sum, prev) => sum + prev.quantity, 0);
        return [
            { Icon: ShoppingCart, title: `Cart(${cartCount})`, href: '/shopCart' },
        ]
    }
}

// Helper icon to handle specific cases
const ListOrdered = ({ className, ...props }: any) => (
    <Package className={className} {...props} />
);

function MenuItem({ Icon, title, href, isActive, onClick, collapsed }:
    {
        Icon: LucideIcon,
        title: string,
        href: string,
        isActive: boolean,
        onClick: () => void,
        collapsed?: boolean
    }) {

    const displayTitle = title.includes('Cart') ? 'Cart' : title;
    const iconColorClass = iconColors[displayTitle] || 'text-gray-500';

    const content = (
        <Link
            onClick={onClick}
            href={href}
            className={cn(
                "group flex items-center gap-3 w-full font-medium transition-all duration-200 px-3 py-2.5 rounded-lg relative overflow-hidden",
                isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <div className={cn(
                "transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-primary" : iconColorClass
            )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            <AnimatePresence mode="wait">
                {!collapsed && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm truncate font-semibold"
                    >
                        {title}
                    </motion.span>
                )}
            </AnimatePresence>

            {isActive && (
                <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </Link>
    );

    if (collapsed) {
        return (
            <li className="list-none w-full">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {content}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-semibold">
                            {title}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </li>
        );
    }

    return <li className="list-none w-full">{content}</li>;
}

export function SideBarDesktop() {
    const { user, cart } = useHomeContext();
    const [collapsed, setCollapsed] = useState(false);
    const menuItem = getUserMenu(user, cart);
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "h-[calc(100vh-60px)] sticky top-[60px] border-r border-slate-200 hidden lg:flex flex-col bg-white transition-all duration-300 ease-in-out z-10",
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none py-6">
                <nav className="px-3">
                    <ul className="space-y-1.5">
                        {menuItem.map((item, index) => {
                            const isActive = pathname === item.href;
                            return (
                                <MenuItem
                                    key={index}
                                    Icon={item.Icon}
                                    title={item.title}
                                    href={item.href}
                                    isActive={isActive}
                                    onClick={() => { }}
                                    collapsed={collapsed}
                                />
                            );
                        })}
                    </ul>
                </nav>
            </div>

            <div className="p-4 border-t border-slate-100">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                >
                    {collapsed ? <ChevronRight size={18} /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft size={18} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Collapse Menu</span>
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}

export function SideBarMobile() {
    const pathname = usePathname();
    const { user, cart } = useHomeContext();
    const [openMenu, setOpenMenu] = useState(false);
    const menuItem = getUserMenu(user, cart);

    return (
        <div className="block lg:hidden">
            <Sheet open={openMenu} onOpenChange={setOpenMenu}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-slate-100 text-slate-700">
                        <Menu size={24} />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 border-none shadow-2xl">
                    <div className="flex flex-col h-full bg-white">
                        <SheetHeader className="p-6 border-b border-slate-50">
                            <SheetTitle className="text-xl font-bold text-navy flex items-center gap-2">
                                <LayoutDashboard className="text-primary" />
                                Menu
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex-1 overflow-y-auto p-4">
                            <ul className="space-y-2">
                                {menuItem.map((item, index) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <MenuItem
                                            key={index}
                                            Icon={item.Icon}
                                            title={item.title}
                                            href={item.href}
                                            isActive={isActive}
                                            onClick={() => setOpenMenu(false)}
                                        />
                                    );
                                })}
                            </ul>
                        </nav>
                        <div className="p-4 border-t border-slate-50">
                            <Button
                                variant="outline"
                                className="w-full gap-2 text-rose-600 border-rose-100 hover:bg-rose-50"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut size={16} />
                                Logout
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export function HeaderAdmin({ notificationData }: { notificationData: any }) {
    const { user } = useHomeContext();
    const email = user?.email || null;
    const name = user?.name || 'Admin User';
    const img = user?.image || null;

    return (
        <header className="h-[60px] sticky top-0 flex items-center border-b border-slate-200 px-4 w-full bg-white/80 backdrop-blur-md z-30">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <SideBarMobile />
                    <div className="flex items-center h-full gap-2">
                        <Logo />
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-bold border border-blue-100 mt-1">
                            v2.0
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Online</span>
                    </div>

                    <NotificationDropdown notificationData={notificationData} />

                    <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 group transition-all duration-200 outline-none">
                                <div className="relative">
                                    {img ? (
                                        <img className="h-9 w-9 rounded-full object-cover border-2 border-transparent group-hover:border-primary/20 transition-all shadow-sm" src={img} alt="User avatar" />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-transparent group-hover:border-primary/20 transition-all shadow-sm">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                                </div>

                                <div className="hidden lg:flex flex-col text-left mr-1">
                                    <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-primary transition-colors">{name}</p>
                                    <p className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 max-w-[120px] truncate">{email || 'Administrator'}</p>
                                </div>
                                <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-all" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56 mt-2 p-1 border-slate-200 shadow-xl rounded-xl">
                            <div className="px-2 py-2 border-b border-slate-100 mb-1">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-2">Account</p>
                            </div>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5">
                                <Link href="/admin/profile" className="flex items-center gap-2">
                                    <User size={16} className="text-slate-500" />
                                    <span className="font-semibold text-slate-700">My Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            {user && user.role === "ADMIN" && < DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5">
                                <Link href="/admin/settings" className="flex items-center gap-2">
                                    <Settings size={16} className="text-slate-500" />
                                    <span className="font-semibold text-slate-700">Settings</span>
                                </Link>
                            </DropdownMenuItem>}
                            <div className="h-[1px] bg-slate-100 my-1" />
                            <DropdownMenuItem
                                className="rounded-lg cursor-pointer py-2.5 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut size={16} className="mr-2" />
                                <span className="font-bold">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header >
    );
}
