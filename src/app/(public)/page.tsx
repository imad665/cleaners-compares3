/* import SellerFormDialog from "@/components/forms/sellerForm"; */
/* import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css" */
export const revalidate = 18000; // revalidate at most every 5 hours

import { Header } from "@/components/header/header";
import { EducationalAndVideos } from "@/components/home_page/educationalAndHotVideo";
import { FeaturedAndProducts, FeaturedEnginners } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import { LimitedTimeDeals } from "@/components/home_page/limitedTimeDeals";
import { MainImage } from "@/components/home_page/mainImage2";
import { PartAndAccessoir } from "@/components/home_page/partAndAccessoir";
import ProductTabs from "@/components/home_page/productTabs";

import WantedItemAndBusiness from "@/components/home_page/wantedItemsAndBusiness";
import { BrandingSlider } from "@/components/home_page/brandingSlider";
import { HomeProductsProvider } from "@/providers/homeProductsProvider";
import { getCategoriesHome, getGeneralInquiries, getServices } from "@/lib/products/homeCategories";
import { Button } from "@/components/ui/button";
import { getAllHomeProducts, getJustAddedProducts, getRecentOrdersCount } from "@/lib/products/homeProducts";
import { FormProvider } from "react-hook-form";
import AddressSearchUK from "@/components/address-search";
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNow } from "date-fns";
import { revalidateTag, unstable_cache } from "next/cache";
import { cn } from "@/lib/utils";
import { BuyerSellerBlock } from "@/components/home_page/BuyerSellerBlock";
import { CategoryGrid } from "@/components/home_page/CategoryGrid";
import { FeaturedEngineers } from "@/components/home_page/FeaturedEngineers";
import { JustAddedProducts } from "@/components/home_page/just_added_product";

const getHomePageCachedData = unstable_cache(
  async () => {
    return getAllHomeProducts()
  },
  ["products"],
  {
    revalidate: 60 * 60 * 24 * 3, // 3 days
  }
);


export default async function Home() {
  //await prisma.sellerProfile.deleteMany();
  // await prisma.user.deleteMany();
  /*  const {
     //success,
     //featuredProducts,
     dealsProducts: deal,
     //partsAndAccessoirsProducts,
     //allCategories,
     //wantedItems,
     //businessesForSale,
     //youtubeVideos,
     //footerData,
     //recentOrderCount,
   } = await getAllHomeProducts(); */



  /* const recentOrderCount = await getRecentOrdersCount();
  const messages = await getNotifications(); */
  /* const session = await getServerSession(authOptions);
  const user = session?.user; */
  //const services = await getServices(['DRY_CLEANING', 'FINISHING', 'LAUNDRY'])

  const { success, dealsProducts,
        /* allCategories, */ wantedItems,
    featuredProducts,
    businessesForSale, youtubeVideos,
    services, } = await (await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/need-cache/homePage`,
      {
        next: {
          revalidate: 3600,
          tags: ['home-cache']
        }
      })).json()
  const { success: success2, justAddedProducts } = await (await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/need-cache/homePage?justAdded=true`,
    {
      next: {
        revalidate: 60 * 3,
        tags: ['home-cache-3min']
      }
    })).json()
  /* const justAddedProducts = await getJustAddedProducts({ page: 1, pageSize: 10 }) */

  //console.log(justAddedProducts, 'slllllllllllllllllllllllllllllllkkk');



  /* const { buyerInquiries, sellerInquiries } = await getGeneralInquiries(user); */

  return (
    <div>
      {/* <Header recentOrderCount={recentOrderCount} notificationData={[
        ...(messages || []),
        ...sellerInquiries,
        ...buyerInquiries
      ]} /> */}

      <main className="">
        <MainImage />
        <FeaturedAndProducts
          initFeaturedProducts={featuredProducts.editProducts} />
        {justAddedProducts.editProducts.length > 0 && < JustAddedProducts
          initialProducts={justAddedProducts.editProducts} />}

        <BuyerSellerBlock />
        <CategoryGrid />
        {services.length > 0 && <FeaturedEnginners services={services} />}
        <LimitedTimeDeals
          initDealsProducts={dealsProducts.editProducts}
          className={services.length > 0 ? 'bg-blue-50' : 'bg-white'} />

        <WantedItemAndBusiness
          wantedItems={wantedItems.editedWantedItem}
          businessesForSale={businessesForSale.editedBusinessForSale}
        />
        {/* <FeaturedEngineers /> */}
        {/* <ShopByCategory /> */}

        {/* <ProductTabs allCategories={allCategories} />
 */}

        {/* <LimitedTimeDeals initDealsProducts={dealsProducts.editProducts} className={services.length > 0 ? 'bg-blue-50' : 'bg-white'} /> */}
        {/* <PartAndAccessoir initPartsAndAccessoirsProducts={partsAndAccessoirsProducts.editProducts} /> */}
        <EducationalAndVideos initYoutubVideos={youtubeVideos.videos} className={services.length > 0 ? 'bg-white' : 'bg-blue-50'} />
        <BrandingSlider />
      </main>
      {/* <AddressSearchUK/> */}
      {/* <Footer footerData={footerData} /> */}
    </div>

  );
}
