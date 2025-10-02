// components/admin/PayoutsToSellers.tsx
'use client';

import { markPaymentAsPaid } from '@/actions/markPaidAction';
import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';

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

interface PayoutsToSellersProps {
  payments: OrderPaymentWithDetails[];
}


import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SellerInfoDialog } from './sellerContactInfoDialog';


const PaymentStatusBadge = ({ isPaid }: { isPaid: boolean }) => {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
      isPaid
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    )}>
      {isPaid ? (
        <>
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          <span>paid</span>
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1.5" />
          <span>Pending Payment</span>
        </>
      )}
    </div>
  );
};

const PaymentConfirmationDialog = ({ paymentId, onConfirm }: { paymentId: string, onConfirm: (paymentId: string) => void }) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await markPaymentAsPaid(paymentId);
        if (result.success) {

          setOpen(false);
          onConfirm(paymentId);
        } else {
          toast.error(result.message)
        }

      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to process payment"
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Mark as Paid
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Seller Payout</DialogTitle>
          <DialogDescription className="text-left">
            This will mark the payment record as completed in our system.
            Please ensure you have:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {/* <li>Verified the order was delivered successfully</li> */}
              <li>Completed the actual bank transfer to the seller</li>
              <li>Confirmed the transfer details with the seller</li>
            </ul>
            <p className="mt-3 font-medium">
              Note: This action only updates our records and does not automatically transfer funds.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payout"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};





const PayoutsToSellers: React.FC<PayoutsToSellersProps> = ({ payments }) => {

  //const [isPending, startTransition] = useTransition();
  const [paymentsData, setPaymentsData] = useState(payments);

  /* const handleMarkAsPaid = (orderPaymentId: string) => {
    startTransition(async () => {
      try {
        //const result = await markPaymentAsPaid(orderPaymentId);

        if (result.success) {
          setPaymentsData(paymentsData.filter(payment => payment.id !== orderPaymentId));
          toast.success('Payment marked as paid successfully');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to mark payment as paid');
      }
    });
  }; */
  const onConfirm = (orderPaymentId: string) => {
    setPaymentsData(paymentsData.map((p) => ({
      ...p, isAdminPaidToSeller: p.id === orderPaymentId ? true : p.isAdminPaidToSeller
    })))
    //setPaymentsData(paymentsData.filter(payment => payment.id !== orderPaymentId));
    toast.success('Payment marked as paid successfully');

  }

  if (paymentsData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No pending payouts found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller Earnings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentsData.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.sellerName}</div>
                  <div className="text-sm text-gray-500 overflow-hidden text-ellipsis max-w-[80px]">ID: {payment.sellerId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap ">
                  <div className="text-sm text-gray-900 max-w-[80px]  overflow-hidden text-ellipsis">#{payment.orderId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {payment.orderItems.length} item(s)
                    <ul className="list-disc pl-5 mt-1">
                      {payment.orderItems.map(item => (
                        <li key={item.id} className="text-xs">
                          {item.quantity} × £{(item.unitPrice / item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">£{payment.amount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    £{payment.totalCommission.toFixed(2)} ({payment.commissionRate}%)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    £{payment.sellerEarnings.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.isAdminPaidToSeller ? (
                    <div className='flex gap-2'> 
                      <PaymentStatusBadge isPaid={true} />
                      {/* <SellerInfoDialog
                        seller={payment} /> */}
                    </div>

                  ) : (
                    <div className='flex gap-2'>
                      <PaymentConfirmationDialog
                        paymentId={payment.id}
                        onConfirm={onConfirm}
                      />
                      <SellerInfoDialog
                        seller={payment} />
                    </div>

                  )}


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutsToSellers;