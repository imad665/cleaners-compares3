import { useState } from 'react';
import { Minus, Plus, Check, Shield, Truck, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, ProductVariant } from '@/types/product';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AddCartButton } from '@/components/home_page/clientComponents/uis';
import { ShowContactInfo } from '@/components/inboxBuyer/orders/OrderItem';
import { SignInUpModal } from '@/components/header/header';
import { useHomeContext } from '@/providers/homePageProvider';

interface ProductInfoProps {
  product: Product;

}

export default function ProductInfo({
  product,

}: ProductInfoProps) {
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const {user} = useHomeContext();
  const isUnits = product.units > 0;
  return (
    <div className="flex flex-col space-y-6">
      {/* Product badges */}
      <div className="flex flex-wrap gap-2">
        {product.isNew && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-400">
            New Arrival
          </Badge>
        )}

        {product.isFeatured && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-400">
            Featured
          </Badge>
        )}
      </div>

      {/* Title and rating */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight">{product.name}</h1>
        <div className="flex items-center mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= Math.round(product.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
                  }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
      </div>


      {/* Units */}
      <div className='mb-3 space-y-2 mt-3'>
        {isUnits && <p className="flex justify-between text-sm"><span className="text-muted-foreground">Units:</span><span className='font-bold'>{product.units}</span></p>}
        {isUnits && <p className="flex justify-between text-sm"><span className="text-muted-foreground">Unit Price:</span><span className='font-bold'>£{parseFloat(product.unitPrice).toFixed(3)}</span></p>}
        <div>
          <p className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price Exc Vat:</span>
            <span className='text-lg font-bold'>£{parseFloat(product.priceExcVat).toFixed(3)}</span>
          </p>


          {product.dealCountdown && (
            <div className="flex items-center text-sm text-gray-700">

              <Clock className="h-4 w-4 text-red-500 mr-1" />
              <span>
                <span className="mr-1">Deal ends in:</span>
                <span className="font-semibold text-red-600">{product.dealCountdown}</span>
              </span>
              {product.price != product.priceExcVat && <p className="line-through mr-2 text-sm ml-5">  £{product.price}</p>}
            </div>
          )}
        </div>
      </div>
      <Separator />
      {/* Condition */}
      <div className='flex justify-between gap-12 w-fit'>
        <span className='font-bold'>Condition:</span>
        <span>New</span>
      </div>
      {/* Description */}
      <p className="text-muted-foreground">{product.description}</p>


      <div className="flex flex-col sm:flex-row gap-4">

        <AddCartButton isOldProduct={product.isOldProduct}  className="w-fit" stock={product.stock} productId={product.id} />

{/*         <ShowContactInfo isSignIn={user!=undefined} signIn={setOpenSignIn} email={product.sellerEmail} phone='-' /> */}
      </div>

      <Separator className="my-2" />

      <SignInUpModal
        openSignIn={openSignIn}
        openSignUp={openSignUp}
        setOpenSignIn={setOpenSignIn}
        setOpenSignUp={setOpenSignUp} />
    </div>
  );
}