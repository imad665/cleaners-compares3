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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
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
                <div className="flex flex-col md:items-end justify-between md:mb-6 md:flex-row gap-4">
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


                <MyCarousel 
                    sliderToShow={6} 
                    className="[&_.slick-track]:ml-0"
                    breackpoints={[
                        { breakpoint: 1580, slidesToShow: 6 },
                        { breakpoint: 1280, slidesToShow: 5 },
                        { breakpoint: 1100, slidesToShow: 4 },
                        { breakpoint: 1020, slidesToShow: 3 },
                        { breakpoint: 770, slidesToShow: 1 },
                    ]} 
                >
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
