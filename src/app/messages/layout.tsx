// app/messages/layout.tsx

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Header } from "@/components/header/header";

export default async function MessagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const userId = session.user.id;
    const role = session.user.role;

    const inquiries = (await prisma.inquiry.findMany({
        where:
            role === "SELLER"
                ? { sellerId: userId, sellerDeleted: false }
                : { buyerId: userId, buyerDeleted: false },
        include: {
            product: { select: { id: true, title: true, imagesUrl: true } },
            buyer: { select: { id: true, name: true } },
            seller: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: "desc" },
    })).filter((c) => c.response || !c.response && role === 'SELLER');

    return (
        <div>
            <Header recentOrderCount={null} notificationData={[

            ]} />
            <div className="flex h-[calc(100vh-130px)] border rounded-xl overflow-hidden">

                {/* LEFT SIDEBAR */}
                <div className="w-80 border-r bg-muted/30 overflow-y-auto">
                    {inquiries.map((inquiry) => (
                        <Link
                            key={inquiry.id}
                            href={`/messages/${inquiry.id}`}
                            className="block p-4 border-b hover:bg-muted transition"
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-sm truncate">
                                    {inquiry.product?.title ?? "Product"}
                                </p>

                                {/* 🔴 Unread Dot */}
                                <div className="flex">
                                    {inquiry.product?.imagesUrl[0] && <img src={inquiry.product?.imagesUrl[0]} className="w-12 h-auto"/>}
                                    {(!inquiry.sellerRead || !inquiry.buyerRead) && (
                                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                </div>

                            </div>

                            <p className="text-xs text-muted-foreground">
                                {role === 'SELLER' ? inquiry.buyer.name : inquiry.seller.name}
                            </p>

                            <p className="text-xs truncate mt-1 text-muted-foreground">
                                {role === 'SELLER' ? inquiry.message : inquiry.response}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex-1 bg-background">
                    {children}
                </div>
            </div>
        </div>

    );
}