'use client'
import Link from 'next/link'
import { LayoutDashboard, Loader, Menu, MenuIcon, Plus, ShoppingCart, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ProductSearchBar } from './productSearchBar'
import { UserType } from '@/types/next-auth'
import { ButtonSignOut } from '../home_page/clientComponents/uis'
import { ContinueWithGoogleAlert } from '../ui/continueWithGoogleAlert'
import { useHomeContext } from '@/providers/homePageProvider'
import { useEffect, useRef, useState } from 'react'
import SellerFormDialog from '../forms/sellerForm'
import Image from 'next/image'
import UserDropdownMenu from './myAccount'
import AddWantedItemDialog from '../forms/wantedItem'
import { SignupModal } from '../auth/signup'
import { SignInModal } from '../auth/signin'
import { ContactDialog } from '../home_page/contact'
import NotificationBadge from './notificationIcon'
import { NotificationDropdown } from './notificationButton2'
import AutoSellerFormDialog from '../forms/autoSellerForm'

// Temporary state values — replace with auth/cart logic

const isSignedIn = false; // Set true to test the avatar state

export function Logo({ width = 100, height = 20 }: { width?: number, height?: number }) {
    const [version, serVersion] = useState('');
    useEffect(() => {
        const fetchVersion = async () => {
            const res = await fetch('/api/logo-version');
            const { version } = await res.json();
            serVersion(version)
        }
        fetchVersion();
    }, []);

    return (
        <Link href="/" className="text-xl font-bold lg:pr-5 ">
            <Image src={`/uploads/logo.png?v=${version}`} width={width} height={height} alt='logo' />
        </Link>
    )
}


const productsData = [
    'Machines', 'Parts', 'Sundries',
    'Engineers', "More",
];

