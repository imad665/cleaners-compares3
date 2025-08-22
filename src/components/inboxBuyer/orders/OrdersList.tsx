
import React, { useEffect } from 'react';

import OrderItem from './OrderItem';
import { Order } from '../utils/types';
import { orders } from '../utils/data/mockData';
import { useHomeContext } from '@/providers/homePageProvider';
import { SellerPurchaseCard } from '@/app/orders/SellerPurchaseCardProps';
import OrderListSkeleton from '@/components/ui/OrderListSkeleton';

interface SellerGroup {
  seller: {
    id: string;
    name: string;
    email: string;
    businessName: string;
  };
  items: any[];
  totalAmount: number;
}

interface OrdersListProps {
  onContactSeller: (sellerId: string) => void;
  onViewConversation: (sellerId: string) => void;
  isContactSeller: boolean;
  orders: SellerGroup[];
  loading:boolean;
}

const OrdersList: React.FC<OrdersListProps> = ({
  onContactSeller,
  onViewConversation,
  isContactSeller,
  orders,
  loading
}) => {
  const { user } = useHomeContext();
  const isSignIn = user != undefined;
   
  return (
    <div className="pb-10">
      <h2 className="sr-only">Orders</h2>

      {loading ? (
        <OrderListSkeleton />
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4 lg:grid lg:gap-x-4 lg:px-4 lg:grid-cols-2">
          {orders.map((group) => (
            <SellerPurchaseCard
              key={group.seller.id}
              seller={group.seller}
              items={group.items}
              messageNotRead={group.messageNotRead}
              totalAmount={group.totalAmount}
              onContactSeller={() => onContactSeller(group.seller.id)}
              onViewConversation={() => onViewConversation(group.seller.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;