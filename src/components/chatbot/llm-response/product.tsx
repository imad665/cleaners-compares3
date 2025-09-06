// components/llm-response/product.tsx
import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AddCartButton } from '@/components/home_page/clientComponents/uis';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProductProps {
  title: string;
  description: string;
  category: string;
  price: string;
  discount: string;
  condition: string;
  stock: string;
  featured: string;
  images: string[];
  className?: string;
  productId: string;
}

export function Product({
  title,
  description,
  category,
  price,
  discount,
  condition,
  stock,
  featured,
  images,
  className,
  productId,
}: ProductProps) {

  console.log(productId,';;;;;.................................');
  
  const hasDiscount = discount && discount !== "No discount";
  const parsedPrice = parseFloat(price.replace('$', ''));
  const parsedDiscount = hasDiscount ? 
    (discount.includes('%') 
      ? parseFloat(discount.replace('%', '')) 
      : parseFloat(discount.replace('$', ''))) 
    : 0;
  
  const finalPrice = hasDiscount
    ? discount.includes('%')
      ? parsedPrice * (1 - parsedDiscount / 100)
      : parsedPrice - parsedDiscount
    : parsedPrice;

  const isInStock = parseInt(stock) > 0;
  const stockStatus = isInStock ? "In Stock" : "Out of Stock";

  return (
    <Card className={cn(
      'w-52 flex-shrink-0 border border-gray-200/60 bg-white/95 backdrop-blur-sm',
      'transition-all duration-200 hover:shadow-md hover:border-gray-300',
      className
    )}>
      {/* Compact Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {images.length > 0 ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-muted-foreground text-xs">No image</span>
          </div>
        )}
        
        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {featured === "Yes" && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] px-1.5 py-0.5">
              Featured
            </Badge>
          )}
          
          {hasDiscount && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 ml-auto">
              {discount.includes('%') ? discount : `Save ${discount}`}
            </Badge>
          )}
        </div>

        {/* Condition badge at bottom */}
        <Badge variant={condition === "New" ? "default" : "secondary"} 
               className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5">
          {condition}
        </Badge>
      </div>
      
      <CardContent className="p-3">
        {/* Category */}
        <div className="mb-1.5">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {category}
          </span>
        </div>
        
        {/* Product Title */}
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 leading-tight min-h-[2.5rem]">
          {title}
        </h3>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1.5">
              <span className="font-bold text-foreground text-sm">
                ${finalPrice.toFixed(2)}
              </span>
              
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  ${parsedPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <span className={`text-[11px] font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
              {stockStatus}
            </span>
          </div>
          
          {/* Compact Add to Cart Button */}
          <AddCartButton 
            productId={productId} 
            isOldProduct={false}
            stock={parseInt(stock || '0')} 
          />
             
        </div>
      </CardContent>
    </Card>
  );
}

export default Product;