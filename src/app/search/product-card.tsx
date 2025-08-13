import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  title: string
  image?: string
  href: string
  price: number
  discountPrice?: number
  isDealActive?: boolean
  rating?: number
  favorites?: number
  category?: {
    name: string
    parent?: {
      name: string
    }
  }
}

export function ProductCard({
  title,
  image,
  href,
  price,
  discountPrice,
  isDealActive,
  rating,
  favorites,
  category
}: ProductCardProps) {
  const isOnSale = isDealActive && discountPrice && discountPrice < price

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Link href={href} className="block h-full w-full">
          {image ? (
            <Image
              src={image}
              alt={title}
              width={400}
              height={400}
              className="h-full w-full object-cover object-center group-hover:opacity-75"
              unoptimized // Remove if you have proper image optimization setup
            />
          ) : (
            <div className="h-full w-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </Link>
        
        {/* Sale badge */}
        {isOnSale && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            SALE
          </div>
        )}
      </div>

      <div className="mt-4">
        {/* Category */}
        {category && (
          <div className="text-xs text-gray-500 mb-1 truncate">
            {category.parent?.name && `${category.parent.name} / `}
            {category.name}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          <Link href={href} className="hover:underline line-clamp-2">
            {title}
          </Link>
        </h3>

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center mb-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-2">
            {isOnSale ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  £{discountPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  £{price.toFixed(2)}
                </span>
                {discountPrice && (
                  <span className="text-xs text-red-600">
                    {Math.round((1 - discountPrice / price) * 100)}% OFF
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                £{price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Favorites */}
          {favorites !== undefined && favorites > 0 && (
            <div className="text-xs text-gray-500 flex items-center">
              <span className="text-red-500">♥</span> {favorites}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          asChild
          size="sm"
          className="w-full mt-3 bg-primary hover:bg-primary-dark text-white"
        >
          <Link href={href}>
            View Product
          </Link>
        </Button>
      </div>
    </div>
  )
}