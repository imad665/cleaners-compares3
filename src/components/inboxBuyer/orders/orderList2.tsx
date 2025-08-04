
import React, { useEffect } from 'react';

import OrderItem from './OrderItem';
import { Order } from '../utils/types';
import { orders } from '../utils/data/mockData';
import { useHomeContext } from '@/providers/homePageProvider';

interface OrdersListProps {
  onContactSeller: (orderId: string) => void;
  onViewConversation: (orderId: string) => void;
  isContactSeller: boolean
  orders: Order[]
}

const OrdersList2: React.FC<OrdersListProps> = ({
  onContactSeller,
  onViewConversation,
  isContactSeller,
  orders
}) => {
  const { user } = useHomeContext();
  const isSignIn = user != undefined;
   
  return (
    <div className="pb-10">
      <h2 className="sr-only">Orders</h2>

      <div className="space-y-4 lg:grid  lg:gap-x-4 lg:px-4 lg:grid-cols-2 ">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderItem
              key={order.id}
              order={order}
              isSignIn={isSignIn}
              onContactSeller={onContactSeller}
              onViewConversation={onViewConversation}
              isContactSeller={isContactSeller}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersList2;