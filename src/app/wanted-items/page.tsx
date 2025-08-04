
import { Header } from "@/components/header/header";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import WantedItem from "@/components/home_page/serverComponents/wantedItem";
import ProductBreadcrumb from "@/components/productInfo/product/ProductBreadcrumb";
import { getFeaturedProducts, getFooterData, getWantedItems } from "@/lib/products/homeProducts";
import type { Metadata } from 'next';
 
export async function generateMetadata(): Promise<Metadata> {
    const { editedWantedItem } = await getWantedItems({ page: 1, pageSize: 3 });

    const images = editedWantedItem
        .filter((item) => !!item.imageUrl)
        .slice(0, 3)
        .map((item) => ({
            url: item.imageUrl,
            alt: item.title,
        }));

    return {
        title: "Wanted Items - Buy & Sell Used Laundry Equipment | CleanersCompare",
        description:
            "Explore wanted listings for used dry cleaning machines, laundry presses, and more. Connect with buyers actively searching for equipment in your area.",
        keywords: [
            "wanted items",
            "buy used laundry equipment",
            "used dry cleaning machine wanted",
            "commercial laundry press wanted",
            "equipment marketplace",
            "sell to laundry businesses",
        ],
        openGraph: {
            title: "Wanted Items - Buyers Looking for Used Laundry Equipment",
            description:
                "List your equipment or browse wanted ads for used dry cleaning and laundry machines. Ideal for sellers and suppliers.",
            url: "https://cleanerscompare.com/app/wanted-items",
            siteName: "CleanersCompare",
            images,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Wanted Items - Buy & Sell Used Laundry Equipment | CleanersCompare",
            description:
                "View live wanted listings for used laundry and dry cleaning equipment. Perfect for suppliers and sellers.",
            images: images.length > 0 ? [images[0].url] : [],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}




const wantedItems = [
    {
        title: "Used Dry Cleaning Machine",
        description: "Looking for a second-hand dry cleaning machine in working condition.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUAF5CppiP8c_efPIRM1dTpB23grbjz-x0kg&s",
        datePosted: "April 25, 2025",
        location: "Chicago, USA",
        contactInfo: "Email: buyer@example.com | Phone: (123) 555-7890",
    },
    {
        title: "Commercial Laundry Press",
        description: "Seeking a used commercial laundry press for high-volume use.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI-iQt3eMrNgMIGVvesFC9rQWd_EwDDm-wQ&s",
        datePosted: "April 24, 2025",
        location: "Dallas, USA",
        contactInfo: "Email: laundrypro@example.com",
    },
];


export default async function Page() {
    const [
        featuredProducts,
        footerData,
        editedWantedItem,
    ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10 }),
        getFooterData(),
        getWantedItems({ page: 1, pageSize: 100 })
    ]);

    return (
        <div>
            <Header />
            <main className="max-w-7xl m-auto space-y-8 mt-5">
                <div className="flex justify-center mt-4">
                    <ProductBreadcrumb
                        category={'wanted-items'}
                        subcategory={undefined}
                        base=""
                        name={undefined} />
                </div>
                <h1 className="text-4xl font-bold ml-5">All Wanted Items</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-3 mx-3">

                    {editedWantedItem.editedWantedItem.map((item, index) => (
                        <div key={index} >
                            <WantedItem className="!min-w-[90vw] !mx-auto md:!min-w-[40vw] lg:!min-w-[300px]" {...item} />
                        </div>
                    ))}
                </div>

            </main>
            <FeaturedAndProducts 
                initFeaturedProducts={featuredProducts.editProducts}
            />
            <Footer 
                footerData={footerData}
            />
        </div>
    )
}