
import { Header } from "@/components/header/header";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import ProductBreadcrumb from "@/components/productInfo/product/ProductBreadcrumb";
export const revalidate = 18000; // ISR every 5 hours
import EngineerLink from "@/components/home_page/clientComponents/engineer-link";
import { getFeaturedProducts, getFooterData, getRecentOrdersCount } from "@/lib/products/homeProducts";
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
const categories = [
    {
        name: "Laundry",
        slug: "Laundry",
        description: "Professional laundry services",
        imageUrl: "/uploads/service3/service0.jpeg", // Replace with your actual image path
    },
    {
        name: "Finishing",
        slug: 'Finishing',
        description: "Expert finishing solutions",
        imageUrl: "/uploads/service3/service.webp",
    },
    {
        name: "Dry Cleaning",
        slug: 'Dry-Cleaning',
        description: "High-quality dry cleaning",
        imageUrl: "/uploads/service3/service2.jpeg",
    },
];


import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Expert Engineers Services - Laundry, Finishing, Dry Cleaning",
    description: "Choose from our top-quality engineering service categories: Professional Laundry, Finishing Solutions, and Dry Cleaning. Reliable services tailored to your needs.",
    keywords: [
        "Laundry services",
        "Finishing solutions",
        "Dry cleaning",
        "Professional engineering services",
        "Home services",
        "Engineer categories",
        "Quality laundry and cleaning",
    ],
    openGraph: {
        title: "Expert Engineers Services",
        description: "Explore high-quality laundry, finishing, and dry cleaning services provided by expert engineers.",
        url: "https://cleanerscompare.com/app/enginners",
        siteName: "CleanersCompare",
        images: [
            {
                url: "/uploads/service3/service0.jpeg",
                alt: "Laundry Services",
            },
            {
                url: "/uploads/service3/service.webp",
                alt: "Finishing Services",
            },
            {
                url: "/uploads/service3/service2.jpeg",
                alt: "Dry Cleaning Services",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Expert Engineers Services - Laundry, Finishing, Dry Cleaning",
        description: "Explore our top-tier engineering service categories including laundry, finishing, and dry cleaning.",
        images: ["/uploads/service3/service0.jpeg"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function CategoryCards() {

    const [
        featuredProducts,
        footerData,
    ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10 }),
        getFooterData(),
    ]);
    const recentOrderCount = await getRecentOrdersCount(); 
    return (
        <div className="min-h-screen w-full  flex flex-col">
            <Header recentOrderCount={recentOrderCount}/>
            <div className=" flex flex-col m-auto">
                <div className="flex  justify-center mt-4">
                    <ProductBreadcrumb
                        category={'enginners'}
                        subcategory={undefined}
                        name={undefined} />
                </div>

                <h2 className='text-2xl  ml-4 mt-12 font-bold'>
                    Select a category
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
                    {categories.map((cat) => (
                        <EngineerLink
                            cat={cat} />
                    ))}
                </div>
            </div>

            <FeaturedAndProducts
                initFeaturedProducts={featuredProducts.editProducts} />
            <Footer footerData={footerData} />
        </div>

    );
}
