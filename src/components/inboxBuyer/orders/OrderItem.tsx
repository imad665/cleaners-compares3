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
  const isUnits = order.units > 0;
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-100">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-32 h-32 flex-shrink-0">
            <img
              src={order.image || '/logo-1.png'}
              alt={order.title || 'Product'}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg max-w-[280px] text-wrap font-medium text-gray-900 truncate">{order.title}</h3>
                <div className="mt-1 flex items-center">
                  <img
                    src={order.sellerAvatar || '/logo-1.png'}
                    alt={'img'}
                    className="w-6 h-6 rounded-full mr-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/logo-1.png';
                      target.alt = 'fallback logo';
                    }}
                  />
                  <p className="text-sm text-gray-500 ">{order.sellerName || 'Unknown Seller'}</p>
                </div>
                <p className='text-sm text-gray-600 py-2'>{order.description}</p>
                <div className="mt-1 flex items-center flex-wrap gap-2 text-sm text-gray-600">

                  <StarsUi stars={order.stars || 0} />

                  {/* {order.dealEndDate && (
                    <>
                      <span>{formatDate(order.dealEndDate)}</span>
                      <span className="text-gray-300">•</span>
                    </>
                  )} */}

                  {order.status && <StatusBadge status={order.status} />}
                </div>
                <div className='mb-3 space-y-2 mt-3'>
                  {isUnits && <p className="flex justify-between text-sm"><span className="text-muted-foreground">Units:</span><span className='font-bold'>{order.units}</span></p>}
                  {isUnits && <p className="flex justify-between text-sm"><span className="text-muted-foreground">Unit Price:</span><span className='font-bold'>£{parseFloat(order.unitPrice).toFixed(2)}</span></p>}
                  <div>
                    <p className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{order.isIncVAT?"Price Inc Vat:":"Price Exc Vat:"}</span>
                      <span className='text-lg font-bold'>£{order.priceExcVat}</span>
                    </p>


                    {order.dealCountdown && (
                      <div className="flex items-center text-sm text-gray-700">

                        <Clock className="h-4 w-4 text-red-500 mr-1" />
                        <span>
                          <span className="mr-1">Deal ends in:</span>
                          <span className="font-semibold text-red-600">{order.dealCountdown}</span>
                        </span>
                        {order.price != order.priceExcVat && <p className="line-through mr-2 text-sm ml-5">  £{order.price}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>


            </div>

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
                <AddCartButton isFromCart={true} stock={order.stock} isOldProduct={order.isOldProduct} className="relative top-0 w-fit" productId={order.productId} />
                {/* <ShowContactInfo
                  signIn={setOpenSignIn}
                  isSignIn={isSignIn}
                  email={order.sellerEmail} phone='-' /> */}
              </div>
            )}
          </div>
        </div>
      </div>
      <SignInUpModal
        openSignIn={openSignIn}
        openSignUp={openSignUp}
        setOpenSignIn={setOpenSignIn}
        setOpenSignUp={setOpenSignUp} />
    </div>
  );
};

export default OrderItem;
