'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState, useRef } from 'react';
import MyCarousel2 from './my-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomPrevArrow = (props: any) => {
    const { className, onClick, style } = props;
    return (
        <button
            aria-label="Scroll left"
            onClick={onClick}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 transition hidden md:flex"
            style={{ ...style }}
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
    );
};

const CustomNextArrow = (props: any) => {
    const { className, onClick, style } = props;
    return (
        <button
            aria-label="Scroll right"
            onClick={onClick}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 transition hidden md:flex"
            style={{ ...style }}
        >
            <ChevronRight className="w-6 h-6" />
        </button>
    );
};

export default function MyCarousel({ children }: { children: React.ReactNode }) {
    const items = Array.isArray(children) ? children : [children];
    const [isClient, setIsClient] = useState(false);
    const [shouldUseSimpleCarousel, setShouldUseSimpleCarousel] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsContainerRef = useRef<HTMLDivElement>(null);
    const slideCount = items.length;

    useEffect(() => {
        setIsClient(true);

        const checkItemsFit = () => {
            if (!containerRef.current || !itemsContainerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const itemsContainer = itemsContainerRef.current;

            // Temporarily show all items to measure their total width
            itemsContainer.style.display = 'flex';
            itemsContainer.style.visibility = 'hidden';

            // Calculate total width of all items including margins
            let totalWidth = 0;
            const itemElements = itemsContainer.children;

            for (let i = 0; i < itemElements.length; i++) {
                const item = itemElements[i] as HTMLElement;
                const style = window.getComputedStyle(item);
                totalWidth += item.offsetWidth +
                    parseInt(style.marginLeft) +
                    parseInt(style.marginRight);
            }

            // Hide the measurement container again
            itemsContainer.style.display = 'none';
            itemsContainer.style.visibility = 'visible';

            // Add 20px buffer to account for any padding
            setShouldUseSimpleCarousel(totalWidth + 20 <= containerWidth);
        };

        // Initial check
        if (isClient) {
            checkItemsFit();

            // Add resize observer
            const resizeObserver = new ResizeObserver(checkItemsFit);
            if (containerRef.current) {
                resizeObserver.observe(containerRef.current);
            }

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [isClient, items.length]);

    const settings = {
        dots: false,
        infinite: slideCount > 1,
        speed: 800,
        slidesToShow: Math.min(4, slideCount),
        slidesToScroll: 1,
        autoplay: slideCount > 1,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: Math.min(3, slideCount)
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(2, slideCount)
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <div className="w-full" ref={containerRef}>
            {/* Hidden container for measuring item widths */}
            <div
                ref={itemsContainerRef}
                className="flex absolute opacity-0"
                style={{ visibility: 'hidden' }}
            >
                {items.map((item, idx) => (
                    <div key={`measure-${idx}`} className="px-2">
                        {item}
                    </div>
                ))}
            </div>

            {!isClient ? (
                <MyCarousel2>{items}</MyCarousel2>
            ) : shouldUseSimpleCarousel ? (
                <MyCarousel2>
                    {items.map((item, idx) => (
                        <div key={idx} className="px-2">{item}</div>
                    ))}
                </MyCarousel2>
            ) : (
                <Slider {...settings}>
                    {items.map((item, idx) => (
                        <div key={idx} className="px-2">{item}</div>
                    ))}
                </Slider>
            )}
        </div>
    );
}