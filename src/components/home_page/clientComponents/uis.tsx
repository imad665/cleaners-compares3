'use client'

import { Button } from "@/components/ui/button"
import { useHomeContext } from "@/providers/homePageProvider";
import { CheckCircle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react";


export function ButtonSignOut() {
  return (
    <Button className="cursor-pointer " variant="outline" onClick={() => signOut()}>Log Out</Button>
  )
}

export function AddCartButton({ productId, className = '', stock = -1, isOldProduct, isFromCart = false }: { productId: string, className?: string, stock?: number, isOldProduct: boolean, isFromCart?: boolean }) {

  const [count, setCount] = useState(0);
  const { cart, addProduct } = useHomeContext();

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
        <Button
          onClick={() => handleCount(1)}
          disabled={!isTherMore}
          className='flex items-center cursor-pointer bg-yellow-400 text-black rounded-2xl hover:bg-yellow-500 w-fit px-6 text-xs'>
          <ShoppingCart className="w-4 h-4 mr-2" />
          <span> Add to cart</span>
        </Button>}
      {isOldProduct && count > 0 &&
        <div className="flex items-center gap-2">
          <span
            
            className='flex items-center cursor-pointer  text-black rounded-2xl hover:bg-yellow-500/50 w-fit text-xs'
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="cursor-pointer w-[85vw] min-h-[290px] bg-yellow-50 min-w-[280px] md:max-w-[320px] mx-3 border-1 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          onClick={() => {
            /* onClick(videoUrl); */
            setOpen(true);
          }}
        >
          <Image src={thumbnail} alt={title} width={400} height={200} className="w-full object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-6xl mt-5">
        <DialogTitle>{title}</DialogTitle>
        {videoUrl ? (
          <div className="w-full aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-red-500">Invalid YouTube URL{videoUrl}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

