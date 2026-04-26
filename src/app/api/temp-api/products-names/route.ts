import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {

    const products = await prisma.product.findMany({
        select: {
            title: true
        }
    })

    return NextResponse.json(products.map(c => c.title), { status: 200 })
}