import React, { useState } from 'react';
import { MessageCircle, ExternalLink, Star, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { Order } from '../utils/types';
import StatusBadge from './StatusBadge';
import { AddCartButton } from '@/components/home_page/clientComponents/uis';
import StarsUi from '@/components/home_page/startUi';
import { SignInUpModal } from '@/components/header/header';

interface OrderItemProps {
  order: Order;
  onContactSeller: (orderId: string) => void;
  onViewConversation: (orderId: string) => void;
  isContactSeller: boolean
}

export function ShowContactInfo({ email, phone, signIn, isSignIn }: { email: string, phone: string, signIn: (v: boolean) => void, isSignIn: boolean }) {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className='flex flex-col gap-2'>
      <button
        onClick={() => {
          if (isSignIn)
            setShowContact(!showContact)
          else
            signIn(true)
        }}
        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all"
      >
        {showContact ? (
          <>
            <ChevronUp size={16} className="mr-2" />
            Hide Contact Info
          </>
        ) : (
          <>
            <ChevronDown size={16} className="mr-2" />
            Show Contact Info
          </>
        )}
      </button>

      {showContact && (
        <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-3 rounded-md w-full sm:w-auto">
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong>{phone}</p>
        </div>
      )}
    </div>
  )
}
const OrderItem: React.FC<OrderItemProps> = ({
  order,
  onContactSeller,
  onViewConversation,
  isSignIn,
  isContactSeller
}) => {
  console.log(order, ';;;;;;;;;;############;;;;;');
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isUnits = order.units > 0;
  const hasLongDescription = order.description && order.description.length > 150;
  const displayDescription = hasLongDescription && !isExpanded 
    ? `${order.description.substring(0, 150)}...` 
    : order.description;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-100">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="w-full sm:w-32 h-32 flex-shrink-0">
            <img
              src={order.image || '/logo-1.png'}
              alt={order.title || 'Product'}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left Column - Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 break-words">
                  {order.title}
                </h3>
                
                <div className="mt-2 flex items-center">
                  <img
                    src={order.sellerAvatar || '/logo-1.png'}
                    alt={'img'}
                    className="w-6 h-6 rounded-full mr-2 flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/logo-1.png';
                      target.alt = 'fallback logo';
                    }}
                  />
                  <p className="text-sm text-gray-500 truncate">
                    {order.sellerName || 'Unknown Seller'}
                  </p>
                </div>

                {/* Description with expand/collapse */}
                {order.description && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 break-words">
                      {displayDescription}
                    </p>
                    {hasLongDescription && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-blue-600 hover:text-blue-800 mt-1 font-medium"
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-3 flex items-center flex-wrap gap-2 text-sm text-gray-600">
                  <StarsUi stars={order.stars || 0} />
                  {order.status && <StatusBadge status={order.status} />}
                </div>
              </div>

              {/* Right Column - Pricing Info */}
              <div className="lg:w-48 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {isUnits && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Units:</span>
                        <span className="text-sm font-semibold">{order.units}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Unit Price:</span>
                        <span className="text-sm font-semibold">
                          £{parseFloat(order.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {order.isIncVAT ? "Inc VAT:" : "Exc VAT:"}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        £{order.priceExcVat}
                      </span>
                    </div>

                    {/* Deal Countdown and Original Price */}
                    {order.dealCountdown && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-xs text-red-600">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            Ends in: <span className="font-semibold">{order.dealCountdown}</span>
                          </span>
                        </div>
                        {order.price != order.priceExcVat && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Original:</span>
                            <span className="text-xs text-gray-500 line-through">
                              £{order.price}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isContactSeller ? (
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                <button
                  onClick={() => onContactSeller(order.productId)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Contact Seller
                </button>

                {order.hasConversation && (
                  <button
                    onClick={() => onViewConversation(order.productId)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View Conversation
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                <AddCartButton 
                  isFromCart={true} 
                  stock={order.stock} 
                  isOldProduct={order.isOldProduct} 
                  className="relative top-0 w-fit" 
                  productId={order.productId} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <SignInUpModal
        openSignIn={openSignIn}
        openSignUp={openSignUp}
        setOpenSignIn={setOpenSignIn}
        setOpenSignUp={setOpenSignUp} 
      />
    </div>
  );
};

export default OrderItem;