import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET() {
    try{
        const trash = await prisma.category.findMany({
            where:{
                status:'DELETING',
                deletedAt:{
                    gt:new Date(),
                },
            },
            orderBy:{
                deletedAt:'asc',
            }
        });

        return NextResponse.json(trash);
    }catch(error){
        console.error('Error fetching trash categories:', error);
        return NextResponse.json({success:false,error:'Failed to fetch trash'},{status:500})
    }
}