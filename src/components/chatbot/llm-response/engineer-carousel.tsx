// components/llm-response/engineer-carousel.tsx
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface EngineerCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export function EngineerCarousel({ children, className }: EngineerCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <Card className={cn('p-4 w-full border-gray-200 mt-3', className)}>
      <h4 className="text-sm font-semibold mb-3 text-gray-700">Available Engineers</h4>
      <div className="relative w-full">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 scroll-smooth w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-background/80 backdrop-blur-sm rounded-full shadow-md hover:bg-background z-10"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-background/80 backdrop-blur-sm rounded-full shadow-md hover:bg-background z-10"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default EngineerCarousel;