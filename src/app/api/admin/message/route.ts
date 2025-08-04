import { authOptions } from "@/lib/auth";
import { sendContactReply } from "@/lib/payement/sendMessage";
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
        const messages = await prisma.inquiry.findMany({
            where: {
                sellerId: session.user.id,
                sellerDeleted:false,
            },
            include: {
                seller: true,
                buyer: true
            },

        })
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
            response: msg.response,
            starred: session.user.role === 'BUYER' ? msg.buyerStarred : msg.sellerStarred,
        }));

        return NextResponse.json({ messages: formattedMessages }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {


    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user) {
            redirect('/auth/signin')
        }
        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
            select: {
                id: true,
            }
        })
        const { message, subject } = await req.json();
        //console.log(message,subject,';;;;;;;;;;;;;;;;');

        const inquiry = await prisma.inquiry.create({
            data: {
                message,
                buyerId: user.id,
                sellerId: admin?.id || '',
                subject
            }
        });

        return NextResponse.json({ inquiry }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: 'failed to send message' }, { status: 404 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { message } = await req.json();
        //console.log(message,'yyyyyyyyyyyyyyy');
        await sendContactReply(message.email,message.from,message.response);
        await prisma.inquiry.update({
            where: { id: message.id },
            data: {
                sellerStarred: message.starred,
                sellerRead: message.read,
                response: message.response,
            }
        })

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false }, { status: 400 });
        console.log(id,'oooooooooooo');
        
        await prisma.inquiry.update({
            where: { id },
            data: {
                sellerDeleted: true,
            }
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}
