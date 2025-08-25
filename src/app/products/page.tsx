import { PaginatedProducts } from "@/components/allProducts/allProducts";
import { Header } from "@/components/header/header";
import ProductBreadcrumb from "@/components/productInfo/product/ProductBreadcrumb";
import { getDealsProducts, getFeaturedProducts, getFooterData, getPartsAndAccessoirsProducts, getRecentOrdersCount } from "@/lib/products/homeProducts";
import { NoProductsFound } from "./[category]/[subcategory]/[condition]/page";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import type { Metadata } from 'next';
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
export const revalidate = 18000; // ISR every 5 hours
 
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { searchParams }:
    { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const type = (await searchParams).type;

  let title = "All Products | Cleaners Compare";
  let description = "Explore all available products in the laundry and dry cleaning industry.";

  if (type === "featured-products") {
    title = "Featured Products | Cleaners Compare";
    description = "Browse our hand-picked featured products for professional laundry and dry cleaning operations.";
  } else if (type === "deals") {
    title = "Discounted Products | Cleaners Compare";
    description = "Shop the latest deals and discounts on high-quality laundry and dry cleaning equipment.";
  } else if (type === "parts-and-accessoir") {
    title = "Parts & Accessories | Cleaners Compare";
    description = "Find essential parts and accessories for laundry and dry cleaning machines.";
  }

  return {
    title,
    description,
    keywords: [
      "laundry machines",
      "dry cleaning products",
      "commercial laundry deals",
      "laundry parts",
      "cleaning accessories",
      "Cleaners Compare",
      type || "products"
    ],
    openGraph: {
      title,
      description,
      url: `https://cleanercompare.com/products?type=${type}`,
      siteName: "CleanersCompare",
      images: [
        {
          url: "/uploads/logo.png", // Replace with actual OG image
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/uploads/logo.png"], // Replace with actual image
    },
  };
}


export default async function Page({ searchParams }) {
  const type: 'deals' | 'featured-products' | 'parts-and-accessoir'
    = searchParams.type;

  let editProducts;
  let total;
  let currentPage;
  let totalPage;
  const pageSize = 50;
  if (type === 'featured-products') {
    const result = await getFeaturedProducts({ page: 1, pageSize });
    editProducts = result.editProducts;
    total = result.total;
    currentPage = result.currentPage;
    totalPage = result.totalPage;
  } else if (type === 'deals') {
    const result = await getDealsProducts({ page: 1, pageSize });
    editProducts = result.editProducts;
    total = result.total;
    currentPage = result.currentPage;
    totalPage = result.totalPage;
  } else if (type === 'parts-and-accessoir') {
    const result = await getPartsAndAccessoirsProducts({ page: 1, pageSize });
    editProducts = result.editProducts;
    total = result.total;
    currentPage = result.currentPage;
    totalPage = result.totalPage;

    console.log(total,currentPage,totalPage,';;;;;;;;;;;;;;;lbbbbbbb');
    
  }
  const [
    featuredProducts,
    footerData,
  ] = await Promise.all([
    getFeaturedProducts({ page: 1, pageSize: 10 }),
    getFooterData(),
  ]);
  const recentOrderCount = await getRecentOrdersCount();
  const messages = await getNotifications();
  return (
    <div>
      <Header recentOrderCount={recentOrderCount} notificationData={messages}/>
      {!editProducts ?
        <div className="flex flex-col items-center">
          <ProductBreadcrumb
            category={type}
            subcategory={undefined}
            name={undefined} />
          <NoProductsFound subcategory={'Featured'} />
        </div>
        :
        <div className="container m-auto max-w-7xl">
          <ProductBreadcrumb
            category={type}
            subcategory={undefined}
            name={undefined} />
          <PaginatedProducts
            initProducts={editProducts}
            subCategory={{ id: type }}
            totalPages={totalPage}
            condition={undefined}
            page={currentPage}
            title={
              type === 'deals'
                ? 'All Discounted Products'
                : type === 'parts-and-accessoir'
                  ? 'All Parts and Accessories'
                  : 'All Featured Products'
            }
            pageSize={pageSize} />
        </div>
      }
      {type != 'featured-products'
       && <FeaturedAndProducts
        initFeaturedProducts={featuredProducts.editProducts}/>}
      <Footer footerData={footerData}/>


    </div>)
}