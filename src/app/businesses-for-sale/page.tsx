import { Header } from "@/components/header/header";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import BusinessForSale from "@/components/home_page/serverComponents/businessForSale";
import WantedItem from "@/components/home_page/serverComponents/wantedItem";
import ProductBreadcrumb from "@/components/productInfo/product/ProductBreadcrumb";
import ServiceCard from "@/components/serviceEnginner";
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
import { getBusinesessForSale, getFeaturedProducts, getFooterData, getRecentOrdersCount } from "@/lib/products/homeProducts";

import type { Metadata } from 'next';
 
export async function generateMetadata(): Promise<Metadata> {
    const { editedBusinessForSale } = await getBusinesessForSale({ page: 1, pageSize: 3 });

    const images = editedBusinessForSale
        .filter((b) => !!b.imageUrl)
        .slice(0, 3) // Take up to 3 images
        .map((b) => ({
            url: b.imageUrl,
            alt: b.title,
        }));

    return {
        title: "Businesses for Sale - Buy or Invest in Laundry & Cleaning Services",
        description: "Discover businesses for sale in laundry, dry cleaning, and service industries. View vetted listings with full details, images, and contact info.",
        keywords: [
            "businesses for sale",
            "laundry business for sale",
            "dry cleaning business for sale",
            "buy service business",
            "business opportunities",
            "invest in cleaning business",
        ],
        openGraph: {
            title: "Businesses for Sale - Laundry & Dry Cleaning",
            description: "Explore available laundry and dry cleaning businesses for sale with pricing, images, and contact information.",
            url: "https://cleanerscompare.com/app/businesses-for-sale",
            siteName: "CleanersCompare",
            images,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Businesses for Sale - Laundry & Dry Cleaning",
            description: "Browse our listings of service businesses for sale. Perfect for investors and entrepreneurs.",
            images: images.length > 0 ? [images[0].url] : [],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}




const businessesForSale = [
    {
        title: "Dry Cleaning Business - Downtown",
        category: "Dry Cleaning",
        location: "Atlanta, USA",
        value: "$120,000 USD",
        reason: "Owner Retiring",
        description: "Fully operational dry cleaning shop with loyal customers and quality equipment.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtavlbfG7b7IW6iEfZoQypjPgYCXn2Fcg0ng&s",
        contactInfo: "Email: sales@example.com | Phone: (123) 789-4560",
    },
    {
        title: "Laundry Service Company",
        category: "Laundry Services",
        location: "Miami, USA",
        value: "$90,000 USD",
        reason: "Relocating Abroad",
        description: "Growing laundry pickup and delivery business with high potential for expansion.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQql-CJxpHtkK3DNiW5Oa2qYoLHD0rRliuBIw&s",
        contactInfo: "Email: laundrysales@example.com",
    },
];



export default async function Page() {
    const [
        featuredProducts,
        footerData,
        editedBusinessForSale,
    ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10 }),
        getFooterData(),
        getBusinesessForSale({ page: 1, pageSize: 100 })
    ]);
    //console.log(editedBusinessForSale,'ooooooooooooooooooooooooppppppppppppppppp');
    const recentOrderCount = await getRecentOrdersCount();
    const messages = await getNotifications();
    return (
        <div>
            <Header notificationData={messages} recentOrderCount={recentOrderCount}/>
            <main className="max-w-7xl m-auto space-y-8 mt-5">
                <div className="flex justify-center mt-4">
                    <ProductBreadcrumb
                        category={'businesses-for-sale'}
                        subcategory={undefined}
                        base=""
                        name={undefined} />
                </div>
                <h1 className="text-4xl font-bold ml-3">Businesses for Sale</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3">

                    {editedBusinessForSale.editedBusinessForSale.map((business, index) => (
                        <div key={index} className="mx-3">
                            <BusinessForSale 
                                className="min-w-[90vw] m-auto md:!min-w-[40vw] lg:!min-w-[300px] lg:!max-w-[500px]"
                                {...business} />
                        </div>
                    ))}
                     
                </div>

            </main>
            <FeaturedAndProducts
                initFeaturedProducts={featuredProducts.editProducts}
            />
            <Footer footerData={footerData} />
        </div>
    )
}