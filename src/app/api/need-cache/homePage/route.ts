import { getServices } from "@/lib/products/homeCategories";
import { getAllHomeProducts } from "@/lib/products/homeProducts";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
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