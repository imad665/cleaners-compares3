// components/checkout/CardForm.tsx
'use client';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
 
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function CardForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      toast.error(`Payment failed: ${error.message}`);
    } else if (paymentIntent?.status === "requires_capture") {
      toast.success("Payment authorized! Waiting for seller to ship product.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded-md bg-white shadow">
      <CardElement className="border p-2 rounded" />
      <Button type="submit" disabled={loading} className="w-full">
        Pay Now
        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>
    </form>
  );
}
