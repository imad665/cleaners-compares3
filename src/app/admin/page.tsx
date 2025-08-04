'use client'
import Badge from '@/components/adminDashboard/shared/Badge';
import Card from '@/components/adminDashboard/shared/Card';
import Table from '@/components/adminDashboard/shared/Table';
import { useHomeContext } from '@/providers/homePageProvider';
import { useHomeProductContext } from '@/providers/homeProductsProvider';
import { BarChart3, ShoppingCart, Users, DollarSign, Package, TrendingUp, Activity, MessageCircle, Clock, CheckCircle, Truck, AlertTriangle, Briefcase, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
type DataDashboardType = {
  totalProducts: number,
  totalUsers: number,
  totalRevenue: number,
  newListings: number,
  monthlyRevenue: { month: string, year: string, total: string }[],
  popularCategories: { id: string, name: string, count: number }[],
  recentProducts: any[],
  percentChanges: {
    products: number,
    users: number,
    revenue: number,
    listings: number
  }
}

type OrderStats = {
  totalOrders: number,
  pendingOrders: number,
  shippedOrders: number,
  deliveredOrders: number,
  totalRevenue: number,
  platformRevenue: number,
  totalServiceFeaturedRevenu: number;
  totalRevenueFromSellerPurchase: number;
  totalProductFeaturedRevenu: number;

}
const Dashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DataDashboardType | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useHomeContext();

  const handleMessagesClick = () => {
    router.push('/admin/myMessages/seller');
  };

  const handleOrdersClick = () => {
    router.push('/admin/orders');
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Fetch dashboard data
        const dashboardRes = await fetch('/api/admin/dashboard');
        if (!dashboardRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await dashboardRes.json();
        setDashboardData(dashboardData);

        // Fetch order statistics
        try {
          const ordersRes = await fetch('/api/seller/orders?isMain=true');
          if (ordersRes.ok) {
            const {
              ordersData,
              totalProductFeaturedRevenu,
              totalServiceFeaturedRevenu,
              totalRevenueFromSellerPurchase
            } = await ordersRes.json();

            const totalOrders = ordersData.length;
            const pendingOrders = ordersData.filter((order: any) => order.status === 'PENDING').length;
            const shippedOrders = ordersData.filter((order: any) => order.status === 'SHIPPED').length;
            const deliveredOrders = ordersData.filter((order: any) => order.status === 'DELIVERED').length;
            /* const totalRevenue = ordersData
              .filter((order: any) => order.status === 'DELIVERED')
              .reduce((sum: number, order: any) => sum + (order.unitPrice), 0); */
            //console.log(ordersData, 'mmmmmmmmmmmmmmmmmmm');

            const totalRevenue = ordersData
              .filter((order: any) => order.status === 'DELIVERED')
              .reduce((sum, order) => {
                const totalPrice = order.unitPrice;
                const commission = totalPrice * (order.order.commisionRate / 100);
                const sellerEarnings = totalPrice - commission;
                return sum + sellerEarnings;
              }, 0);

            const platformRevenue = totalRevenueFromSellerPurchase
              + totalServiceFeaturedRevenu + totalProductFeaturedRevenu;



            setOrderStats({
              totalOrders,
              pendingOrders,
              shippedOrders,
              deliveredOrders,
              totalRevenue,
              platformRevenue,
              totalServiceFeaturedRevenu,
              totalRevenueFromSellerPurchase,
              totalProductFeaturedRevenu,
            });
          }
        } catch (orderError) {
          console.log('Orders data not available for this user');
        }

      } catch (error) {
        toast.error('Error loading dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  // Table columns
  const columns = [
    {
      header: 'Product Name',
      accessor: 'name',
    },
    {
      header: 'Category',
      accessor: (product: any) => (
        <div>
          <p className="text-xs text-muted-foreground mt-2 flex flex-col gap-2">
            <span className="text-black">{product.parent}</span>
            <span> {product.category}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: (product: any) => (
        <div>
          {product.isDealActive ? <p className="text-xs text-muted-foreground mt-2 flex flex-col gap-2">
            <span className="line-through mr-2">£{product.price}</span>
            <span>✅ New price £{product.discountPrice}</span>
          </p> :
            <p>£{product.price}</p>
          }
        </div>
      ),
    },

    {
      header: 'Date Added',
      accessor: 'date',
    },
  ];
  const percentProduct = dashboardData?.percentChanges.products || 0;
  const percentUsers = dashboardData?.percentChanges.users || 0;
  const percentRevenue = dashboardData?.percentChanges.revenue || 0;
  const percentNewListings = dashboardData?.percentChanges.listings || 0;
  return (
    <div className="space-y-6">
      {/* Header Section with Action Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your marketplace statistics and recent activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleMessagesClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <MessageCircle size={20} />
            Messages
          </Button>
          {orderStats && (
            <Button
              onClick={handleOrdersClick}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Package size={20} />
              Orders
            </Button>
          )}
        </div>
      </div>

      {loading ? <div className="flex justify-center mt-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div> : <>
        {/* Product Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Total Products"
            value={dashboardData?.totalProducts || 0}
            trend={percentProduct >= 0 ? 'up' : 'down'}
            trendValue={`${percentProduct > 0 ? '+' : percentProduct < 0 ? '-' : ''}${percentProduct}% from last month`}
            icon={<ShoppingCart size={20} />}
          />
          {user?.role === 'ADMIN' && <Card
            title="Total Users"
            value={dashboardData?.totalUsers || 0}
            trend={percentUsers >= 0 ? 'up' : 'down'}
            trendValue={`${percentUsers > 0 ? '+' : percentUsers < 0 ? '-' : ''}${percentUsers}% from last month`}
            icon={<Users size={20} />}
          />}
          {user?.role === 'ADMIN' && (
            <Card
              title="Platform Revenue (Sales + Featured)"
              value={`£${orderStats?.platformRevenue?.toFixed(2) || '0.00'}`}
              trend={percentRevenue >= 0 ? 'up' : 'down'}
              trendValue={`${percentRevenue > 0 ? '+' : percentRevenue < 0 ? '-' : ''}${percentRevenue}% from last month`}
              icon={<TrendingUp size={20} />}
              description="Includes revenue from seller commissions and featured product fees"
            />
          )}
          {/* <Card
            title="Revenue"
            value={dashboardData?.totalRevenue || 0}
            trend={percentRevenue >= 0 ? 'up' : 'down'}
            trendValue={`${percentRevenue > 0 ? '+' : percentRevenue < 0 ? '-' : ''}${percentRevenue}% from last month`}
            icon={<DollarSign size={20} />}
          /> */}
          <Card
            title="New Listings"
            value={dashboardData?.newListings || 0}
            trend={percentNewListings >= 0 ? 'up' : 'down'}
            trendValue={`${percentNewListings > 0 ? '+' : percentNewListings < 0 ? '-' : ''}${percentNewListings}% from last month`}
            icon={<Package size={20} />}
          />

          {user?.role === 'ADMIN' &&<Card
            title="Service Featured Revenue"
            value={`£${orderStats?.totalServiceFeaturedRevenu?.toFixed(2) || '0.00'}`}
            trend={'down'}
            trendValue={`  from last month`}
            icon={<Briefcase size={20} />}
            description="From engineers paying to feature their service listings"
          />}
          {user?.role === 'ADMIN' &&<Card
            title="Seller Commission Revenue"
            value={`£${orderStats?.totalRevenueFromSellerPurchase?.toFixed(2) || '0.00'}`}
            trend={'down'}
            trendValue={` from last month`}
            icon={<ShoppingCart size={20} />}
            description="Commission taken from successful seller product sales"
          />}
          {user?.role === 'ADMIN' &&<Card
            title="Product Featured Revenue"
            value={`£${orderStats?.totalProductFeaturedRevenu?.toFixed(2) || '0.00'}`}
            trend={  'down'}
            trendValue={` from last month`}
            icon={<Star size={20} />}
            description="Revenue from sellers paying to feature products"
          />}
        </div>

        {/* Order Statistics Cards */}
        {orderStats && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
              <Button
                onClick={handleOrdersClick}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                View All Orders
                <TrendingUp size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                title="Total Orders"
                value={orderStats.totalOrders}
                icon={<ShoppingCart size={20} />}
                trend="neutral"
                description="All time orders"
              />
              <Card
                title="Pending Orders"
                value={orderStats.pendingOrders}
                icon={<Clock size={20} />}
                trend={orderStats.pendingOrders > 0 ? "up" : "neutral"}
                trendValue={orderStats.pendingOrders > 0 ? "Needs attention" : "All caught up"}
              />
              <Card
                title="Shipped Orders"
                value={orderStats.shippedOrders}
                icon={<Truck size={20} />}
                trend="up"
                description="In transit"
              />
              <Card
                title="Revenue (Delivered)"
                value={`£${orderStats.totalRevenue.toFixed(2)}`}
                icon={<DollarSign size={20} />}
                trend="up"
                description={`From ${orderStats.deliveredOrders} orders`}
              />
            </div>
          </>
        )}

        {/* Recent Products Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
            {/* <a href="/products" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
              View All <TrendingUp size={16} className="ml-1" />
            </a> */}
          </div>
          <Table
            columns={columns}
            data={dashboardData?.recentProducts || []}
            keyField="id"
            itemsPerPage={5}
          /* actions={(product) => (
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-800">View</button>
              <button className="text-gray-600 hover:text-gray-800">Edit</button>
            </div>
          )} */
          />
        </div>
      </>
      }

      <div className='w-[100vw] h-30'></div>
    </div>
  );
};

export default Dashboard;
