/* 'use client' */

/* import dynamic from 'next/dynamic' */
//import Slider from 'react-slick'
import Link from 'next/link'
/* import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css" */
import { ItemFeaturedProduct } from './serverComponents/uis'
import MyCarousel from './clientComponents/myCarousel';
import ServiceCard from '../serviceEnginner';
import { ArrowRight } from 'lucide-react';
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
        <section className="w-full px-4 md:px-8 py-10  ">
            <div className="w-full container mx-auto">
                {/* <div className='flex justify-between items-center mb-3'>
                    <h2 className="text-2xl font-bold text-left">Featured Products</h2>
                    <Link href="/products?type=featured-products" className='text-blue-400 font-medium text-sm hover:underline'>View all</Link>
                </div> */}
                <div className="flex items-end justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Featured Industry Listings</h2>
                        <p className="text-sm text-muted-foreground mt-1">Machines, parts and supplies currently listed by sellers on Cleaners Compare.</p>
                    </div>
                    <a href="/products?type=featured-products" className="text-sm font-semibold text-primary inline-flex items-center gap-1 whitespace-nowrap">
                        Browse All Listings <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                <MyCarousel sliderToShow={6} breackpoints={[
                    { breakpoint: 1580, slidesToShow: 6 },
                    { breakpoint: 1280, slidesToShow: 5 },
                    { breakpoint: 1100, slidesToShow: 4 },
                    { breakpoint: 1020, slidesToShow: 3 },
                    { breakpoint: 770, slidesToShow: 2 },
                    { breakpoint: 460, slidesToShow: 1 },
                ]}>
                    {featuredProducts.map((slide, i) => (
                        <ItemFeaturedProduct key={i} {...slide} className="min-w-[90vw] min-[460px]:min-w-0" />
                    ))}
                </MyCarousel>
            </div>
        </section>
    )
}


export function FeaturedEnginners({ services }: { services: any }) {

    return (
        <section className="w-full px-4 md:px-8   mb-5 bg-white">
            <div className="w-full container mx-auto">
                <div className="flex items-end justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Featured Engineers</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Trusted engineers and service providers ready to keep your equipment running.
                        </p>
                    </div>
                    <a href="/engineers" className="text-sm font-semibold text-primary inline-flex items-center gap-1 whitespace-nowrap">
                        View All Engineers <ArrowRight className="h-4 w-4" />
                    </a>
                </div>


                <MyCarousel sliderToShow={6} breackpoints={[
                    { breakpoint: 1580, slidesToShow: 6 },
                    { breakpoint: 1280, slidesToShow: 5 },
                    { breakpoint: 1100, slidesToShow: 4 },
                    { breakpoint: 1020, slidesToShow: 3 },
                    { breakpoint: 770, slidesToShow: 1 },
                ]} >
                    {services.map((service, i) => (
                        <div key={i}  >
                            <ServiceCard
                                service={service}
                            />
                        </div>
                    ))}
                </MyCarousel>
            </div>
        </section>)
}
