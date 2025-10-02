import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
    try{
        const session = await getServerSession(authOptions);
        let user:any = session?.user;
        if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});

        user = await prisma.user.findUnique({
            where:{id:user.id},
            select:{
                email:true,
                password:true
            }
        })
        return NextResponse.json({user},{status:200});

    }catch(err){

        return NextResponse.json({error:'somthing went wrong!'},{status:500})
    }
}