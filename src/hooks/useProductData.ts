import { Product, ProductSummary, Review } from '@/lib/types/product';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useProductData(
  categorySlug: string,
  subcategorySlug: string,
  productSlug: string
) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API loading delay

    const fetchProductInfo = async () => {
      setIsLoading(true);
      try {
        // Fetch product, reviews, relatedProducts using the slugs
        const res = await fetch(`/api/product?catSlug=${categorySlug}&subSlug=${subcategorySlug}&pSlug=${productSlug}`);
        if(!res.ok){
          const {error} = await res.json();
          toast.error(error)
          return
        }
        const data = await res.json();
        
        
        setProduct(data.product);
        setReviews(data.reviews);
        setRelatedProducts(data.relatedProducts);
      } catch (err) {
        //alert('error')
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
  fetchProductInfo()


    //const timer = setTimeout(() => {
    //  try {


        // Mock product data
        /* setProduct({
          id: 'prod_01',
          name: 'Premium Wireless Headphones',
          description: 'Experience exceptional sound quality with our Premium Wireless Headphones. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for work, travel, or immersive listening experiences.',
          category: 'Electronics',
          subcategory: 'Audio',
          rating: 4.8,
          reviews: 127,
          isNew: true,
          isSale: false,
          isFeatured: true,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          images:[],
          variants: [
            {
              id: 'var_01',
              name: 'Midnight Black',
              price: 299.99,
              compareAtPrice: 349.99,
              colorHex: '#222222',
              inventory: 25,
              images: [
                'https://www.cleanerscompare.com/Uploads/40078_sd%20tufftape%20strong.jpg',
                'https://www.cleanerscompare.com/Uploads/40078_sd%20tufftape%20strong.jpg',
                 
              ]
            },
            {
              id: 'var_02',
              name: 'Arctic Silver',
              price: 299.99,
              compareAtPrice: 349.99,
              colorHex: '#E0E0E0',
              inventory: 12,
              images: [
                'https://www.cleanerscompare.com/Uploads/40078_sd%20tufftape%20strong.jpg',
                'https://www.cleanerscompare.com/Uploads/40078_sd%20tufftape%20strong.jpg',
 
              ]
            },
            {
              id: 'var_03',
              name: 'Coral Red',
              price: 319.99,
              colorHex: '#FF6B6B',
              inventory: 7,
              images: [
                'https://www.cleanerscompare.com/Uploads/40078_sd%20tufftape%20strong.jpg',
                'https://www.cleanerscompare.com/Uploads/40078_sd%20tufftape%20strong.jpg',
 
              ]
            }
          ]
        });

        // Mock reviews data
        setReviews([
          {
            id: 'rev_01',
            userName: 'Alex Johnson',
            rating: 5,
            title: 'Best headphones I\'ve ever owned',
            comment: 'The sound quality is exceptional, and the noise cancellation works perfectly for my commute. Battery life is amazing - I only need to charge them once a week with daily use. Very comfortable for long listening sessions.',
            date: '2025-04-12',
            helpfulCount: 24,
            verifiedPurchase: true,
            
          },
          {
            id: 'rev_02',
            userName: 'Sam Wilson',
            rating: 5,
            title: 'Premium quality and sound',
            comment: 'These headphones are worth every penny. The build quality is solid, and they feel like they\'ll last for years. The sound is balanced and clear, with just the right amount of bass. Highly recommend!',
            date: '2025-04-08',
            helpfulCount: 15,
            verifiedPurchase: true
          },
          {
            id: 'rev_03',
            userName: 'Maria Garcia',
            rating: 4,
            title: 'Great but a bit tight',
            comment: 'The sound quality and noise cancellation are fantastic. My only complaint is that they feel a bit tight on my head after a few hours. They loosened up after a week of use, but still not as comfortable as I\'d like for long sessions.',
            date: '2025-03-22',
            helpfulCount: 7,
            verifiedPurchase: true
          },
          {
            id: 'rev_04',
            userName: 'Jayden Smith',
            rating: 5,
            title: 'Perfect for working from home',
            comment: 'I bought these primarily for work calls and to block out distractions at home. They exceed my expectations in every way. Clear audio, great mic quality for calls, and the noise cancellation is perfect for focusing. Battery life is impressive too.',
            date: '2025-03-15',
            helpfulCount: 11,
            verifiedPurchase: true
          },
          {
            id: 'rev_05',
            userName: 'Taylor Reynolds',
            rating: 4,
            title: 'Almost perfect',
            comment: 'The sound and build quality are excellent, and I love the design. The app works well for customization too. I\'m taking off one star because the ear cushions get a bit warm after extended use, but this is minor compared to all the positives.',
            date: '2025-03-02',
            helpfulCount: 9,
            verifiedPurchase: false
          }
        ]);

        // Mock related products
        setRelatedProducts([
          {
            id: 'related_01',
            name: 'Wireless Earbuds Pro',
            price: 179.99,
            rating: 4.6,
            reviews: 89,
            isNew: false,
            isSale: true,
            images: [
              'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            ]
          },
          {
            id: 'related_02',
            name: 'Premium Bluetooth Speaker',
            price: 129.99,
            compareAtPrice: 149.99,
            rating: 4.4,
            reviews: 76,
            isNew: false,
            isSale: true,
            images: [
              'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            ]
          },
          {
            id: 'related_03',
            name: 'Audiophile Over-Ear Headphones',
            price: 399.99,
            rating: 4.9,
            reviews: 45,
            isNew: true,
            isSale: false,
            images: [
              'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            ]
          },
          {
            id: 'related_04',
            name: 'Noise Cancelling Earbuds',
            price: 149.99,
            rating: 4.3,
            reviews: 112,
            isNew: false,
            isSale: false,
            images: [
              'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            ]
          },
          {
            id: 'related_05',
            name: 'Studio Monitor Headphones',
            price: 249.99,
            rating: 4.7,
            reviews: 58,
            isNew: false,
            isSale: false,
            images: [
              'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            ]
          }
        ]); */

     //   setIsLoading(false);
     // } catch (err) {
     //   setError(err instanceof Error ? err : new Error('Unknown error occurred'));
     //   setIsLoading(false);
     // }
    //}, 800);

    //return () => clearTimeout(timer);
  }, []);

  return {
    product,
    reviews,
    isLoading,
    error,
  };
}