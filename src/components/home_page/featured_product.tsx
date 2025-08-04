/* 'use client' */

/* import dynamic from 'next/dynamic' */
//import Slider from 'react-slick'
import Link from 'next/link'
/* import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css" */
import { ItemFeaturedProduct } from './serverComponents/uis'
import MyCarousel from './clientComponents/myCarousel';
/* import { useEffect, useState } from 'react' */
/* import { useHomeProductContext } from '@/providers/homeProductsProvider' */
 

/* const Slider = dynamic(()=>import('react-slick'),{ssr:false}); */

/* const slides = [
    {
        title: 'Electrolux Professional 65lb Washer Extractor',
        image: 'https://www.cleanerscompare.com/pics/1/80273_Sankosha%20stores.jpeg',
        href: '/products/sundries/card-paper-products/tufftape-(200M)-strong-(variou-colours)',
        stars: 2.5,
        starsCount: 84,
        productId: '111',
        units:1,
        unitPrice:12.50,
        priceExcVat:12.50
    },
    {

        title: 'Maytag Commercial 20lb Stack Dryer',
        image: 'https://www.cleanerscompare.com/pics/1/40078_sd%20sapotap%20saposoft.jpg',
      
        href: '/products/sundries/card-paper-products/dryer-sheets',
        stars: 3.5,
        starsCount: 84,
        productId: '222',
        units:50,
        unitPrice:0.3,
        priceExcVat:15
    },
    {

        title: 'Fabric Softener',
        image: 'https://www.cleanerscompare.com/pics/1/40078_sd%20sapotap%20sapocolours.jpg',
        
        href: '/products/sundries/card-paper-products/fabric-softener',
        stars: 5,
        starsCount: 4,
        productId: '333',
        units:120,
        unitPrice:0.34,
        priceExcVat:80
    },
    {

        title: 'Stain Remover',
        image: 'https://www.cleanerscompare.com/pics/1/40078_sd%20tufftape%20strong.jpg',
        href: '/products/sundries/card-paper-products/fabric-softener',
        stars: 4.5,
        starsCount: 184,
        productId: '444', 
        units:10,
        unitPrice:1.5,
        priceExcVat:19
    }
] */

export function FeaturedAndProducts({ initFeaturedProducts }: { initFeaturedProducts: any }) {
    /* const [isClient, setIsClient] = useState(false) */
    const featuredProducts = initFeaturedProducts;//useHomeProductContext();
     
    //console.log(featuredProducts,';;;;;;;;;;');
    return (
        <section className="w-full px-4 md:px-8 py-10 mb-5 ">
            <div className="w-full container mx-auto">
                <div className='flex justify-between items-center mb-3'>
                    <h2 className="text-2xl font-bold text-left">Featured Products</h2>
                    <Link href="/products?type=featured-products" className='text-blue-400 font-medium text-sm hover:underline'>View all</Link>
                </div>

                <MyCarousel>
                    {featuredProducts.map((slide, i) => (
                        <ItemFeaturedProduct key={i} {...slide} />
                    ))}
                </MyCarousel>
            </div>
        </section>
    )
}
