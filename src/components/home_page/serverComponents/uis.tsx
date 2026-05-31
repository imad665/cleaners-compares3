'use client'
import { ChevronLeft, ChevronRight, Clock, LucideIcon, MessageCircle, Play, ShoppingCart } from "lucide-react";
import Link from "next/link";
import StarsUi from "../startUi";
import { AddCartButton } from "../clientComponents/uis";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageSellerDialog } from "@/components/productInfo/product/MessageSellerDialog";
import { useState } from "react";
import { useHomeContext } from "@/providers/homePageProvider";
import { SignInUpModal } from "@/components/header/header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Helper function to format prices
const formatPrice = (price: number | string): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    // Check if the number has more than 2 decimal places
    const hasThreeDecimals = Math.round(num * 1000) / 1000 !== Math.round(num * 100) / 100;
    return hasThreeDecimals ? num.toFixed(2) : num.toFixed(2);
};

/* const formatPrice = (price: number | string): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if the number is an integer (no decimal part)
  const isInteger = Number.isInteger(num);
  
  if (isInteger) {
    // For integers, just return without decimals
    return num.toString();
  } else {
    // For non-integers, check if it ends with .00
    const fixed = num.toFixed(2);
    // Check if it ends with .00
    if (fixed.endsWith('.00')) {
      // Remove .00 for whole numbers
      return num.toFixed(0);
    }
    // Otherwise return with 2 decimal places
    return fixed;
  }
}; */

export const settingsSlider = {
    autoplay: true,
    autoplaySpeed: 20000,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    arrows: true,
    variableWidth: true, // 👈 This is the key!
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                variableWidth: true // 👈 Optional override for mobile
            }
        }
    ]
}

export function getSettingSlider(duration: number, speed: number) {
    return {
        autoplay: true,
        autoplaySpeed: duration,
        infinite: true,
        speed: speed,
        slidesToScroll: 1,
        arrows: true,
        variableWidth: true, // 👈 This is the key!
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    variableWidth: true // 👈 Optional override for mobile
                }
            }
        ]
    }
}

export function ItemShopByCategory({ Icon, text }: { Icon: LucideIcon, text: string }) {
    return (
        <Link href="/" className="shadow-md grow bg-white hover:shadow-xl transition-all duration-300 border-1 p-2 rounded-md flex flex-col items-center justify-center text-center">
            <Icon className="h-10 w-10 text-blue-500 mb-3" />
            <h3 className="font-medium">{text}</h3>
        </Link>
    )
}

export type ItemProps = {
    id: string;
    title: string
    units: number
    unitPrice: number
    priceExcVat: number
    image: string
    href: string
    stars?: number
    starsCount?: number,
    productId: string,
    price?: number,
    dealCountdown?: string,
    stock?: number,
    className?: string,
    isOldProduct: boolean,
    discountPercentage: number,
    isIncVAT: boolean,
    listingStatus: "SOLD" | "UNDER_OFFER" | "AVAILABLE",

}

