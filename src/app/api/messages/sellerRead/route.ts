import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const sellerId = searchParams.get("sellerId");
    const orderId = searchParams.get("orderId");

    console.log(sellerId,orderId,'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
    

    if (!sellerId || ! orderId){
        return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
    }

    await prisma.message.updateMany({
        where:{
            orderId,
            receiverUserId:sellerId,
            isReceiverRead:false,
        },
        data:{
            isReceiverRead:true
        }

    })

    return NextResponse.json({success:true})

}