import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  videoUrl?: string;
}

export default function ProductGallery({ images, videoUrl }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-lg bg-muted/30 aspect-square flex items-center justify-center">
        <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
          <DialogTrigger asChild>
            <div className="group cursor-zoom-in relative w-full h-full">
              <img
                src={images[currentImageIndex]}
                alt="Product"
                className="object-contain w-full h-full transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <div className="w-full relative">
              <img
                src={images[currentImageIndex]}
                alt="Product"
                className="w-full h-auto object-contain max-h-[80vh]"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute z-2000 cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-background/80 h-10 w-10 rounded-full flex items-center justify-center shadow-sm hover:bg-background transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute z-2000 cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-background/80 h-10 w-10 rounded-full flex items-center justify-center shadow-sm hover:bg-background transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Video overlay button */}
        {videoUrl && currentImageIndex === 0 && (
          <div className="absolute inset-0  flex items-center justify-center">
            {/* Dark overlay for better button visibility */}
            <div className="absolute inset-0 bg-black/30"></div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="
                    bg-white hover:bg-white 
                    rounded-full 
                    px-6 py-5
                    border-2 border-white
                    shadow-xl
                    transition-all duration-300
                    hover:scale-105
                    group
                    relative z-10
                    backdrop-blur-sm
                  "
                >
                  <div className="
                    bg-red-600
                    rounded-full 
                    p-3
                    mr-3
                    group-hover:bg-red-700
                    transition-colors duration-300
                    shadow-lg
                  ">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800 cursor-pointer">▶ Play Product Video</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="
                max-w-4xl 
                p-0 
                overflow-hidden
                border-none
                rounded-lg
                shadow-2xl
                z-10000
              ">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    title="Product video"
                    width="100%"
                    height="100%"
                    src={videoUrl}
                    className="aspect-video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <DialogClose className="
                  absolute 
                  -right-12 
                  top-0
                  p-2
                  rounded-full
                  bg-gray-800/80
                  hover:bg-gray-700
                  transition-colors
                  text-white
                  focus:outline-none focus:ring-2 focus:ring-white
                ">
                  <X className="h-5 w-5" />
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2",
                currentImageIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <img
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
              {videoUrl && index === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}