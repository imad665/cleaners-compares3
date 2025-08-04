/* import SellerFormDialog from "@/components/forms/sellerForm"; */
/* import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css" */
export const revalidate = 18000; // revalidate at most every 5 hours

import { Header } from "@/components/header/header";
import { EducationalAndVideos } from "@/components/home_page/educationalAndHotVideo";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import { LimitedTimeDeals } from "@/components/home_page/limitedTimeDeals";
import { MainImage } from "@/components/home_page/mainImage2";
import { PartAndAccessoir } from "@/components/home_page/partAndAccessoir";
import ProductTabs from "@/components/home_page/productTabs";

import WantedItemAndBusiness from "@/components/home_page/wantedItemsAndBusiness";
import { BrandingSlider } from "@/components/home_page/brandingSlider";
import { HomeProductsProvider } from "@/providers/homeProductsProvider";
import { getCategoriesHome } from "@/lib/products/homeCategories";
import { Button } from "@/components/ui/button";
import { getAllHomeProducts, getRecentOrdersCount } from "@/lib/products/homeProducts";
import { FormProvider } from "react-hook-form";


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
  //console.log(dealsProducts, 'mmmmmmmmmmmmmm');
  return (
    <div>
      <Header recentOrderCount={recentOrderCount} />

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
        <LimitedTimeDeals initDealsProducts={dealsProducts.editProducts} />
        {/* <PartAndAccessoir initPartsAndAccessoirsProducts={partsAndAccessoirsProducts.editProducts} /> */}
        <EducationalAndVideos initYoutubVideos={youtubeVideos.videos} />
        <BrandingSlider />
      </main>

      <Footer footerData={footerData} />
    </div>

  );
}
