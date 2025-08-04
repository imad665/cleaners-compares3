/* 'use client'
import Slider from 'react-slick' */
import Link from 'next/link'
 
import { ItemFeaturedProduct, settingsSlider } from './serverComponents/uis'
import MyCarousel from './clientComponents/my-carousel'
/* import { useHomeProductContext } from '@/providers/homeProductsProvider' */

/* const slides = [
    {
        isNew: true,
        isFeatured: true,
        title: 'Electrolux Professional 65lb Washer Extractor',
        price: '$12.99',
        image: 'https://www.cleanerscompare.com/pics/1/80162_con4.jpg',
        href: '/products/detergent',
        stars: 2.5,
        starsCount: 84,
        productId:'99999'
    },
    {
        isNew: false,
        isFeatured: false,
        title: 'Maytag Commercial 20lb Stack Dryer',
        price: '$4.99',
        image: 'https://www.cleanerscompare.com/pics/1/80162_sole.jpg',
        href: '/products/dryer-sheets',
        stars: 3.5,
        starsCount: 84,
        productId:'88888'
    },
    {
        isNew: true,
        isFeatured: false,
        title: 'Fabric Softener',
        price: '$7.49',
        image: 'https://www.cleanerscompare.com/pics/1/80162_elbow18.jpg',
        href: '/products/fabric-softener',
        stars: 5,
        starsCount: 4,
        productId:'22222'
    },
    {
        isNew: false,
        isFeatured: true,
        title: 'Stain Remover',
        price: '$9.99',
        image: 'https://www.cleanerscompare.com/pics/1/80162_insulation.jpg',
        href: '/products/stain-remover',
        stars: 4.5,
        starsCount: 184,
        productId:'44444'
    }
] */
 

export function PartAndAccessoir(
    {initPartsAndAccessoirsProducts}
    :{
        initPartsAndAccessoirsProducts:any
    }
) {
    //const {partsAndAccessoirsProducts} = useHomeProductContext()
    const partsAndAccessoirsProducts=initPartsAndAccessoirsProducts
    return (
        <section className="w-full px-4 md:px-8 py-10 bg-gray-50">
            <div className="container mx-auto">
                <div className='flex justify-between items-center mb-6'>
                <h2 className="text-2xl font-bold  text-left">Parts & Sundries</h2>
                <Link href="/products?type=parts-and-accessoir" className=' text-blue-400 font-medium text-sm hover:underline'>View all</Link>
                </div>
                <MyCarousel>
                    {partsAndAccessoirsProducts.map((slide, i) => (
                        <ItemFeaturedProduct key={i} {...slide} />
                    ))}
                </MyCarousel>
            </div>
        </section>
    )
}