export function ItemFeaturedProduct({
    id, title, image, href, stars = 0, starsCount = 0,
    productId, unitPrice, units, priceExcVat, price,
    dealCountdown, stock, className, isOldProduct,
    isIncVAT, discountPercentage, listingStatus
}: ItemProps) {
    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [openMessageDialog, setOpenMessageDialog] = useState(false);
    const { user } = useHomeContext();

    const parsedUnitPrice = Number(unitPrice);
    const isUnits = units > 0;
    const vatLabel = isIncVAT ? "Inc. VAT" : "Exc. VAT";
    const finalImage = image === "https://res.cloudinary.com/dmtscpgrm/image/upload/v1759257209/products/mnlz2luiljqdcvornlut.jpg" ? '/logo-1.png' : image;

    console.log(listingStatus, 'ddddddddmmmmmmmmmmmmmmm');

    const handleMessageSeller = () => {
        if (!user) setOpenSignIn(true);
        else setOpenMessageDialog(true);
    };

    return (
        <div className={`group flex flex-col w-full max-w-[280px] min-h-[350px] bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}>

            {/* Image Section - Height increased to h-64 */}
            <div className="relative h-64 w-full bg-slate-50 overflow-hidden  ">

                {/* Floating Units Info (Absolute) */}
                {isUnits && false && (
                    <div className="absolute bottom-0 left-0 right-2 z-10 flex gap-1.5 w-full pb-1 pt-5 justify-between bg-gradient-to-t   from-black/90 via-black/40 to-transparent">
                        {/*  {stock && stock < 5 && stock > 0 && (
                            <div className=" ml-1 flex items-center bg-orange-100/90 backdrop-blur-sm text-orange-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter border border-orange-200">
                                Low Stock: {stock}
                            </div>
                        )} */}
                        {/*  <div className="flex justify-between items-center gap-1 pr-1">
                            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">
                                <p className="text-slate-400 uppercase text-[8px] font-bold leading-none">Pack Size</p>
                                <p className="font-bold text-slate-700 text-[10px]">{units} Units</p>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">
                                <p className="text-slate-400 uppercase text-[8px] font-bold leading-none">Per Unit</p>
                                <p className="font-bold text-slate-700 text-[10px]">£{parsedUnitPrice?.toFixed(2)}</p>
                            </div>
                        </div> */}

                    </div>
                )}

                <Link href={href} className="relative block h-full">
                    <Image
                        width={300}
                        height={300}
                        alt={title}
                        src={finalImage}
                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                    />

                    {listingStatus != 'AVAILABLE' && <div className={cn(
                        "absolute rotate-[-0deg] inset-0 z-10 flex items-center justify-center pointer-events-none",

                    )}>
                        <Image
                            width={250}
                            height={250}
                            alt="SOLD"
                            src={listingStatus === 'SOLD' ? "/sold.png" : "/under_offer6.png"}
                            className="object-contain"
                        />
                    </div>}
                </Link>

                {discountPercentage > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-600 border-none text-xs px-2 py-0.5">
                        -{discountPercentage}%
                    </Badge>
                )}


            </div>

            {/* Content Section */}
            <div className="p-3 flex flex-col grow">
                <Link href={href} className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors leading-tight h-9 mb-4">
                    {title}
                </Link>

                {/* Pricing Area */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-slate-900">£{priceExcVat.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase">{vatLabel}</span>
                    </div>

                    {dealCountdown && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>Ends: {dealCountdown}</span>
                            {price !== priceExcVat && (
                                <span className="line-through text-slate-400 ml-auto">£{price?.toFixed(2)}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 justify-between">
                    {listingStatus == 'AVAILABLE' ? <AddCartButton
                        className="flex-1"
                        stock={stock}
                        isOldProduct={isOldProduct}
                        productId={productId}
                    /> :
                        <Button

                            className='flex glex-1 items-center cursor-not-allowed bg-red-400/30 text-black rounded-2xl hover:bg-red-500/30 w-fit px-6 text-xs'>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            <span> Add to cart</span>
                        </Button>
                    }


                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleMessageSeller}
                        className="shrink-0 h-9 w-9 rounded-full border-slate-200 hover:bg-slate-50 text-slate-600"
                        title="Contact Seller"
                    >
                        <MessageCircle className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Modals */}
            {openMessageDialog && <MessageSellerDialog
                product={{ id: productId, image, name: title, url: href }}
                open={openMessageDialog}
                onOpenChange={setOpenMessageDialog}
            />}
            {(openSignIn || openSignUp) && <SignInUpModal
                openSignIn={openSignIn} openSignUp={openSignUp}
                setOpenSignIn={setOpenSignIn} setOpenSignUp={setOpenSignUp}
            />}
        </div>
    );
}

export type ItemProductProps = {
    title: string
    units: number
    unitPrice: number
    priceExcVat: number
    image: string
    href: string
    stars?: number
    starsCount?: number,
    productId: string,
    description: string,
    stock?: number
}


export function ProductViewerForSubCategory({
    title,
    image,
    href,
    stars = 0,
    starsCount = 0,
    productId,
    unitPrice,
    units,
    priceExcVat,
    description,
    stock,

}: ItemProductProps) {
    const d = Math.random();
    console.log(description, 'oooooooeeeeeee');

    const text = d < 0.5 ? 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit quam laboriosam, dignissimos enim facere molestias?' : ""
    return (
        <div className="mx-2">
            <div className='border-1 shadow-md relative p-4 flex flex-col gap-1 justify-between rounded-md h-full bg-white'>
                <Link href={href} className='relative mb-3 border-1 h-40 overflow-hidden'>
                    <img src={image} className='w-full h-full  object-contain transition-transform duration-300 hover:scale-105' />
                </Link>
                <Link href={href} className='font-medium text-sm mb-1 line-clamp-2 hover:text-red-400' >{title}</Link>
                <p title={description} className="text-sm text-muted-foreground max-h-10 overflow-hidden overflow-ellipsis">{description}</p>

                <div className='flex gap-1 items-center'>
                    <StarsUi stars={stars || 0} />
                    <span className='text-xs text-gray-500 ml-1'>({starsCount})</span>
                </div>
                <div className='mb-3 space-y-2 mt-3'>
                    <p className="flex justify-between text-sm"><span className="text-black">Units:</span><span className='font-bold'>{units}</span></p>
                    <p className="flex justify-between text-sm"><span className="text-black">Unit Price:</span><span className='font-bold'>£{formatPrice(unitPrice)}</span></p>
                    <p className="flex justify-between text-sm"><span className="text-black">Price Exc Vat:</span> <span className='text-lg font-bold'>£{formatPrice(priceExcVat)}</span></p>
                </div>
                <AddCartButton className="w-fit" stock={stock || -1} productId={productId} />
            </div>

        </div>
    )
}


export function NextArrow({ onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 cursor-pointer hidden md:block"
        >
            <ChevronRight className="w-5 h-5" />
        </div>
    )
}

export function PrevArrow({ onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 cursor-pointer hidden md:block"
        >
            <ChevronLeft className="w-5 h-5" />
        </div>
    )
}




type ItemPropsTimeDeal = {
    title: string
    priceExcVat: number
    unitPrice: number
    units: number
    starsCount: number
    discountPrice: number
    discountPercentage: number
    image: string
    href: string
    endDeal: string
    productId: string,
    stock?: number
    className?: string
    isOldProduct: boolean
}

export function ItemLimitedTimeDeals({
    title,
    discountPercentage,
    discountPrice,
    endDeal,
    href,
    image,
    priceExcVat,
    productId,
    starsCount,
    unitPrice,
    units,
    stock,
    className,
    isOldProduct,
}: ItemPropsTimeDeal) {
    const isUnits = units > 0;
    //console.log(isOldProduct,c,';;;;;;;;;;;;;;;;;;;;;;;')
    return (
        <div className={`w-[87vw] max-w-[90vw]   md:max-w-[320px] min-w-[300px] h-[470px] mx-2 ${className}`}>
            <div className='border-1 border-gray-300 relative p-4 flex flex-col gap-1 bg-white rounded-md h-full'>

                <Link href={href || '/'} className='relative mb-3 h-60  overflow-hidden'>
                    <Image width={350} height={350} alt="product image" src={image} className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' />
                </Link>
                <Link href={href || '/'} title={title} className='font-medium text-sm text-nowrap  overflow-ellipsis overflow-hidden  mb-1 line-clamp-2 hover:text-red-400' >{title}</Link>

                <p className="absolute px-6 py-1   rounded-tr-md font-bold bg-red-400 text-white right-0 top-0">{discountPercentage}% OFF</p>

                <div className="">
                    {isUnits && <div className="mt-2 w-full flex gap-8 items-center">
                        <span>Units:</span>
                        <span>{units}</span>
                    </div>}
                    {isUnits && <div className="flex gap-8 items-center">
                        <span>Unit Price:</span>
                        <span>£{formatPrice(unitPrice)}</span>
                    </div>}
                    <div className='mb-3 flex gap-8 items-center'>
                        <span>Price Exc Vat:</span>
                        <div className="relative">
                            <span className='text-lg font-bold'>£{formatPrice(discountPrice)}</span>
                            <span
                                className="
                            absolute
                            text-sm text-gray-500
                            line-through ml-2
                            left-0 bottom-[-18px]">
                                £{formatPrice(priceExcVat)}</span>
                        </div>
                    </div>
                </div>


                <div className="flex items-center text-sm text-gray-700">
                    <Clock className="h-4 w-4 text-red-500 mr-1" />
                    <span>
                        <span className="mr-1">Deal ends in:</span>
                        <span className="font-semibold text-red-600">{endDeal}</span>
                    </span>
                </div>
                <AddCartButton isOldProduct={isOldProduct} stock={stock} className="w-fit absolute bottom-0" productId={productId} />
            </div>

        </div>
    )
}