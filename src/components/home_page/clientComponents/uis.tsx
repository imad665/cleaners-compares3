'use client'

import { Button } from "@/components/ui/button"
import { useHomeContext } from "@/providers/homePageProvider";
import { CheckCircle, ChevronRight, Minus, Pause, Play, Plus, ShoppingCart, Trash2, Youtube } from "lucide-react";
import { signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion'

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
          {!isTherMore && <span className="text-xs text-muted-foreground"> {stock} items left in stock.</span>}
        </div>}
    </div>
  )
}


import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export type ItemVideoItemProps = {
  title: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  className?: string
  onClick?: (videoUrl: string) => void;
};

export function VideoItem({ title, videoUrl, thumbnail, description, className }: ItemVideoItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ y: -4 }}
          className={cn(
            "group cursor-pointer min-w-[300px]  flex-shrink-0 bg-white rounded-xl overflow-hidden border border-slate-200  hover:shadow-xl transition-all duration-300",
            className
          )}
        >
          {/* Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden bg-slate-900">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />

            {/* Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white transition-all duration-300 group-hover:bg-red-600 group-hover:border-red-600 group-hover:scale-110 shadow-xl">
                <Play size={20} fill="currentColor" className="ml-1" />
              </div>
            </div>

            {/* Content Type Badge */}
            <div className="absolute bottom-2 left-2">
              <span className="bg-black/60 backdrop-blur-sm text-[9px] font-black text-white px-2 py-0.5 rounded uppercase tracking-widest border border-white/10">
                Tutorial
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-1">
              {title}
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed h-8">
              {description}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase">
                <Youtube className="w-3 h-3 mr-1 text-red-500" />
                Watch Video
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 transition-all" />
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      {/* Theater Mode Dialog */}
      <DialogContent className="max-w-5xl p-0 bg-black border-none overflow-hidden rounded-2xl shadow-2xl">
        <div className="relative aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={`${videoUrl}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        </div>
        <div className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">YOUTUBE</span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-500 text-xs font-medium">Educational Resource</span>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 mb-2">{title}</DialogTitle>
          <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

