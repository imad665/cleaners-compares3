import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/header/header";
import MessageSidebar from "./_components/MessageSidebar";

export default async function MessagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const userId = session.user.id;
    const role = session.user.role;

    const allInquiries = await prisma.inquiry.findMany({
        where:
            role === "SELLER"
                ? { sellerId: userId, sellerDeleted: false }
                : { buyerId: userId, buyerDeleted: false },
        include: {
            product: { select: { id: true, title: true, imagesUrl: true } },
            buyer: { select: { id: true, name: true, image: true } },
            seller: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: "desc" },
    });

    // Group by productId and the other party (buyer for seller, seller for buyer)
    const groupedInquiriesMap = new Map();
    allInquiries.forEach(inquiry => {
        const otherPartyId = role === 'SELLER' ? inquiry.buyerId : inquiry.sellerId;
        const key = `${inquiry.productId}-${otherPartyId}`;
        if (!groupedInquiriesMap.has(key)) {
            groupedInquiriesMap.set(key, inquiry);
        }
    });

    const inquiries = Array.from(groupedInquiriesMap.values()).filter((c) => c.response || (!c.response && role === 'SELLER') || (!c.response && role === 'BUYER'));

    return (
        <div>
            <Header recentOrderCount={null} notificationData={[]} />
            <div className="flex h-[calc(100vh-130px)] border rounded-xl overflow-hidden">
                {/* LEFT SIDEBAR */}
                <div className="w-80 border-r bg-muted/30 overflow-y-auto">
                    <MessageSidebar 
                        initialInquiries={inquiries as any} 
                        userId={userId} 
                        role={role as any} 
                    />
                </div>

                {/* RIGHT SIDE */}
                <div className="flex-1 bg-background flex flex-col min-h-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
