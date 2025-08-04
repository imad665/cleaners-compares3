'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export function SellerInfoDialog({
    seller,
}: {
    seller: {
        businessName: string;
        phoneNumber: string;
        address: string;
        postCode: string;
        email: string;
        password: string;
        productCount: number;
        wantedCount: number;
        businessForSaleCount: number;
    };
}) {
    ///console.log(seller, 'yyyyyyyyyyyyyyyyyyyy');
    const [loading, setLoadin] = useState(false);
    async function handleConnect() {
        setLoadin(true);
        const res = await fetch('/api/admin/impersonate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: seller.email }),
        });

        if (res.ok) {
            // Redirect to seller dashboard
            window.location.href = seller.role==='buyer' ?'/':'/admin';
            
        } else {
            const error = await res.json();
            alert('Failed to connect: ' + error.error);
        }

        setLoadin(false);
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button

                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors2">
                    <Eye className="w-4 h-4" />

                </button>
            </DialogTrigger>

            <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Seller Information</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span>Products:</span>
                        <span className="font-semibold">{seller.productCount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Wanted Items:</span>
                        <span className="font-semibold">{seller.wantedCount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Businesses for Sale:</span>
                        <span className="font-semibold">{seller.businessForSaleCount}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        <span>Business Name:</span>
                        <span className="font-semibold">{seller.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-semibold">{seller.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Country:</span>
                        <span className="font-semibold">{seller.address}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Post Code:</span>
                        <span className="font-semibold">{seller.postCode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-semibold">{seller.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Password:</span>
                        <span className="font-semibold">••••••••••••••••</span>
                    </div>
                    <Button
                        disabled={loading}
                        className=''
                        onClick={handleConnect}>
                        {loading?"...":"Connect"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
