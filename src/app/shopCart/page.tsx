'use client'
import { Header, SignInUpModal } from "@/components/header/header";
import OrdersList from "@/components/inboxBuyer/orders/OrdersList";
import { Button } from "@/components/ui/button";
import { useCartStorage } from "@/hooks/useCartStorage";
import { useHomeContext } from "@/providers/homePageProvider";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { orders } from "@/components/inboxBuyer/utils/data/mockData";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import { holdCustomerCheckout, updateOrderStatus, updateSellerPaymentStatus } from "@/actions/checkoutAction";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import OrdersList2 from "@/components/inboxBuyer/orders/orderList2";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({
  totalPrice,
  selectedCart,
  onSuccess,
  shippingInfo
}: {
  totalPrice: number,
  selectedCart: any[],
  onSuccess: () => void,
  shippingInfo: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  }
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState(0);
  const [failedPayments, setFailedPayments] = useState<{
    sellerName: string;
    amount: number;
    reason: string;
  }[]>([]);
  const [isCardComplete, setIsCardComplete] = useState(false); // New state for card completion


  // Minimum amount validation (50 cents USD ≈ £0.38 at 1.3 exchange rate)
  const MINIMUM_AMOUNT_GBP = 0.38;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);
    setFailedPayments([]);

    try {
      // 1. First validate all seller amounts before creating payment intents
      const sellers = selectedCart.reduce((acc, item) => {
        if (!acc.some(s => s.sellerId === item.sellerId)) {
          acc.push({
            sellerId: item.sellerId,
            sellerName: item.sellerName || `Seller ${item.sellerId}`,
            amount: selectedCart
              .filter(i => i.sellerId === item.sellerId)
              .reduce((sum, item) => sum + item.priceExcVat, 0)
          });
        }
        return acc;
      }, [] as { sellerId: string; sellerName: string; amount: number }[]);

      // Check for minimum amounts
      const invalidSellers = sellers.filter(s => s.amount < MINIMUM_AMOUNT_GBP);
      if (invalidSellers.length > 0) {
        setFailedPayments(invalidSellers.map(seller => ({
          sellerName: seller.sellerName,
          amount: seller.amount,
          reason: `Amount must be at least £${MINIMUM_AMOUNT_GBP.toFixed(2)}`
        })));
        throw new Error("Some items don't meet minimum amount requirements");
      }

      // 2. Create payment intents on server if all amounts are valid
      const result = await holdCustomerCheckout(totalPrice, selectedCart, shippingInfo);

      if (!result?.success) {
        throw new Error(result?.error || 'Checkout failed');
      }

      // 3. Process payments sequentially
      for (const [index, payment] of result.paymentIntents.entries()) {
        setCurrentPaymentIndex(index + 1);

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          payment.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement)!,
            },
          }
        );

        if (stripeError) {
          throw new Error(`Payment failed for seller ${payment.sellerId}: ${stripeError.message}`);
        }

        await updateSellerPaymentStatus(
          result.orderId,
          payment.paymentIntentId,
          paymentIntent?.status === "succeeded" ? 'PAID' : 'REQUIRE_CAPTURE'
        );
      }

      // 4. Finalize order status
      await updateOrderStatus(result.orderId, 'PAID');
      toast.success("All payments processed successfully!");
      onSuccess();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);

      if (!failedPayments.length) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setCurrentPaymentIndex(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          onChange={(e) => setIsCardComplete(e.complete)} // Track card completion
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
          {failedPayments.length > 0 && (
            <span> - See details below</span>
          )}
        </p>
      )}

      {failedPayments.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Minimum amount not met for some sellers
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The following sellers require a minimum purchase amount:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {failedPayments.map((payment, index) => (
                    <li key={index}>
                      <strong>{payment.sellerName}</strong>: £{payment.amount.toFixed(2)} - {payment.reason}
                    </li>
                  ))}
                </ul>
                <p className="mt-2">
                  Please add more items from these sellers or remove them from your cart.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPaymentIndex > 0 && (
        <p className="text-sm text-gray-600">
          Processing payment {currentPaymentIndex} of {
            selectedCart.reduce((acc, item) => {
              const sellerExists = acc.find(s => s === item.sellerId);
              return sellerExists ? acc : [...acc, item.sellerId];
            }, [] as string[]).length
          }
        </p>
      )}

      <Button
        type="submit"
        disabled={!stripe || loading || failedPayments.length > 0 || !isCardComplete} // Add !isCardComplete
        className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-bold disabled:bg-gray-400"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing Payments...
          </>
        ) : failedPayments.length > 0 ? (
          "Please fix the issues above"
        ) : (
          <>
            Pay £{totalPrice.toFixed(2)}
            <ShieldCheck className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}

