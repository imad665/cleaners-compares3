'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

export default function MyCarousel2({ children }: { children: React.ReactNode }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(0);
    const touchStartScroll = useRef(0);

    // Scroll buttons
    const scroll = (direction: 'left' | 'right') => {
        const container = scrollRef.current;
        if (!container) return;
        
        const scrollAmount = container.clientWidth * 0.8;
        const newPosition = direction === 'left' 
            ? Math.max(0, container.scrollLeft - scrollAmount)
            : Math.min(
                container.scrollWidth - container.clientWidth,
                container.scrollLeft + scrollAmount
            );
        
        container.scrollTo({
            left: newPosition,
            behavior: 'smooth',
        });
    };

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartX.current = touch.clientX;
        touchStartScroll.current = scrollRef.current?.scrollLeft || 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!scrollRef.current) return;
        
        const touch = e.touches[0];
        const diff = touchStartX.current - touch.clientX;
        scrollRef.current.scrollLeft = touchStartScroll.current + diff;
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Navigation buttons */}
            {isHovered && (
                <>
                    <button
                        aria-label="Scroll left"
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 transition hidden md:flex"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        aria-label="Scroll right"
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 transition hidden md:flex"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Scrollable container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto py-3 gap-3 scroll-smooth px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                {children}
            </div>
        </div>
    );
}