"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Inquiry {
    id: string;
    message: string;
    response: string | null;
    createdAt: string;
    buyerRead: boolean;
    sellerRead: boolean;
    product: {
        id: string;
        title: string;
        imagesUrl: string[];
    } | null;
    buyer: {
        id: string;
        name: string;
    };
    seller: {
        id: string;
        name: string;
    };
    buyerId: string;
    sellerId: string;
}

interface MessageSidebarProps {
    initialInquiries: Inquiry[];
    userId: string;
    role: "BUYER" | "SELLER";
}

export default function MessageSidebar({ initialInquiries, userId, role }: MessageSidebarProps) {
    const [inquiries, setInquiries] = useState(initialInquiries);
    const params = useParams();
    const currentInquiryId = params.inquiryId;

    useEffect(() => {
        setInquiries(initialInquiries);
    }, [initialInquiries]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/inquiries/list?t=${Date.now()}`, {
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setInquiries(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching inquiries list:", error);
            }
        }, 5000); // Poll every 5 seconds for sidebar

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full">
            {inquiries.map((inquiry) => (
                <Link
                    key={inquiry.id}
                    href={`/messages/${inquiry.id}`}
                    className={`block p-4 border-b hover:bg-muted transition ${
                        currentInquiryId === inquiry.id ? "bg-muted" : ""
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                                {inquiry.product?.title ?? "Product"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {role === 'SELLER' ? inquiry.buyer.name : inquiry.seller.name}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {inquiry.product?.imagesUrl[0] && (
                                <img 
                                    src={inquiry.product.imagesUrl[0]} 
                                    alt="" 
                                    className="w-10 h-10 rounded object-cover" 
                                />
                            )}
                            {((role === 'SELLER' && !inquiry.sellerRead) || (role === 'BUYER' && !inquiry.buyerRead)) && (
                                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                            )}
                        </div>
                    </div>

                    <p className="text-xs truncate mt-1 text-muted-foreground italic">
                        {role === 'SELLER' ? inquiry.message : (inquiry.response || "No response yet")}
                    </p>
                </Link>
            ))}
        </div>
    );
}