/* function ShippingForm({
  onSubmit,
  initialValues
}: {
  onSubmit: (values: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  }) => void,
  initialValues?: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  }
}) {
  const [formData, setFormData] = useState({
    address: initialValues?.address || '',
    city: initialValues?.city || '',
    country: initialValues?.country || '',
    postalCode: initialValues?.postalCode || '',
    phone: initialValues?.phone || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Continue to Payment
      </Button>
    </form>
  );
} */




function ShippingForm({
  onSubmit,
  initialValues,
}: {
  onSubmit: (values: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  }) => void;
  initialValues?: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  };
}) {
  const [formData, setFormData] = useState({
    address: initialValues?.address || "",
    city: initialValues?.city || "",
    country: initialValues?.country || "",
    postalCode: initialValues?.postalCode || "",
    phone: initialValues?.phone || "",
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestions, setIsSuggestions] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "postalCode") {
      searchAddresses(value);
    }
  };

  const searchAddresses = async (postalCode: string) => {
    if (postalCode.length < 2) {
      //setSuggestions([]);
      setIsSuggestions(false)
      return;
    }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        postalCode
      )}&addressdetails=1&limit=50`
    );
    const data = await res.json();
    setSuggestions(data);
    setIsSuggestions(data.length != 0)
  };

  const handleSelect = (place: any) => {
    const { address } = place;
    setFormData({
      address: address.road || place.display_name, // street address
      city: address.city || address.town || address.village || "",
      country: address.country || "United Kingdom",
      postalCode: formData.postalCode,
      phone: formData.phone,
    });
    //setSuggestions([]);
    setIsSuggestions(false)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      <div>
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          onFocus={(e) => setIsSuggestions(suggestions.length != 0)}
          onBlur={(e) => {
            setTimeout(() => {
              setIsSuggestions(false)
            }, 500)
          }}
          placeholder="Enter UK postcode"
          required
        />
        {isSuggestions && (
          <ul className="absolute z-50 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto mt-1 rounded">
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, city: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, country: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Continue to Payment
      </Button>
    </form>
  );
}


function SubTotal({ selectedCart, onCheckoutSuccess }: {
  selectedCart: any[],
  onCheckoutSuccess: () => void
}) {
  const totalPrice = selectedCart.reduce((sum, product) => sum + product.priceExcVat, 0);
  const totalProducts = selectedCart.length;
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: ''
  });
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const { user } = useHomeContext();

  const handleShippingSubmit = (info: typeof shippingInfo) => {
    setShippingInfo(info);
    setCheckoutStep('payment');
  };

  return (
    <div className="space-y-4">
      <div className="p-3 space-y-2 bg-yellow-50 border border-yellow-100 rounded-lg mx-4 flex items-center justify-between py-3 shadow-sm">
        <div>
          <h3 className="font-medium text-gray-800">
            Total ({totalProducts} items): <strong className="text-black">£{totalPrice.toFixed(2)}</strong>
          </h3>
          <p className="text-sm text-gray-500">
            {/* Shipping and taxes calculated at checkout */}
          </p>
        </div>

        {checkoutStep === 'cart' && (
          <Button 
            disabled = {selectedCart.length === 0}
            onClick={() => {
              if (!user) {
                setOpenSignIn(true);
              } else {
                setCheckoutStep('shipping')
              }

            }}
            className="rounded-full py-4 bg-amber-500 hover:bg-amber-600 text-white cursor-pointer flex items-center"
          >
            Proceed to checkout
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {checkoutStep === 'shipping' && (
        <div className="p-4 border rounded-lg bg-white shadow-sm max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4">Shipping Information</h3>
          <ShippingForm onSubmit={handleShippingSubmit} />
        </div>
      )}

      {checkoutStep === 'payment' && (
        <div className="p-4 border rounded-lg bg-white shadow-sm max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <ShieldCheck className="mr-2 text-green-500" />
            Secure Payment
          </h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              totalPrice={totalPrice}
              selectedCart={selectedCart}
              onSuccess={onCheckoutSuccess}
              shippingInfo={shippingInfo}
            />
          </Elements>
        </div>
      )}
      <SignInUpModal
        openSignIn={openSignIn}
        openSignUp={openSignUp}
        setOpenSignIn={setOpenSignIn}
        setOpenSignUp={setOpenSignUp}

      />
    </div>
  );
}

export default function Page() {
  const { cart, clearCart, removeProduct } = useHomeContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [isCheckoutSuccess, setIscheckoutSuccess] = useState(false);
  const [headerData,setHeaderData] = useState({messages:null,recentOrderCoun:null})
  useEffect(() => {
    if (!cart || cart.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/shop-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cart),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch cart items');
        }

        const { products: products2, featuredProducts, footerData,messages,recentOrderCoun } = await res.json();
        setFeaturedProducts(featuredProducts);
        setHeaderData({messages,recentOrderCoun})
        setFooterData(footerData);
        setProducts(products2);
        /* if(products2.length === 0) clearCart(); */
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Network error');
      } finally {
        setLoading(false);
      }
    };
    if (products.length > 0) return
    fetchProducts();
  }, [cart]);

  const existedProducts = products.filter((p) => cart.find(c => c.productId === p.productId))
  //console.log(existedProducts.length, products.length);
  //console.log(existedProducts, ';;;;;;;;;;;;', cart);

  const selectedCart = cart
    ?.filter(c => c.quantity != 0 && products.find((p) => p.productId === c.productId))
    .map((c) => ({
      ...c,
      priceExcVat: existedProducts?.find((p) => p.productId === c.productId)?.priceExcVat * c.quantity,
      sellerId: existedProducts?.find((p) => p.productId === c.productId)?.sellerId,
    }));
  /* if (!loading && products.length != 0) {
    const notCArt = cart.filter(c => !Boolean(products.find((p) => p.productId === c.productId)))

    for (const c of notCArt) {
      removeProduct(c.productId)
    }
  } */

  const handleCheckoutSuccess = () => {
    clearCart();
    setIscheckoutSuccess(true)
    // Optionally redirect to order confirmation page
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header  notificationData={headerData.messages} recentOrderCount={headerData.recentOrderCoun}/>

      <main className="flex-grow p-4 space-y-5 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading your cart...</span>
          </div>
        ) : (
          <>
            {existedProducts.length>0 ? (
              <>
                {/* selectedCart && selectedCart.length > 0 && */ <SubTotal
                  selectedCart={selectedCart}
                  onCheckoutSuccess={handleCheckoutSuccess}
                />}
                <OrdersList2
                  orders={existedProducts}
                  isContactSeller={false}
                  onContactSeller={() => { }}
                  onViewConversation={() => { }}
                />
              </>
            ) : (
              <>
                {!isCheckoutSuccess ? <div className="text-center py-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                  <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue Shopping
                  </Button>
                </div> :
                  <div className="text-center py-12 px-4 max-w-md mx-auto">
                    <div className="mb-6">
                      <svg
                        className="w-20 h-20 text-green-500 mx-auto animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for your purchase! Your order has been received and is being processed.
                    </p>
                     
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                      >
                        Continue Shopping
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/orders'}
                        className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 flex-1 sm:flex-none"
                      >
                        View Orders
                      </Button>
                    </div>
                  </div>
                }
              </>

            )}
          </>
        )}
      </main>

      {footerData && <Footer footerData={footerData} />}
    </div>
  );
}