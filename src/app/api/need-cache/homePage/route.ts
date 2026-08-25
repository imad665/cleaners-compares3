import { getServices } from "@/lib/products/homeCategories";
import { getAllHomeProducts, getJustAddedProducts } from "@/lib/products/homeProducts";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);

    const justAdded = searchParams.get('justAdded')

    if (justAdded) {
        const justAddedProducts = await getJustAddedProducts({ page: 1, pageSize: 10 });
        return NextResponse.json({ justAddedProducts, success: true })
    }


    const {
        success,
        featuredProducts,
        dealsProducts,
        //partsAndAccessoirsProducts,
        /*  allCategories, */
        wantedItems,
        businessesForSale,
        youtubeVideos,
        /* footerData, */
        //recentOrderCount,
    } = await getAllHomeProducts();

    const services = await getServices(['DRY_CLEANING', 'FINISHING', 'LAUNDRY'])
    //revalidateTag('home-cache')

    return NextResponse.json({
        success, dealsProducts,
        /* allCategories, */ wantedItems,
        businessesForSale, youtubeVideos,
        featuredProducts,
        services,
    })
}