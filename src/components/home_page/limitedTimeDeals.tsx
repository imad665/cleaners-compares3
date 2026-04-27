/* 'use client' */

import Link from "next/link"

/* import Slider from 'react-slick' */
import { ItemFeaturedProduct, ItemLimitedTimeDeals } from "./serverComponents/uis"
import MyCarousel from "./clientComponents/myCarousel";
import { cn } from "@/lib/utils";

/* import { useHomeProductContext } from "@/providers/homeProductsProvider" */


export function LimitedTimeDeals({ initDealsProducts, className }: { initDealsProducts: any, className: string }) {
    /* const {dealsProducts} = useHomeProductContext(); */
    const dealsProducts = initDealsProducts;
    return (
        <section className={cn("w-full px-4 md:px-8 py-10 bg-blue-50 max-h-[600px]", className)}>
            <div className="  container mx-auto ">
                <div className='flex justify-between items-center mb-6'>
                    <h2 className="text-2xl font-bold  text-left">Limited-Time Deals</h2>
                    <Link href="/products?type=deals" className=' text-blue-400 font-medium text-sm hover:underline'>View all</Link>
                </div>
                <MyCarousel sliderToShow={6} breackpoints={[
                    { breakpoint: 1580, slidesToShow: 6 },
                    { breakpoint: 1280, slidesToShow: 5 },
                    { breakpoint: 1100, slidesToShow: 4 },
                    { breakpoint: 1020, slidesToShow: 3 },
                    { breakpoint: 770, slidesToShow: 2 },
                ]} >
                    {dealsProducts?.map((slide, i) => (
                        <ItemFeaturedProduct key={i}  {...slide} />
                    ))}
                </MyCarousel>
            </div>
        </section>
    )
}