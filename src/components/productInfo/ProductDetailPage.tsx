'use client'
import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ProductBreadcrumb from './product/ProductBreadcrumb';
import ProductGallery from './product/ProductGallery';
import ProductInfo from './product/ProductInfo';
import ProductReviews from './product/ProductReviews';
import RelatedProducts from './product/RelatedProducts';
import { useProductData } from '@/hooks/useProductData';
import { FeaturedAndProducts } from '../home_page/featured_product';

type ProductDetailType = {
  categorySlug : string
  subcategorySlug :string
  productSlug :string
  
}

export default function ProductDetailPage(
  {
    categorySlug,
    subcategorySlug,
    productSlug 
  }:
  {
    categorySlug:string,
    subcategorySlug:string,
    productSlug:string,
 
  }
) {
  const { product, reviews, isLoading, error } = useProductData(categorySlug, subcategorySlug, productSlug);
  //const [selectedVariant, setSelectedVariant] = useState(0);
  //console.log(product,'iiiiiiiiiiiiiiiiidddddddd');
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col gap-4 w-full max-w-6xl">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-12 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There was an error loading the product. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  //const currentVariant = product.variants[selectedVariant];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <ProductBreadcrumb
        /* category={product.category}
        subcategory={product.subcategory}
        name={product.name} */
        category={categorySlug}
        subcategory={subcategorySlug}
        name={productSlug}
      />

      {/* Product Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-6">
        {/* Product Gallery */}
        <ProductGallery
          images={product.images}
          videoUrl={product.videoUrl}
        />

        {/* Product Info */}
        <ProductInfo
          product={product} 
        />
      </div>

      {/* Reviews Section */}
      <ProductReviews
        productId={product.id}
        reviews={reviews}
        averageRating={product.rating}
        totalReviews={reviews.length}
      />

      {/* Related Products */}
      {/* <RelatedProducts products={relatedProducts} /> */}
      
    </div>
  );
}