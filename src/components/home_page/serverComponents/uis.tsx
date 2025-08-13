import { ChevronLeft, ChevronRight, Clock, LucideIcon, Play } from "lucide-react";
import Link from "next/link";
import StarsUi from "../startUi";
import { AddCartButton } from "../clientComponents/uis";
import Image from "next/image";

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
    discountPercentage:number
}

export function ItemFeaturedProduct({
    title,
    image,
    href,
    stars = 0,
    starsCount = 0,
    productId,
    unitPrice,
    units,
    priceExcVat,
    price,
    dealCountdown,
    stock,
    className,
    isOldProduct,
    discountPercentage,
}: ItemProps) {
    const isUnits = units > 0;
    //console.log(isOldProduct+';;;;;==================;;;;;;')
    return (
        <div className={`md:min-w-[300px] w-[75vw] grow flex flex-col justify-between md:max-w-[300px] border-1 shadow-md pb-4 rounded-md bg-white min-h-[430px] mx-2 ${className}`}>
            <div className=' relative  flex flex-col gap-1 grow  '>
                <Link href={href} className='relative mb-3 h-50 overflow-hidden  not-[]:'>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <Image width={300} height={300} alt="product image" src={image}
                        className='w-full h-full object-contain   transition-transform duration-300 hover:scale-105' />

                </Link>
                <Link href={href} className='font-medium px-4 text-sm mb-1 line-clamp-1 hover:text-red-400' >{title}</Link>
                {discountPercentage && <p className="absolute px-6 py-1   rounded-tr-md font-bold bg-red-400 text-white right-0 top-0">{discountPercentage}% OFF</p>}
                <div className='flex px-4 gap-1 items-center'>
                    <StarsUi stars={stars || 0} />
                    <span className='text-xs text-gray-500 ml-1'>({starsCount})</span>
                </div>
                <div className='mb-3 px-4 space-y-2 mt-3'>
                    {isUnits && <p className="flex justify-between text-sm"><span className="text-muted-foreground">Units:</span><span className='font-bold'>{units}</span></p>}
                    {isUnits && <p className="flex justify-between text-sm"><span className="text-muted-foreground">Unit Price:</span><span className='font-bold'>£{parseFloat(unitPrice).toFixed(3)}</span></p>}
                    <div>
                        <p className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price Exc Vat:</span>
                            <span className='text-lg font-bold'>£{parseFloat(priceExcVat).toFixed(3)}</span>
                        </p>


                        {dealCountdown && (
                            <div className="flex items-center text-sm text-gray-700">

                                <Clock className="h-4 w-4 text-red-500 mr-1" />
                                <span>
                                    <span className="mr-1">Deal ends in:</span>
                                    <span className="font-semibold text-red-600">{dealCountdown}</span>
                                </span>
                                {price != priceExcVat && <p className="line-through mr-2 text-sm ml-5">  £{price}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-4">
                <AddCartButton
                    className="w-fit"
                    stock={stock}
                    isOldProduct={isOldProduct}
                    productId={productId} />

            </div>

        </div>
    )
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
                    <p className="flex justify-between text-sm"><span className="text-black">Unit Price:</span><span className='font-bold'>£{unitPrice}</span></p>
                    <p className="flex justify-between text-sm"><span className="text-black">Price Exc Vat:</span> <span className='text-lg font-bold'>£{priceExcVat}</span></p>
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
    isOldProduct:boolean
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
                        <span>£{parseFloat(unitPrice).toFixed(3)}</span>
                    </div>}
                    <div className='mb-3 flex gap-8 items-center'>
                        <span>Price Exc Vat:</span>
                        <div className="relative">
                            <span className='text-lg font-bold'>£{parseFloat(discountPrice).toFixed(3)}</span>
                            <span
                                className="
                            absolute
                            text-sm text-gray-500
                            line-through ml-2
                            left-0 bottom-[-18px]">
                                £{parseFloat(priceExcVat).toFixed(3)}</span>
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


/* type ItemPropsPartAndAccessories = {
    title: string
    price: string
    image: string
    href: string
    isNew?: boolean
    isFeatured?: boolean
    stars?: number
    starsCount?: number
    productId: string
}

export function ItemPartAndAccessories({
    title,
    price,
    image,
    href,
    isNew,
    isFeatured,
    stars = 0,
    starsCount = 0,
    productId

}: ItemPropsPartAndAccessories) {
    return (
        <div className="min-w-[210px] max-w-[210px]  h-[400px] mx-2">
            <div className='border-1 relative p-4 flex flex-col gap-1 rounded-md h-full bg-white'>

                <div className={`mb-2 flex space-x-2 ${!isNew && !isFeatured ? ' opacity-0' : ''}`}>
                    <span className='text-white bg-blue-400 text-xs p-1 px-3 rounded-sm'>New</span>
                    <span className='text-white bg-yellow-600 text-xs p-1  px-3 rounded-sm'>Featured</span>
                </div>
                <Link href="/" className='relative mb-3 h-40 overflow-hidden'>
                    <img src={image} className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' />
                </Link>
                <Link href="/" className='font-medium text-sm mb-1 line-clamp-2 hover:text-red-400' >{title}</Link>
                <div className='flex gap-1 items-center'>
                    <StarsUi stars={stars} />
                    <span className='text-xs text-gray-500 ml-1'>({starsCount})</span>
                </div>
                <div className='mb-3 mt-2'>
                    <span className='text-lg font-bold'>$7999.99</span>
                </div>
                <AddCartButton productId={productId} />
            </div>

        </div>
    )
} */





