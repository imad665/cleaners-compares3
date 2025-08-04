'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SellerInboxList from '@/components/inboxSeller/inbox/SellerInboxList';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useHomeContext } from '@/providers/homePageProvider';

interface SellerSalesData {
  buyer: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  items: Array<{
    orderId: string;
    product: {
      id: string;
      title: string;
      price: number;
      discountPrice?: number;
      imagesUrl: string[];
      condition: string;
    };
    quantity: number;
    unitPrice: number;
    status: string;
    paymentIntentId: string;
    orderDate: string;
    orderStatus: string;
  }>;
  totalAmount: number;
  conversations: Array<{
    id: string;
    subject: string;
    message: string;
    buyerId: string;
    sellerId: string;
    productId?: string;
    createdAt: string;
    updatedAt: string;
    buyerRead: boolean;
    sellerRead: boolean;
    buyer?: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }>;
}

const SellerMessagesPage: React.FC = () => {
  const {user} = useHomeContext(); 
  //const router = useRouter();
  const [salesData, setSalesData] = useState<SellerSalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
   
   
  // Fetch seller sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      //if (status !== 'authenticated') return;

      try {
        setLoading(true);
        const response = await fetch('/api/orders/seller');
        
        if (!response.ok) {
          throw new Error('Failed to fetch sales data');
        }

        const result = await response.json();
        
        if (result.success) {
          setSalesData(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch sales data');
        }
      } catch (err) {
        console.error('Error fetching sales data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load customer messages');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Transform sales data to conversations format
  const allConversations = React.useMemo(() => {
    const conversations: any[] = [];
    
    salesData.forEach(sale => {
      // Add conversations from inquiries
      sale.conversations.forEach(conv => {
        conversations.push({
          ...conv,
          buyer: sale.buyer,
          // Create a unique conversation ID that includes buyer info
          id: `${conv.id}?buyerId=${sale.buyer.id}`
        });
      });

      // If there are items but no conversations, create placeholder conversations for each order
      if (sale.conversations.length === 0 && sale.items.length > 0) {
        const orderIds = [...new Set(sale.items.map(item => item.orderId))];
        orderIds.forEach(orderId => {
          const orderItems = sale.items.filter(item => item.orderId === orderId);
          const firstItem = orderItems[0];
          
          conversations.push({
            id: `${orderId}?buyerId=${sale.buyer.id}`,
            subject: `Order ${orderId.slice(-8)}`,
            message: `Order for ${orderItems.length} item(s)`,
            buyerId: sale.buyer.id,
            sellerId:  user?.id || '',
            productId: firstItem.product.id,
            createdAt: firstItem.orderDate,
            updatedAt: firstItem.orderDate,
            buyerRead: true,
            sellerRead: true,
            buyer: sale.buyer
          });
        });
      }
    });

    return conversations.sort((a, b) => 
      new Date(b.updatedAt || b.createdAt).getTime() - 
      new Date(a.updatedAt || a.createdAt).getTime()
    );
  }, [salesData,  user?.id]);

  console.log(allConversations,'nnnnnnnnnnnnnnnnn');
  

  if ( loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading customer messages...</span>
        </div>
      </div>
    );
  }

   

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Customer Messages</h1>
            <p className="text-gray-600 mt-1">
              Manage conversations with your customers about their orders
            </p>
          </div>
          
          <div className="h-[calc(100vh-170px)]">
            <SellerInboxList conversations={allConversations} />
          </div>
        </div>
      </div>
      <div className="w-[100vw] h-30"></div>
    </div>
  );
};

export default SellerMessagesPage;
