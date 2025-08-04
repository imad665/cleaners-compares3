/* 'use client' */
import Link from "next/link";
/* import Slider from 'react-slick' */
/* import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css" */
/* import { settingsSlider } from "./serverComponents/uis";
import { useHomeProductContext } from "@/providers/homeProductsProvider"; */
import { VideoItem } from "./clientComponents/uis";
import MyCarousel from "./clientComponents/myCarousel";
 


/* const slides = [
    {
        videoUrl: '',
        title: 'How to Maintain Your Commercial Washing Machine',
        views: 45000,
        thumbnail: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&h=400&fit=crop',
        duration: (12 * 60),
    },
    {
        videoUrl: '',
        title: 'How to Maintain Your Commercial Washing Machine',
        views: 45000,
        thumbnail: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop',
        duration: (12 * 60),
    },
    {
        videoUrl: '',
        title: 'How to Maintain Your Commercial Washing Machine',
        views: 45000,
        thumbnail: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&h=400&fit=crop',
        duration: (12 * 60),
    },
    {
        videoUrl: '',
        title: 'How to Maintain Your Commercial Washing Machine',
        views: 45000,
        thumbnail: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&h=400&fit=crop',
        duration: (12 * 60),
    },
    {
        videoUrl: '',
        title: 'How to Maintain Your Commercial Washing Machine',
        views: 45000,
        thumbnail: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&h=400&fit=crop',
        duration: (12 * 60),
    },
] */


export function EducationalAndVideos(
    {
        initYoutubVideos
    }:
    {
        initYoutubVideos:any
    }
) {
    //const { youtubeVideos } = useHomeProductContext();
    //console.log(youtubeVideos,'yyyyyyyyyyyyyyooooooooooooottttttt');
    const youtubeVideos=initYoutubVideos;
    return (
        <section className="w-full px-4 md:px-8 py-10  bg-gray-100">
            <div className="  container mx-auto">
                <div className='flex justify-between items-center mb-6'>
                    <h2 className="text-2xl font-bold  text-left">
                        Educational Videos
                    </h2>
                    <Link href="/videos" className=' text-blue-400 font-medium text-sm hover:underline'>View all videos</Link>
                </div>
                <MyCarousel>
                    {youtubeVideos?.map((slide, i) => (
                        <VideoItem   key={i} {...slide} />
                    ))}
                </MyCarousel>
            </div>
        </section>
    )
}
