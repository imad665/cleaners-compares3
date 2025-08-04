'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';

export function ReviewForm({ productId,onReview }: { productId: string,onReview:()=>void }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ stars, comment, productId }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Failed to submit review');
      setSuccess(true);
      setComment('');
      setStars(5);
      onReview();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 rounded-md shadow-md border bg-white">
      <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Rating</label>
          <div className="flex space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStars(s)}
                className={`text-2xl ${
                  stars >= s ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
        {success && (
          <p className="text-green-600 text-sm mt-2">Review submitted!</p>
        )}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
export default function ReviewDialog({ productId,open,setOpen,onReview }:
   { 
    productId: string,
    open:boolean,
    setOpen:(v:boolean)=>void 
    onReview:()=>void 
  }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts to help others.
          </DialogDescription>
        </DialogHeader>
        <ReviewForm onReview={onReview} productId={productId} />
      </DialogContent>
    </Dialog>
  );
}
