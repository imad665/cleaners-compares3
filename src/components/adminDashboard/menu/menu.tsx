'use client'

import { Logo } from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useHomeContext } from "@/providers/homePageProvider";
import { Bell, Box, ChevronDown, ChevronLeft, ChevronRight, Currency, FilePlus, FoldersIcon, Kanban, LayoutDashboard, ListOrdered, LogOut, LucideIcon, Menu, MessageSquare, Search, Settings, ShoppingCart, User, UserCog, Users2, Video } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";



const menuItem = [
    { Icon: LayoutDashboard, title: 'Dashboard', href: '/admin' },
    { Icon: FoldersIcon, title: 'Manage Categories', href: '/admin/manageCategories' },
    { Icon: Kanban, title: 'Manage Subcategories', href: '/admin/manageSubcategories' },
    { Icon: ShoppingCart, title: 'All Products', href: '/admin/allProducts' },
    { Icon: Box, title: 'My Wanted Items', href: '/admin/myWantedItems' },
    { Icon: UserCog, title: 'My Enginners', href: '/admin/myServices' },
    { Icon: Video, title: 'My Videos', href: '/admin/myVideos' },
    { Icon: Box, title: 'My Businesses for Sale', href: '/admin/myBusinessesForSale' },
    { Icon: Users2, title: 'User Management', href: '/admin/userManagement' },
    { Icon: MessageSquare, title: 'Messages', href: '/admin/myMessages' },
    { Icon: Settings, title: 'Settings', href: '/admin/settings' },
    { Icon: User, title: 'Profile', href: '/admin/profile' },
]

function getUserMenu(user, cart) {
    if (user.role === 'ADMIN') {
        return [
            { Icon: LayoutDashboard, title: 'Dashboard', href: '/admin' },
            { Icon: ListOrdered, title: 'Orders', href: '/admin/orders' },
            { Icon: Currency, title: 'Payouts to Sellers', href: '/admin/payouts' },
            { Icon: FoldersIcon, title: 'Manage Categories', href: '/admin/manageCategories' },
            { Icon: Kanban, title: 'Manage Subcategories', href: '/admin/manageSubcategories' },
            { Icon: ShoppingCart, title: 'All Products', href: '/admin/allProducts' },
            { Icon: Box, title: 'My Wanted Items', href: '/admin/myWantedItems' },
            { Icon: UserCog, title: 'My Enginners', href: '/admin/myServices' },
            { Icon: Video, title: 'My Videos', href: '/admin/myVideos' },
            { Icon: Box, title: 'My Businesses for Sale', href: '/admin/myBusinessesForSale' },
            { Icon: Users2, title: 'User Management', href: '/admin/userManagement' },
            { Icon: MessageSquare, title: 'Messages', href: '/admin/myMessages' },
            { Icon: Settings, title: 'Settings', href: '/admin/settings' },
            { Icon: User, title: 'Profile', href: '/admin/profile' },

        ]
    } else if (user.role === 'SELLER') {
        return [
            { Icon: LayoutDashboard, title: 'Dashboard', href: '/admin' },
            { Icon: ListOrdered, title: 'Orders', href: '/admin/orders' },
            { Icon: ShoppingCart, title: 'All Products', href: '/admin/allProducts' },
            { Icon: Box, title: 'My Wanted Items', href: '/admin/myWantedItems' },
            { Icon: UserCog, title: 'My Enginners', href: '/admin/myServices' },
            { Icon: Box, title: 'My Businesses for Sale', href: '/admin/myBusinessesForSale' },
            { Icon: User, title: 'Profile', href: '/admin/profile' },
            { Icon: MessageSquare, title: 'Messages', href: '/admin/myMessages/seller' },

        ]
    } else {
        const cartCount = cart.reduce((sum, prev) => sum + prev.quantity, 0);
        return [
            { Icon: ShoppingCart, title: `Cart(${cartCount})`, href: '/shopCart' },
        ]
    }
}


