/* 'use client' */

import Link from "next/link"

/* import Slider from 'react-slick' */
import { ItemFeaturedProduct, ItemLimitedTimeDeals } from "./serverComponents/uis"
import MyCarousel from "./clientComponents/myCarousel";

/* import { useHomeProductContext } from "@/providers/homeProductsProvider" */


export function LimitedTimeDeals({ initDealsProducts }: { initDealsProducts: any }) {
    /* const {dealsProducts} = useHomeProductContext(); */
    const dealsProducts = initDealsProducts;
    return (
        <section className="w-full px-4 md:px-8 py-10 bg-gray-100 max-h-[600px]">
            <div className="  container mx-auto ">
                <div className='flex justify-between items-center mb-6'>
                    <h2 className="text-2xl font-bold  text-left">Limited-Time Deals</h2>
                    <Link href="/products?type=deals" className=' text-blue-400 font-medium text-sm hover:underline'>View all</Link>
                </div>
                <MyCarousel >
                    {dealsProducts?.map((slide, i) => (
                        <div key={i} className="px-2">
                            {/* <ItemLimitedTimeDeals {...slide} /> */}
                            <ItemFeaturedProduct  {...slide} />
                        </div>
                    ))}
                </MyCarousel>
            </div>
        </section>
    )
}