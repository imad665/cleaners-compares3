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
import { getAllHomeProducts, getRecentOrdersCount } from "@/lib/products/homeProducts";
import { FormProvider } from "react-hook-form";
import AddressSearchUK from "@/components/address-search";
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNow } from "date-fns";
import { unstable_cache } from "next/cache";

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
  const {
    success,
    featuredProducts,
    dealsProducts,
    //partsAndAccessoirsProducts,
    allCategories,
    wantedItems,
    businessesForSale,
    youtubeVideos,
    footerData,
    //recentOrderCount,
  } = await getAllHomeProducts();

  const recentOrderCount = await getRecentOrdersCount();
  const messages = await getNotifications();
  const session = await getServerSession(authOptions);
  const services = await getServices(['DRY_CLEANING', 'FINISHING', 'LAUNDRY'])
  const user = session?.user;

  const { buyerInquiries, sellerInquiries } = await getGeneralInquiries(user);

  return (
    <div>
      <Header recentOrderCount={recentOrderCount} notificationData={[
        ...(messages || []),
        ...sellerInquiries,
        ...buyerInquiries
      ]} />

      <main className="">
        <MainImage />
        {/* <ShopByCategory /> */}
        <ProductTabs allCategories={allCategories} />
        <WantedItemAndBusiness
          wantedItems={wantedItems.editedWantedItem}
          businessesForSale={businessesForSale.editedBusinessForSale}
        />
        <FeaturedAndProducts
          initFeaturedProducts={featuredProducts.editProducts} />
        <FeaturedEnginners services={services} />
        <LimitedTimeDeals initDealsProducts={dealsProducts.editProducts} />
        {/* <PartAndAccessoir initPartsAndAccessoirsProducts={partsAndAccessoirsProducts.editProducts} /> */}
        <EducationalAndVideos initYoutubVideos={youtubeVideos.videos} />
        <BrandingSlider />
      </main>
      {/* <AddressSearchUK/> */}
      <Footer footerData={footerData} />
    </div>

  );
}
