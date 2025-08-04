import { prisma } from "@/lib/prisma";
import { fetchProducts } from "@/lib/products/fetchProducts";
import { getDealsProducts, getFeaturedProducts, getPartsAndAccessoirsProducts } from "@/lib/products/homeProducts";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const id = searchParams.get('id')?.toString() as string;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const condition = searchParams.get('condition') as 'new' | 'used';

        if (id === 'featured-products') {
            const data = await getFeaturedProducts({ page, pageSize });
            return NextResponse.json({ products: data.editProducts }, { status: 200 });
        } else if (id === 'deals') {
            const data = await getDealsProducts({ page, pageSize });
            return NextResponse.json({ products: data.editProducts }, { status: 200 });

        } else if (id === 'parts-and-accessoir') {
            const data = await getPartsAndAccessoirsProducts({ page, pageSize });
            return NextResponse.json({ products: data.editProducts }, { status: 200 });
        }
        else {
            const data = await fetchProducts(null, null, condition, page, pageSize, id);
            return NextResponse.json({ products: data.mappedProducts }, { status: 200 });
        }


    } catch (error) {
        return NextResponse.json({ error: 'failed to fetch products' }, { status: 500 })
    }
}