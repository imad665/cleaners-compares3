import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessageSidebar from "./_components/MessageSidebar";
import MobileSidebarSheet from "./_components/MobileSidebarSheet";

export default async function MessagesPage() {
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

    const groupedInquiriesMap = new Map();
    allInquiries.forEach(inquiry => {
        const otherPartyId = role === 'SELLER' ? inquiry.buyerId : inquiry.sellerId;
        const key = `${inquiry.productId}-${otherPartyId}`;
        if (!groupedInquiriesMap.has(key)) {
            groupedInquiriesMap.set(key, inquiry);
        }
    });

    const inquiries = Array.from(groupedInquiriesMap.values());

    return (
        <div className="h-full relative overflow-hidden flex flex-col">
            <div className="md:hidden flex items-center border-b p-2 bg-background">
                <MobileSidebarSheet inquiries={inquiries as any} userId={userId} role={role as any} />
                <span className="font-semibold ml-2">Select Conversation</span>
            </div>
            <div className="md:hidden flex-1 overflow-y-auto">
                <MessageSidebar 
                    initialInquiries={inquiries as any} 
                    userId={userId} 
                    role={role as any} 
                />
            </div>
            <div className="hidden md:flex items-center justify-center h-full text-muted-foreground">
                Select a conversation
            </div>
        </div>
    );
}