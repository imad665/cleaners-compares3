import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest) {
    try{
        const body = await req.json();
        const {id} = body;

        const restored = await prisma.category.update({
            where:{id},
            data:{
                status:'ACTIVE',
                deletedAt:null
            },
        });

        return NextResponse.json({success:true,restored,message: 'Category restored successfully' });
    }catch(error){
        console.error('RESTORE error:', error);
    return NextResponse.json({success:false, error: 'Failed to restore category' }, { status: 500 });
        
    }
}