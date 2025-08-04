// components/ConfirmDeliveryButton.tsx
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { Loader2 } from 'lucide-react';
import { captureSellerPayment } from '@/actions/checkoutAction';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export function ConfirmDeliveryButton({
  orderId,
  sellerId,
  onSuccess,
}: {
  orderId: string;
  sellerId: string;
  onSuccess:()=>void;
}) {

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConfirmDelivery = async () => {
    setLoading(true);
    try {
      const result = await captureSellerPayment(orderId, sellerId);

      if (result.success) {
        toast.success('Payment captured successfully!');
        if(onSuccess) onSuccess()
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to capture payment');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </span>
          ) : (
            'Confirm Delivery'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm Receipt</DialogTitle>
        <DialogDescription>
          Are you sure you have really received your order? This action cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={handleConfirmDelivery}
            disabled={loading}
            variant="default"
            className='bg-orange-600'
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              'Yes, I have received it'
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}