function NavProducts() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (item: string) => {
        setActiveDropdown(activeDropdown === item ? null : item);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav ref={navRef} className='mx-auto px-2 md:px-4 py-2 overflow-visible hide-scrollbar'>
            <ul className='flex space-x-3 justify-center   md:space-x-3 lg:space-x-6 text-sm whitespace-nowrap'>
                {productsData.map((p) => (
                    <li key={p} className='relative group pb-4'>
                        {/* Mobile view */}
                        <div className="md:hidden">
                            {(p === 'Machines' || p === 'Parts' || p === 'More') ? (
                                <button
                                    onClick={() => toggleDropdown(p)}
                                    className='text-black font-bold flex items-center gap-1 hover:text-blue-500 transition-all'
                                >
                                    {p === 'More' && <MenuIcon size={16} />}{p}
                                </button>
                            ) : (
                                <Link
                                    href={`${p.toLocaleLowerCase().includes('sun') ? '/products' : ''}/${p.toLowerCase().replace(' ', '-')}`}
                                    className='text-black font-bold hover:text-blue-500 transition-all'
                                >
                                    {p}
                                </Link>
                            )}
                        </div>

                        {/* Desktop view */}
                        <div className="hidden md:block font-bold ">
                            {p.toLowerCase().replace(' ', '-') !== 'engineers' &&
                                p.toLowerCase().replace(' ', '-') !== 'sundries' &&
                                p.toLowerCase().replace(' ', '-') !== 'more' ? (
                                <Link
                                    href={`/products/${p.toLowerCase().replace(' ', '-')}`}
                                    className='text-black-400 hover:text-blue-500 transition-all'
                                >
                                    {p}
                                </Link>
                            ) : (
                                <div>
                                    {(p.toLowerCase().replace(' ', '-') !== 'more') ? (
                                        <Link
                                            href={`${p.toLocaleLowerCase().includes('sun') ? '/products' : ''}/${p.toLowerCase().replace(' ', '-')}`}
                                            className='text-black-400 hover:text-blue-500 transition-all'
                                        >
                                            {p}
                                        </Link>
                                    ) : (
                                        <span
                                            className='text-black-400 cursor-default flex items-center hover:text-blue-500 transition-all'
                                        >
                                            <MenuIcon size={16} /> {p}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dropdown for Machines, Parts, and More */}
                        {(p === 'Machines' || p === 'Parts' || p === 'More') && (
                            <div className={`
                                absolute ${p === "More" ? 'left-[-80px] md:left-0' : 'left-0'} 
                                ${activeDropdown === p ? 'block' : 'hidden'} 
                                md:block md:invisible group-hover:visible 
                                mt-2 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[160px]
                            `}>
                                {p === 'Machines' && (
                                    <ul className='font-bold'>
                                        <li>
                                            <Link
                                                href='/products/machines/#used'
                                                className='block px-4 py-2 text-sm  text-black hover:bg-gray-200 rounded'
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                Used Machine
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href='/products/machines/#new'
                                                className='block px-4 py-2 text-sm text-black hover:bg-gray-200 rounded'
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                New Machine
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                                {p === 'Parts' && (
                                    <ul className='font-bold'>
                                        <li>
                                            <Link
                                                href='/products/parts/#used'
                                                className='block px-4 py-2 text-sm text-black hover:bg-gray-200 rounded'
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                Used Parts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href='/products/parts/#new'
                                                className='block px-4 py-2 text-sm text-black hover:bg-gray-200 rounded'
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                New Parts
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                                {p === 'More' && (
                                    <ul className='font-bold'>
                                        <li>
                                            <Link
                                                href='/wanted-items'
                                                className='block px-4 py-2 text-sm text-black hover:bg-gray-200 rounded'
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                Wanted Items
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href='/businesses-for-sale'
                                                className='block px-4 py-2 text-sm text-black hover:bg-gray-200 rounded'
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                Businesses for Sale
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/videos"
                                                className='block px-4 py-2 text-sm text-black hover:bg-gray-200 rounded'
                                            >
                                                Resources
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
interface Props {
    user: UserType;
    cart: { quantity: number, productId: string }[];
    setOpenDialog: (open: boolean) => void;
    recentOrderCount: any;
    notificationData:any;
}

export function SignInUpModal(
    {
        openSignUp,
        setOpenSignUp,
        openSignIn,
        setOpenSignIn
    }:
        {
            openSignUp: boolean,
            setOpenSignUp: (v: boolean) => void;
            openSignIn: boolean;
            setOpenSignIn: (v: boolean) => void;
        }
) {

    const onSignInclick = () => {
        setOpenSignUp(false);
        setOpenSignIn(true);
    }
    const onSignUpClick = () => {
        setOpenSignUp(true);
        setOpenSignIn(false);
    }
    return (
        <>
            <SignupModal onSignInClick={onSignInclick} open={openSignUp} setOpen={setOpenSignUp} />
            <SignInModal onSignUpClick={onSignUpClick} open={openSignIn} setOpen={setOpenSignIn} />
        </>
    )
}

function NavDesktop({ user, cart, setOpenDialog, recentOrderCount,notificationData }: Props) {
    const cartCount = cart.reduce((sum, prev) => sum + prev.quantity, 0);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);

    return (
        <div className="hidden md:flex relative lg:justify-between grow-1  md:justify-end gap-2">
            <div id='searchBar' className='left hidden lg:block grow-1  max-w-[800px]'>
                <ProductSearchBar />
            </div>

            <nav className='right hidden md:flex items-center space-x-6' >
                {user && user.role === 'BUYER' &&
                    <Button onClick={() => setOpenDialog(true)} variant="outline"
                        className="cursor-pointer text-blue-600 border-blue-600 hover:bg-blue-50">
                        Become a Seller
                    </Button>
                }
                { 
                    <ContactDialog textButton={'Report poblem'} />
                }
                {user &&
                    <NotificationDropdown notificationData={notificationData} />
                }
                {/* recentOrderCount={recentOrderCount} {user && <ButtonSignOut />} */}
                {/* User */}

                {user ? (
                    <UserDropdownMenu user={user} recentOrderCount={recentOrderCount} />
                ) : (
                    <div className='flex gap-2'>
                        {/* <Link href="/auth/signup"> */}
                        {!openSignUp && <Button disabled={openSignIn} onClick={() => {
                            setOpenSignUp(true)
                        }} className='bg-blue-600 cursor-pointer hover:bg-blue-500' size="sm">Sign Up</Button>
                        }
                        {openSignUp &&
                            <span className="flex items-center gap-2">
                                <Loader className="w-4 h-4 animate-spin" />
                                Loading...
                            </span>}

                        {/* </Link> */}
                        {/* <Link href="/auth/signin"> */}
                        {!openSignIn && <Button disabled={openSignUp} onClick={() => {
                            setOpenSignIn(true);

                        }} className=' cursor-pointer' variant="outline" size="sm">Sign In</Button>}
                        {openSignIn &&
                            <span className="flex items-center gap-2">
                                <Loader className="w-4 h-4 animate-spin" />
                                Loading...
                            </span>}
                        {/* </Link> */}
                    </div>
                )}
                {/* Cart */}
                <Link href="/shopCart" className="relative">
                    <ShoppingCart className="w-6 h-6 hover:text-blue-600" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Link>

            </nav>
            <SignInUpModal
                openSignIn={openSignIn}
                openSignUp={openSignUp}
                setOpenSignIn={setOpenSignIn}
                setOpenSignUp={setOpenSignUp}
            />
        </div>
    )
}

interface Props {
    user: any;
    cart: any[];
    setOpenDialog: (open: boolean) => void;
}

export function NavMobile({ user, cart, setOpenDialog,   recentOrderCount,notificationData  }: Props) {
    const [open, setOpen] = useState(false);
    const cartCount = cart.reduce((sum, prev) => sum + prev.quantity, 0);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    // Function to close the sheet when a link is clicked
    const handleLinkClick = () => {
        setOpen(false);
    };

    return (
        <div className="md:hidden flex items-center gap-4">
            {/* User Icon */}
            {user && <UserDropdownMenu user={user} recentOrderCount={recentOrderCount} />}

            {/* <Link
                href="/shopCart"
                className="relative group hidden"
                onClick={handleLinkClick}
            >
                <ShoppingCart className="w-6 h-6 text-gray-700 hidden group-hover:text-blue-600 transition" />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-blue-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                        {cartCount}
                    </span>
                )}
            </Link> */}
            {user &&
                <NotificationDropdown notificationData={notificationData} />
            }

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <Menu className="w-6 h-6 text-gray-700" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-6 z-[30000000]">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-semibold text-gray-800">Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="mt-6 flex flex-col gap-4 text-gray-700">
                        <Link
                            href="/"
                            className="text-base font-medium hover:text-blue-600 transition"
                            onClick={handleLinkClick}
                        >
                            Home
                        </Link>

                        <Link
                            href="/shopCart"
                            className="text-base font-medium hover:text-blue-600 transition"
                            onClick={handleLinkClick}
                        >
                            Cart ({cartCount})
                        </Link>
                         <ContactDialog textButton={'Report poblem'} />

                        {user ? (
                            <Link
                                href="/account"
                                className="text-base font-medium hidden hover:text-blue-600 transition"
                                onClick={handleLinkClick}
                            >
                                Account
                            </Link>
                        ) : (
                            <div className='flex flex-col gap-3'>
                                <Button onClick={() => {
                                    setOpen(false);
                                    setOpenSignUp(true)
                                }} className='bg-blue-600 cursor-pointer hover:bg-blue-500' size="sm">Sign Up</Button>
                                {/* </Link> */}
                                {/* <Link href="/auth/signin"> */}
                                <Button onClick={() => {
                                    setOpen(false);
                                    setOpenSignIn(true)
                                }} className=' cursor-pointer' variant="outline" size="sm">Sign In</Button>
                            </div>
                        )}

                        {user && user.role === 'BUYER' && (
                            <Button
                                onClick={() => {
                                    setOpenDialog(true);
                                    setOpen(false);
                                }}
                                variant="outline"
                                className="cursor-pointer text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                                Become a Seller
                            </Button>
                        )}

                        {user && <Link href="/contact" className="bg-blue-600 rounded-md p-2 text-center text-white hover:bg-blue-500 cursor-pointer">
                            Contact Us
                        </Link>}
                        {user && <ButtonSignOut />}
                    </nav>
                </SheetContent>
            </Sheet>
            <SignInUpModal
                openSignIn={openSignIn}
                openSignUp={openSignUp}
                setOpenSignIn={setOpenSignIn}
                setOpenSignUp={setOpenSignUp}
            />
        </div>
    );
}

export function Header({ className = '', recentOrderCount,notificationData }: { className?: string, recentOrderCount?: any,notificationData?:any }) {
    const { cart, user } = useHomeContext();
    //console.log(cart, ';;;;;;;;;;;;;;;;;;');
    const [openDialog, setOpenDialog] = useState(false);
    return (

        <header className="bg-white  border-b shadow-sm w-full z-50 mb-1">
            <div className="flex items-center justify-between p-4 w-full md:container mx-auto">
                {/* Logo */}

                <Logo width={130} height={30} />

                {/* Desktop Nav */}
                <NavDesktop
                    user={user}
                    setOpenDialog={setOpenDialog}
                    recentOrderCount={recentOrderCount}
                    notificationData={notificationData}
                    cart={cart} />

                {/* Mobile Nav */}
                <NavMobile
                    user={user}
                    setOpenDialog={setOpenDialog}
                    recentOrderCount={recentOrderCount}
                    notificationData={notificationData}
                    cart={cart} />

            </div>
            <div className='lg:hidden mx-3'>
                <ProductSearchBar />
            </div>
            <NavProducts />
            {/* {!user && <ContinueWithGoogleAlert />} */}
            {openDialog && <AutoSellerFormDialog open={openDialog} setOpen={setOpenDialog} />}
        </header>

    )
}
