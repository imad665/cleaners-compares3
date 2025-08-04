import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            redirect('/login');
        }

        let messages;

        if (session.user.role === 'BUYER') {
            const buyerId = session.user.id;
            messages = await prisma.inquiry.findMany({
                where: { buyerId },
                include:{
                    seller:true,
                    buyer:true
                },
                orderBy: { createdAt: 'desc' }, // latest first
            });
        } else if (session.user.role === 'SELLER') {
            const sellerId = session.user.id;
            messages = await prisma.inquiry.findMany({
                where: { sellerId },
                include:{
                    seller:true,
                    buyer:true
                },
                orderBy: { createdAt: 'desc' }, // latest first
            });
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formattedMessages = messages.map((msg) => ({
            id: msg.id,
            from: session.user.role === 'BUYER' ? msg.seller.name : msg.buyer.name,
            email: session.user.role === 'BUYER' ? msg.seller.email : msg.buyer.email,
            subject: msg.subject,
            message: msg.message, // You want the original inquiry message
            date: msg.createdAt.toISOString().split('T')[0], // 'YYYY-MM-DD'
            time: msg.createdAt.toTimeString().slice(0, 5),   // 'HH:MM'
            read: session.user.role === 'BUYER' ? msg.buyerRead : msg.sellerRead,
            type: 'inquiry',
            starred: session.user.role === 'BUYER' ? msg.buyerStarred : msg.sellerStarred,
        }));

        return NextResponse.json({ messages }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}



