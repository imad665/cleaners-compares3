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
import AddressSearchUK from "@/components/address-search";
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNow } from "date-fns";


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
  const user = session?.user;
  const role =  user?.role;
  let sellerInquiries: any = []
  let buyerInquiries: any = [];
  if (role=== 'SELLER') {
    sellerInquiries = (await prisma.inquiry.findMany({
      where: {
        sellerId: user.id,
        sellerRead: false
      },
      select: {
        buyer: {
          select: {
            name: true,
            id: true,
          }
        },
        id:true,
        message: true,
        response: true,
        productId: true,
        createdAt: true,
      }
    })).map((c) => ({
      id: uuidv4(),
      type: 'message',
      title: 'New Product Inquiry',
      preview: `${c.message.substring(0, 20)}...`,
      time: formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }),
      link: `/messages/${c.id}`
    }))
  } else if (role==='BUYER') {
    buyerInquiries = (await prisma.inquiry.findMany({
      where: {
        buyerId: user.id,
        buyerRead: false,

      },
      select: {
        buyer: {
          select: {
            name: true,
            id: true,
          }
        },
        id:true,
        message: true,
        response: true,
        productId: true,
        createdAt: true,
      }
    })).filter((c)=>c.response!=undefined).map((c) => ({
      id: uuidv4(),
      type: 'message',
      title: 'New Message',
      preview: `${c.response?.substring(0, 20)}...`,
      time: formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }),
      link: `/messages/${c.id}`
    }))
  }
  //console.log(sellerInquiries, buyerInquiries, 'ddddddddddddddddddddduududididdidijfjfjf');
  //console.log(messages,'vvvvvvvvvvvvvv');

  //console.log(featuredProducts, 'mmmmmmmmmmmmmm');

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
