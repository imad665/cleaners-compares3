import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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

        // Group by productId and the other party
        const groupedInquiriesMap = new Map();
        allInquiries.forEach(inquiry => {
            const otherPartyId = role === 'SELLER' ? inquiry.buyerId : inquiry.sellerId;
            const key = `${inquiry.productId}-${otherPartyId}`;
            if (!groupedInquiriesMap.has(key)) {
                groupedInquiriesMap.set(key, inquiry);
            }
        });

        const inquiries = Array.from(groupedInquiriesMap.values()).filter((c) => c.response || (!c.response && role === 'SELLER') || (!c.response && role === 'BUYER'));
        
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error("Error fetching inquiries list:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
