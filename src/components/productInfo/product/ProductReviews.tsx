import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Review } from '@/lib/types/product';
import ReviewDialog from '@/components/home_page/reviewForm';
import { useHomeContext } from '@/providers/homePageProvider';
import { SignInUpModal } from '@/components/header/header';

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  productId: string
} 

export default function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
  productId,
}: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState('reviews');
  const [showReviewForm, setShowReviewForm] = useState(false);
  // Calculate rating breakdown
  const ratingCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++;
    }
  });

  // Convert counts to percentages
  const ratingPercentages = ratingCounts.map(count =>
    totalReviews > 0 ? (count / totalReviews) * 100 : 0
  );
  const { user } = useHomeContext();
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  return (
    <div className="mt-16">
      <Tabs defaultValue="reviews" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          {/* <TabsTrigger value="details">Product Details</TabsTrigger> */}
        </TabsList>

        <TabsContent value="reviews" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Summary */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-medium">Customer Reviews</h3>
                <div className="flex items-center mt-2 justify-center md:justify-start">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(averageRating)
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
                  <span className="ml-2 text-lg font-medium">
                    {averageRating.toFixed(1)} out of 5
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {totalReviews} reviews
                </p>
              </div>

              {/* Rating breakdown */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating, index) => (
                  <div key={rating} className="flex items-center">
                    <span className="w-8 text-sm text-muted-foreground">{rating} star</span>
                    <Progress value={ratingPercentages[index]} className="h-2 mx-3 flex-1" />
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {ratingCounts[index]}
                    </span>
                  </div>
                ))}
              </div>

              <Button onClick={() => {
                if (user != undefined) {
                  setShowReviewForm(true)
                }
                else {
                  setOpenSignIn(true);
                }

              }} className="w-full">Write a Review</Button>
            </div>
            <ReviewDialog onReview={()=>{

            }} productId={productId} open={showReviewForm} setOpen={setShowReviewForm} />
            <SignInUpModal
              openSignIn={openSignIn}
              openSignUp={openSignUp}
              setOpenSignIn={setOpenSignIn}
              setOpenSignUp={setOpenSignUp} />
            {/* Reviews list */}
            <div className="md:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium">{review.userName}</span>
                          {/* {review.verifiedPurchase && (
                            <span className="ml-2 flex items-center text-xs text-green-600 dark:text-green-400">
                              <Check className="h-3 w-3 mr-0.5" />
                              Verified Purchase
                            </span>
                          )} */}
                        </div>
                        <div className="flex mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating
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
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium mt-2">{review.title}</h4>
                    <p className="mt-2 text-muted-foreground">{review.comment}</p>

                    {/* Review images, if any */}
                    {/* {review.images && review.images.length > 0 && (
                      <div className="flex mt-3 gap-2 overflow-x-auto">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )} */}

                    {/* Review actions */}
                    {/*  <div className="flex items-center mt-4 space-x-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpfulCount})
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Not Helpful
                      </Button>
                    </div> */}
                  </div>
                ))
              )}

              {reviews.length > 5 && (
                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Product Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    This premium product features high-quality materials and expert craftsmanship to provide you with the best experience. Designed for comfort and durability, it will serve you well for years to come.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>Premium quality materials</li>
                    <li>Ergonomic design for comfort</li>
                    <li>Durable construction</li>
                    <li>Water-resistant finish</li>
                    <li>Versatile functionality</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Specifications</h3>
              <div className="grid grid-cols-3 gap-y-2">
                <div className="col-span-1 text-sm font-medium">Brand</div>
                <div className="col-span-2 text-sm text-muted-foreground">ModernShop</div>

                <div className="col-span-1 text-sm font-medium">Material</div>
                <div className="col-span-2 text-sm text-muted-foreground">Premium Composite</div>

                <div className="col-span-1 text-sm font-medium">Dimensions</div>
                <div className="col-span-2 text-sm text-muted-foreground">10" x 8" x 2"</div>

                <div className="col-span-1 text-sm font-medium">Weight</div>
                <div className="col-span-2 text-sm text-muted-foreground">1.2 lbs</div>

                <div className="col-span-1 text-sm font-medium">Color Options</div>
                <div className="col-span-2 text-sm text-muted-foreground">Slate, Silver, Rose Gold</div>

                <div className="col-span-1 text-sm font-medium">Warranty</div>
                <div className="col-span-2 text-sm text-muted-foreground">1 Year Limited</div>

                <div className="col-span-1 text-sm font-medium">Package Contents</div>
                <div className="col-span-2 text-sm text-muted-foreground">Product, User Manual, Warranty Card</div>

                <div className="col-span-1 text-sm font-medium">Country of Origin</div>
                <div className="col-span-2 text-sm text-muted-foreground">United States</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}