function MenuItem({ Icon, title, href, isActive, onClick }:
    {
        Icon: LucideIcon,
        title: string,
        href: string,
        isActive: boolean,
        onClick: () => void

    }) {
    return (
        <li className="block w-full overflow-hidden">
            <Link onClick={onClick} href={href} className={`flex gap-4 justify-start w-full font-semibold cursor-pointer ${isActive ? "text-blue-600" : 'text-gray-600'} hover:bg-gray-100 p-2 rounded-md`}>
                <Icon className="min-w-6" size={20} viewBox="0 0 24 24" fill="none" />
                {<span className="text-nowrap">{title}</span>}
            </Link>
        </li>

    )
}

export function SideBarDesktop() {
    const { user, cart } = useHomeContext();
    const [openMenu, setOpenMenu] = useState(true); // Initially open
    //const [indexClick, setIndexClick] = useState(0);
    const menuItem = getUserMenu(user, cart);
    const pathname = usePathname();
    const toggleMenu = () => {
        setOpenMenu((prev) => !prev);
    };

    return (
        <div
            className={`h-full border-r-2 hidden lg:block transition-all duration-300 ${openMenu ? 'w-64' : 'w-16'
                }`}
        >
            <div className="flex justify-end p-2">
                <button
                    onClick={toggleMenu}
                    className="p-1 rounded-full cursor-pointer text-gray-500 hover:bg-gray-100"
                >
                    {openMenu ? <ChevronLeft /> : <ChevronRight />}
                </button>
            </div>

            <div className="h-[calc(100vh-130px)]   overflow-auto">
                <nav className="h-full">
                    <ul
                        className={`flex flex-col gap-2 px-3 bg-white transition-opacity duration-300 ${openMenu ? 'opacity-100' : ''
                            }`}
                    >
                        {menuItem.map((item, index) => {
                            const isActive = pathname === item.href;
                            return <MenuItem
                                key={index}
                                Icon={item.Icon}
                                title={item.title}
                                href={item.href}
                                isActive={isActive}
                                onClick={() => { }}
                            />
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}


export function SideBarMobile() {
    const [indexClick, setIndexClick] = useState(0);
    const pathname = usePathname();
    const { user, cart } = useHomeContext();
    const [openMenu, setOpenMenu] = useState(false);
    const menuItem = getUserMenu(user, cart);
    return (
        <div className="block lg:hidden">

            <Sheet open={openMenu} onOpenChange={setOpenMenu}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <Menu size={24} className="w-6 h-6 text-gray-700" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-70 p-6">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-semibold text-gray-800">Menu</SheetTitle>
                    </SheetHeader>
                    <nav>
                        <ul className="flex flex-col w-fit gap-2 border-r-2 h-full min-w-60 bg-white">
                            {menuItem.map((item, index) => {
                                const isActive = pathname === item.href;
                                return <MenuItem
                                    key={index}
                                    Icon={item.Icon}
                                    title={item.title}
                                    href={item.href}
                                    isActive={isActive}
                                    onClick={() => setOpenMenu(false)}
                                />
                            })}
                        </ul>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

    )
}
export function HeaderAdmin() {
    const { user } = useHomeContext();
    const email = user?.email || null;
    const img = user?.image || null;

    return (
        <header className="flex items-center border-b px-3 h-15 w-full bg-white z-20">
            <SideBarMobile />
            <div className="flex items-center justify-between w-full">
                {/* Logo */}
                <div className="flex w-64 items-center h-15 text-center pl-3 border-b py-5">
                    <Logo />
                </div>

                {/* Right side */}
                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center space-x-2 focus:outline-none">
                                {img ? (
                                    <img className="h-8 w-8 rounded-full object-cover" src={img} alt="User avatar" />
                                ) : (
                                    <User size={20} />
                                )}

                                <div className="hidden md:flex text-left gap-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Admin User</p>
                                        <p className="text-xs text-gray-500">{email || 'Administrator'}</p>
                                    </div>
                                    <ChevronDown className="text-gray-500" />
                                </div>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-48 mt-2">
                            {/* You can add more menu items here */}
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Deconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}