import { getCategoriesHome } from "@/lib/products/homeCategories";
import { getAllHomeProducts, getBusinesessForSale, getDealsProducts, getFeaturedProducts, getFooterData, getPartsAndAccessoirsProducts, getWantedItems, getYoutubeVideos } from "@/lib/products/homeProducts";
import { updateExpiredAndDealsProducts } from "@/lib/updateExpiredProducts";
import { NextResponse } from "next/server";
 
export async function GET() {
  await updateExpiredAndDealsProducts();
     try {
     /* const [
        featuredProducts, 
        dealsProducts,
        partsAndAccessoirsProducts,
        allCategories,
        wantedItems,
        businessesForSale,
        youtubeVideos,
        footerData,
      ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10 }),
        getDealsProducts({ page: 1, pageSize: 10 }),
        getPartsAndAccessoirsProducts({ page: 1, pageSize: 10 }),
        getCategoriesHome(),
        getWantedItems({ page: 1, pageSize: 10 }),
        getBusinesessForSale({ page: 1, pageSize: 10 }),
        getYoutubeVideos({page:1,pageSize:10}),
        getFooterData(),
      ]); */
      //console.log(featuredProducts,'+++++++++++++++++');
        
      return NextResponse.json(await getAllHomeProducts());
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
  }