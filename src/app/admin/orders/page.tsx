// app/seller/dashboard/orders/page.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Package, Clock, CheckCircle, AlertCircle, MessageCircle, TrendingUp, DollarSign, ShoppingCart, XCircle, Truck } from 'lucide-react';
import { cancelOrderItem, shipOrderItem } from '@/actions/orderAction';
import DashboardCard from '@/components/adminDashboard/shared/Card';
import { captureSellerPayment } from '@/actions/checkoutAction';

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  product: {
    id: string;
    title: string;
    imagesUrl: string[];
  };
  order: {
    id: string;
    createdAt: Date;
    user: {
      name: string;
      email: string;
    };
    commisionRate: number;
    shippingAddress: string;
    shippingCity: string;
  };
};

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/seller/orders');
        const data = await response.json();
        setOrders(data);

        // Group orders by order.id
        const grouped = data.reduce((acc: Record<string, OrderItem[]>, orderItem: OrderItem) => {
          const orderId = orderItem.order.id;
          if (!acc[orderId]) {
            acc[orderId] = [];
          }
          acc[orderId].push(orderItem);
          return acc;
        }, {});
        //console.log(grouped,'................')
        setGroupedOrders(grouped);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Calculate dashboard statistics


  const totalOrderItems = orders.length;
  const uniqueOrdersCount = Object.keys(groupedOrders).length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const shippedOrders = orders.filter(order => order.status === 'SHIPPED').length;
  const deliveredOrders = orders.filter(order => order.status === 'DELIVERED').length;

  const totalRevenue = orders
    .filter(order => order.status === 'DELIVERED')
    .reduce((sum, order) => {
      const totalPrice = order.unitPrice * order.quantity;
      const commission = totalPrice * (order.order.commisionRate / 100);
      const sellerEarnings = totalPrice - commission;
      return sum + sellerEarnings;
    }, 0);

  const handleCancelOrder = async (orderId: string, orderItems: any[]) => {
    setProcessing(orderId);
    try {
      const result = await cancelOrderItem(orderItems[0].id); // You'll need to implement this API endpoint
      if (result.success) {
        // Update all items in this order
        setOrders(orders.map(item =>
          item.order.id === orderId ? { ...item, status: 'CANCELLED' } : item
        ));

        // Update the grouped orders state
        setGroupedOrders(prev => {
          const updated = { ...prev };
          if (updated[orderId]) {
            updated[orderId] = updated[orderId].map(item => ({
              ...item,
              status: 'CANCELLED'
            }));
          }
          return updated;
        });

        toast.success('Order cancelled successfully');
      } else {
        toast.error(result.error || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error('An error occurred while cancelling the order');
    } finally {
      setProcessing(null);
    }
  };

  const handleShipOrder = async (orderId: string, orderItems: any[]) => {
    setProcessing(orderId);
    try {
      //console.log(orderItems,';................vvvvvv');

      const result = await shipOrderItem(orderItems[0].id); // You'll need to implement this API endpoint
      if (result?.success) {
        // Update all items in this order
        setOrders(orders.map(item =>
          item.order.id === orderId ? { ...item, status: 'SHIPPED' } : item
        ));
        const sellerId = result.sellerId;

        // Update the grouped orders state
        setGroupedOrders(prev => {
          const updated = { ...prev };
          if (updated[orderId]) {
            updated[orderId] = updated[orderId].map(item => ({
              ...item,
              status: 'SHIPPED'
            }));
          }
          return updated;
        });
        toast.success('Order marked as shipped');
        const s = await captureSellerPayment(orderId,sellerId)
        if(!s.success)toast.error(s.error)
        else toast.success('Payment captured successfully!');

      } else {
        toast.error(result.error || 'Failed to ship order');
      }
    } catch (error) {
      console.log(error, 'ooooooooooooooooo')
      toast.error('An error occurred while shipping the order');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'PROCESSING':
        return <Badge variant="default">Processing</Badge>;
      case 'SHIPPED':
        return <Badge variant="outline">Shipped</Badge>;
      case 'DELIVERED':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  const handleMessagesClick = () => {
    router.push('/admin/myMessages/seller');
  };
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* ... keep all your existing header and dashboard card code ... */}

      {/* Orders Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Recent Orders</CardTitle>
            <div className='flex gap-2'>
              <Badge variant="outline" className="text-sm">
                {uniqueOrdersCount} Orders {/* ({totalOrderItems} Items) */}
              </Badge>
              <Button
                onClick={handleMessagesClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <MessageCircle size={20} />
                Messages
              </Button>
            </div>

          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(groupedOrders).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16">
                    {/* ... keep your empty state ... */}
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(groupedOrders).map(([orderId, orderItems]) => {
                  const firstItem = orderItems[0];

                  const allSameStatus = orderItems.some(item => item.status === firstItem.status);
                  const canCancel = orderItems.some(item =>
                    item.status === 'PENDING' || item.status === 'PROCESSING'
                  );
                  const canShip = orderItems.some(item =>
                    item.status === 'PENDING' || item.status === 'PROCESSING'
                  );
                  const isCancel = orderItems.some(item => item.status === 'CANCELLED')

                  return (
                    <TableRow key={orderId}>
                      <TableCell className="font-medium">
                        #{orderId.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {orderItems.map(item => (
                            <div key={item.id} className="flex items-center gap-2">
                              {item.product.imagesUrl[0] && (
                                <img
                                  src={item.product.imagesUrl[0]}
                                  alt={item.product.title}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <div>
                                <p>{item.product.title}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} × £{(item.unitPrice / item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{firstItem.order.user.name}</p>
                          <p className="text-sm text-gray-500">{firstItem.order.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(firstItem.order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        £{orderItems.reduce((sum, item) => sum + (item.unitPrice), 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {allSameStatus ? (
                          getStatusBadge(firstItem.status)
                        ) : (
                          <div className="relative group">
                            <Badge disabled variant="outline" className="  ">
                              Mixed
                            </Badge>
                            {/* <div className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-md p-3 border border-gray-200 min-w-[200px]">
                              <div className="space-y-2">
                                {orderItems.map(item => (
                                  <div key={item.id} className="flex items-center gap-2">
                                    {getStatusBadge(item.status)}
                                    <span className="text-sm">{item.product.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div> */}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className='max-w-[40px] text-ellipsis overflow-hidden'>
                        <p>{firstItem.order.shippingCity}</p>
                        <p className="text-sm text-gray-500    ">
                          {firstItem.order.shippingAddress}...
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          { !isCancel && (
                            <Button
                              size="sm"
                              onClick={() => handleShipOrder(orderId, orderItems)}
                              disabled={processing === orderId}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {processing === orderId ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Shipping...
                                </>
                              ) : (
                                <>
                                  <Truck className="h-4 w-4 mr-2" />
                                  Confirm Shipment
                                </>
                              )}
                            </Button>
                          )}

                         {/*  {canCancel && !isCancel && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelOrder(orderId, orderItems)}
                              disabled={processing === orderId}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                            >
                              {processing === orderId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Order
                                </>
                              )}
                            </Button>
                          )} */}

                          {!canShip && !canCancel && (
                            <Button variant="outline" size="sm" disabled>
                              {firstItem.status.toLowerCase()}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className='w-[100vw] h-30'></div>
    </div>
  );
}