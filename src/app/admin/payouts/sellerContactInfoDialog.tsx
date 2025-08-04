'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react";

export function SellerInfoDialog({ seller }: { seller: {
  sellerName: string;
  sellerEmail: string;
  sellerAddress: string;
  sellerPostCode: string;
  sellerPhoneNumber: string;
  sellerBisunessName?: string;
} }) {
    const [open,setOPen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOPen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">Show Seller Info</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seller Contact Information</DialogTitle>
          <DialogDescription>
            Contact the seller to ask how they would like to receive their payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-gray-700">
          <div><span className="font-semibold">Name:</span> {seller.sellerName}</div>
          <div><span className="font-semibold">Email:</span> {seller.sellerEmail}</div>
          <div><span className="font-semibold">Phone:</span> {seller.sellerPhoneNumber}</div>
          <div><span className="font-semibold">Business Name:</span> {seller.sellerBisunessName || '—'}</div>
          <div><span className="font-semibold">Address:</span> {seller.sellerAddress}</div>
          <div><span className="font-semibold">Postal Code:</span> {seller.sellerPostCode}</div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={()=>setOPen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
