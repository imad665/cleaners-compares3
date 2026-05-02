/* 'use client' */
import Link from "next/link";
/* import Slider from 'react-slick' */
/* import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css" */
/* import { settingsSlider } from "./serverComponents/uis";
import { useHomeProductContext } from "@/providers/homeProductsProvider"; */
import { VideoItem } from "./clientComponents/uis";
import MyCarousel from "./clientComponents/myCarousel";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Youtube } from "lucide-react";



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
        initYoutubVideos,
        className,
    }:
        {
            initYoutubVideos: any;
            className?: string
        }
) {
    //const { youtubeVideos } = useHomeProductContext();
    //console.log(youtubeVideos,'yyyyyyyyyyyyyyooooooooooooottttttt');
    const youtubeVideos = initYoutubVideos;
    return (
        <section className={cn("w-full px-4 md:px-8 py-10  bg-white", className)}>
            <div className="  container mx-auto">
                <div className='flex justify-between items-center mb-6'>
                    <h2 className="text-2xl font-bold  text-left">
                        Educational Videos
                    </h2>
                    <Link href="/videos" className=' text-blue-400 font-medium text-sm hover:underline'>View all videos</Link>
                </div>
                <div className="flex gap-2 flex-col ">
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-bold tracking-tight">Industry Videos & Buying Guides</h2>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Practical tips, product demos and industry insights from the Cleaners Compare YouTube channel.
                        </p>
                        <p className="mt-3 text-sm font-semibold text-youtube">2,500+ industry subscribers</p>
                        <p className="mt-1 text-xs text-muted-foreground">Suppliers can also be featured on our YouTube channel.</p>
                        <Button asChild className="mt-3 bg-youtube hover:bg-youtube/90 text-youtube-foreground" size="sm">
                            <a href="https://www.youtube.com/@amirshahz77" target="_blank" rel="noopener noreferrer">
                                <Youtube className="h-4 w-4" /> Watch on YouTube
                            </a>
                        </Button>
                    </div>
                    <MyCarousel sliderToShow={5} breackpoints={[
                        { breakpoint: 1565, slidesToShow: 4 },
                        { breakpoint: 1300, slidesToShow: 3 },
                        { breakpoint: 1025, slidesToShow: 2 },
                        { breakpoint: 640, slidesToShow: 1 },
                    ]}>
                        {youtubeVideos?.map((slide, i) => (
                            <VideoItem key={i} {...slide} />
                        ))}
                    </MyCarousel>
                </div>

            </div>
        </section>
    )
}
