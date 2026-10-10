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

        const { searchParams } = new URL(req.url);
        const buyerId = searchParams.get("buyerId");
        const productId = searchParams.get("productId");
        const sellerId = searchParams.get("sellerId");

        if (!buyerId) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const queryWhere: any = {
            buyerId: buyerId,
            productId: (productId === "null" || !productId) ? null : productId,
        };

        if (sellerId && sellerId !== "null") {
            queryWhere.sellerId = sellerId;
        }

        const conversation = await prisma.inquiry.findMany({
            where: queryWhere,
            include: {
                buyer: { select: { image: true } },
                seller: { select: { image: true } },
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
