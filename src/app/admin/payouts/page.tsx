// app/admin/payouts/page.tsx
 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PayoutsToSellers from './PayoutsToSellers';

interface OrderPaymentWithDetails {
  id: string;
  orderId: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  status: string;
  orderItems: {
    id: string;
    unitPrice: number;
    quantity: number;
    productId: string;
    status: string;
  }[];
  commissionRate: number;
  totalCommission: number;
  sellerEarnings: number;
  createdAt: Date;
}

export default async function AdminPayoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Unauthorized: Please login as admin</p>
      </div>
    );
  }

  // First get all order payments that need to be paid to sellers
  const orderPayments = await prisma.orderPayment.findMany({
    where: {
      //isAdminPaidToSeller: false,
      status: 'PAID', // Changed from 'DELIVERED' to 'PAID' as per your error
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email:true,
          sellerProfile:{
            select:{
              country:true, 
              phoneNumber:true,
              city:true,
              businessName:true,
            }
          }
        },
      },
      order: {
        select: {
          id: true,
          commisionRate: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Then fetch order items for each payment separately
  const paymentsWithItems = await Promise.all(
    orderPayments.map(async (payment) => {
      const orderItems = await prisma.orderItem.findMany({
        where: {
          orderId: payment.orderId,
          sellerId: payment.sellerId,
          status: 'DELIVERED',
        },
        select: {
          id: true,
          unitPrice: true,
          quantity: true,
          productId: true,
          status: true,
        },
      });

      const commissionRate = payment.order.commisionRate || 9; // Default to 9% if not specified
      const itemsTotal = orderItems.reduce(
        (sum, item) => sum + (item.unitPrice ),
        0
      );
      const commission = itemsTotal * (commissionRate / 100);
      const sellerEarnings = itemsTotal - commission;

      return {
        id: payment.id,
        orderId: payment.orderId,
        sellerId: payment.sellerId,
        sellerName: payment.seller.name,
        sellerEmail:payment.seller.email,
        sellerAddress:payment.seller.sellerProfile?.country,
        sellerPostCode:payment.seller.sellerProfile?.city,
        sellerPhoneNumber:payment.seller.sellerProfile?.phoneNumber,
        sellerBisunessName:payment.seller.sellerProfile?.businessName,
        amount: itemsTotal,
        status: payment.status,
        orderItems,
        commissionRate,
        totalCommission: commission,
        sellerEarnings,
        createdAt: payment.createdAt,
        isAdminPaidToSeller:payment.isAdminPaidToSeller,
      };
    })
  );

  // Filter out payments with no delivered items
  const processedPayments = paymentsWithItems.filter(payment => payment.orderItems.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Payouts to Sellers</h1>
      <div className="py-6">
        <PayoutsToSellers payments={processedPayments} />
      </div>
    </div>
  );
}