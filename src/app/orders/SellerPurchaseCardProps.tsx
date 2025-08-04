// components/BuyerPurchaseCard.tsx
'use client'

import Image from 'next/image';
import { ConfirmDeliveryButton } from './confirmDeliveryButton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useState } from 'react';

interface PurchaseItem {
  orderId: string;
  product: {
    id: string;
    title: string;
    price: number;
    discountPrice: number | null;
    imagesUrl: string[];
    condition: string;
  };
  quantity: number;
  unitPrice: number;
  status: string;
  paymentIntentId: string | null;
  orderDate: Date;
  orderStatus: string;
}

interface GroupedOrder {
  orderId: string;
  orderDate: Date;
  orderStatus: string;
  items: PurchaseItem[];
  totalAmount: number;
  overallStatus: string;
  canConfirmDelivery: boolean;
}

interface SellerPurchaseCardProps {
  seller: {
    id: string;
    name: string;
    email: string;
    businessName: string;
  };
  items: PurchaseItem[];
  totalAmount: number;
  onContactSeller?: () => void;
  onViewConversation?: () => void;
}

const statusVariantMap: Record<string, "secondary" | "destructive" | "default" | "outline" | null | undefined> = {
  PENDING: 'secondary',
  PROCESSING: 'default',
  SHIPPED: 'default',
  DELIVERED: 'secondary',
  CANCELLED: 'destructive',
  RETURNED: 'default',
  PAID: 'secondary',
  REQUIRE_CAPTURE: 'default',
};

export function SellerPurchaseCard({
  seller,
  items,
  totalAmount,
  onContactSeller,
  onViewConversation,
}: SellerPurchaseCardProps) {
  // Group items by order ID
  const groupedOrders: GroupedOrder[] = Object.values(
    items.reduce((acc, item) => {
      if (!acc[item.orderId]) {
        acc[item.orderId] = {
          orderId: item.orderId,
          orderDate: item.orderDate,
          orderStatus: item.orderStatus,
          items: [],
          totalAmount: 0,
          overallStatus: item.status,
          canConfirmDelivery: false,
        };
      }

      acc[item.orderId].items.push(item);
      acc[item.orderId].totalAmount += item.unitPrice;

      // Determine overall status priority: CANCELLED > DELIVERED > SHIPPED > PROCESSING > PENDING
      const statusPriority = {
        CANCELLED: 5,
        DELIVERED: 4,
        SHIPPED: 3,
        PROCESSING: 2,
        PENDING: 1,
        RETURNED: 1,
      };

      const currentPriority = statusPriority[acc[item.orderId].overallStatus as keyof typeof statusPriority] || 0;
      const itemPriority = statusPriority[item.status as keyof typeof statusPriority] || 0;

      if (itemPriority > currentPriority) {
        acc[item.orderId].overallStatus = item.status;
      }

      // Can confirm delivery if any item is SHIPPED
      if (item.status === 'SHIPPED') {
        acc[item.orderId].canConfirmDelivery = true;
      }

      return acc;
    }, {} as Record<string, GroupedOrder>)
  );

  const handleConfirmDelivery = (orderId: string) => {
    setIsconfirm(true);
    window.location.reload();
    // Update all items in the order to DELIVERED status
    const orderItems = items.filter(item => item.orderId === orderId);
    orderItems.forEach(item => {
      item.status = 'DELIVERED';
    });
  };
  const [isConfirm,setIsconfirm]=useState(false);
  return (
    <div className="border mt-2 rounded-lg overflow-hidden shadow-sm mb-6">
      {/* Seller Header */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{seller.businessName || seller.name}</h3>
            <p className="text-sm text-muted-foreground">{seller.email}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total spent</p>
              <p className="font-medium">£{totalAmount.toFixed(2)}</p>
            </div>
            {onContactSeller && (
              <button
                className="mt-1 px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={onContactSeller}
              >
                Contact Seller
              </button>
            )}
            {onViewConversation && (
              <button
                className="mt-1 px-3 py-1 text-sm rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={onViewConversation}
              >
                View Conversation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders List - Grouped by Order ID */}
      <div className="divide-y">
        {groupedOrders.map((order) => (
          <div key={order.orderId} className="p-4">
            {/* Order Header */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <div>
                <h4 className="font-medium text-gray-900">Order #{order.orderId.slice(-8)}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.orderDate), 'PP')} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariantMap[order.overallStatus] || "default"}>
                  {order.overallStatus}
                </Badge>
                {order.orderStatus === 'PAID' && (
                  <Badge variant="secondary">
                    Paid
                  </Badge>
                )}
                {order.canConfirmDelivery && (
                  <ConfirmDeliveryButton 
                    orderId={order.orderId} 
                    sellerId={seller.id} 
                    onSuccess={() => handleConfirmDelivery(order.orderId)}
                  />
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Order Total:</span>
              <span className="text-sm font-medium">£{order.totalAmount.toFixed(2)}</span>
            </div>

            {/* Items in this order */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={`${item.orderId}-${item.product.id}`} className="flex gap-3">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                    {item.product.imagesUrl[0] ? (
                      <Image
                        src={item.product.imagesUrl[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm truncate">{item.product.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × £{(item.unitPrice / item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Condition: <span className="capitalize">{item.product.condition.toLowerCase()}</span>
                    </p>
                  </div>

                  {/* Item Price */}
                  <div className="text-right">
                    <p className="text-sm font-medium">£{item.unitPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
