'use client'

import { Button } from "@/components/ui/button"
import { useHomeContext } from "@/providers/homePageProvider";
import { CheckCircle, Minus, Pause, Play, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react";


export function ButtonSignOut() {
  return (
    <Button className="cursor-pointer " variant="outline" onClick={() => signOut()}>Log Out</Button>
  )
}

export function AddCartButton({ productId, className = '', stock = -1, isOldProduct, isFromCart = false }: { productId: string, className?: string, stock?: number, isOldProduct: boolean, isFromCart?: boolean }) {

  const [count, setCount] = useState(0);
  const { cart, addProduct, removeProduct } = useHomeContext();

  useEffect(() => {
    setCount(cart?.find((c) => c.productId === productId)?.quantity || 0)
  }, [cart])
  //console.log(count,productId,';;;;;;;;;;;;;;;;;;;;llllllllll');

  const handleCount = (quantity: 1 | -1) => {
    if (count === 0 && quantity === -1) return
    setCount(v => v + quantity);
    addProduct(productId, quantity, isFromCart);
  }
  const isTherMore = count < stock && stock != -1 || isFromCart && count < stock && stock != -1;

  return (
    <div className={` bottom-2 left-1 ${className}`}>
      {count === 0 &&
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleCount(1)}
            disabled={!isTherMore}
            className='flex items-center cursor-pointer bg-yellow-400 text-black rounded-2xl hover:bg-yellow-500 w-fit px-6 text-xs'>
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span> Add to cart</span>
          </Button>

          {isFromCart && <Button onClick={() => removeProduct(productId)} className="flex items-center cursor-pointer bg-orange-400/50 text-black rounded-2xl hover:bg-red-500/50 w-fit px-5 text-xs">
            <Trash2 size={16} />
          </Button>}
        </div>
      }
      {isOldProduct && count > 0 &&
        <div className="flex items-center gap-2">
          <span

            className='flex items-center    text-black rounded-2xl   w-fit text-xs'
          >
            <CheckCircle className="w-4 h-4 mr-2" />

            <span>Added</span>
          </span>
          <Button onClick={() => handleCount(-1)} className="flex items-center cursor-pointer bg-orange-400/50 text-black rounded-2xl hover:bg-red-500/50 w-fit px-5 text-xs">
            <span>Remove</span>
          </Button>

        </div>

      }

      {count > 0 && !isOldProduct &&
        <div className='flex gap-2 items-center border-1 rounded-2xl justify-between min-w-25 border-yellow-400 p-3 py-1'>
          {count > 1 ?
            <button onClick={() => handleCount(-1)} className='cursor-pointer'>
              <Minus size={16} />
            </button> :
            <button onClick={() => handleCount(-1)} className='cursor-pointer'>
              <Trash2 size={16} />
            </button>}
          <span className='text-sm'>{count}</span>
          {isTherMore && <button disabled={!isTherMore} onClick={() => handleCount(1)} className='cursor-pointer'>
            <Plus size={16} />
          </button>}
          {!isTherMore && <span className="text-xs text-muted-foreground">Only {stock} items left in stock.</span>}
        </div>}
    </div>
  )
}


import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from "@radix-ui/react-dialog";

export type ItemVideoItemProps = {
  title: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  onClick?: (videoUrl: string) => void;
};

export function VideoItem({ title, videoUrl, thumbnail, description, onClick }: ItemVideoItemProps) {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Function to send play/pause commands to YouTube iframe
  const togglePlayPause = () => {
    if (iframeRef.current) {
      const message = JSON.stringify({
        event: 'command',
        func: isPlaying ? 'pauseVideo' : 'playVideo',
        args: ''
      });
      iframeRef.current.contentWindow?.postMessage(message, '*');
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setIsPlaying(false); // Reset play state when dialog closes
    }}>
      <DialogTrigger asChild>
        <div
          className="cursor-pointer w-[85vw] min-w-[280px] md:max-w-[320px] h-[320px] mx-3 border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-[180px] overflow-hidden">
            <Image 
              src={thumbnail} 
              alt={title} 
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-red-600 text-white p-3 rounded-full">
                <Play size={24} fill="white" />
              </div>
            </div>
          </div>
          <div className="p-4 h-[140px] flex flex-col">
            <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{description}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl lg:max-w-6xl p-0 overflow-hidden bg-black border-none">
        <div className="relative w-full aspect-video bg-black">
          {videoUrl ? (
            <>
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src={videoUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  onClick={togglePlayPause}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} fill="white" />}
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p className="text-red-500">Invalid YouTube URL</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-white">
          <DialogTitle className="text-xl mb-2">{title}</DialogTitle>
          <p className="text-gray-600">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

