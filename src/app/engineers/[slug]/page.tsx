import { NoProductsFound } from "@/app/products/[category]/[subcategory]/[condition]/page";
import { Header } from "@/components/header/header";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import ProductBreadcrumb from "@/components/productInfo/product/ProductBreadcrumb";
import ServiceCard from "@/components/serviceEnginner";
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
import { prisma } from "@/lib/prisma";
import { getFeaturedProducts, getFooterData, getRecentOrdersCount } from "@/lib/products/homeProducts";
import type { Metadata } from 'next';

export async function generateMetadata(
    { params }: {params: Promise<{ slug: string }>}
): Promise<Metadata> {
    const {slug:rawSlug} = await params;
    const name = rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1).replace('-', ' ');

    return {
        title: `${name} Engineers Services | Professional Support`,
        description: `Explore reliable and high-quality services in ${name} provided by professional engineers. From booking to execution, everything is tailored to your needs.`,
        keywords: [
            `${name} engineers`,
            `${name} services`,
            `professional ${name.toLowerCase()} support`,
            "home services",
            "engineering service categories",
        ],
        openGraph: {
            title: `${name} Engineers Services`,
            description: `Discover expert-level engineering services in ${name}. Book skilled professionals now.`,
            url: `https://cleanerscompare.com/app/enginners/${rawSlug}`,
            siteName: "CleanersCompare",
            images: [
                {
                    url: "/uploads/service3/service0.jpeg",
                    alt: `${name} Engineer Service`,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${name} Engineers Services | Professional Support`,
            description: `Find expert services in ${name} from our professional engineers.`,
            images: ["/uploads/service3/service0.jpeg"],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}




async function getServices(name: string) {
    const now = new Date();
    await prisma.service.updateMany({
        where: {
            isFeatured: true,
            featuredEndDate: {
                lt: now,
            },
        },
        data: {
            isFeatured: false,
            featuredEndDate: null,
            featureDays: null,
        },
    })
    const services = await prisma.service.findMany({
        where: { category: name.replace(' ', '_').toUpperCase() },
        orderBy: [
            { isFeatured: 'desc' },
            { createdAt: 'desc' }
        ]
    });
    //console.log(services, 'uuuuuuuuiiiiiiooooooooo');

    return services;
}



export default async function Page({ params }: {params: Promise<{ category: string }>}
) {

    const { slug } = await params;

    //console.log(slug,'ppppppp');
    const name = (slug.charAt(0).toUpperCase() + slug.slice(1)).replace('-', ' ');
    //const services = await getServices(name);
    //console.log(services,'$$$$$$$$$$$$');
    const [
        featuredProducts,
        footerData,
        services,
    ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10 }),
        getFooterData(),
        getServices(name)
    ]);
    const recentOrderCount = await getRecentOrdersCount();
    const messages = await getNotifications();
    return (
        <div>
            <Header recentOrderCount={recentOrderCount} notificationData={messages}/>
            <main className="container max-w-7xl m-auto space-y-8 mt-5">
                <div className="flex justify-center mt-4">
                    <ProductBreadcrumb
                        category={'engineers'}
                        subcategory={name}
                        base=""
                        name={undefined} />
                </div>
                <h1 className="text-4xl font-bold">{name} Engineers</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8  ">
                    {services.map((service) => (
                        <ServiceCard
                            service={service}
                        />
                    ))}
                    {
                        services.length === 0 &&
                        <NoProductsFound subcategory={{ name, description: "" }} />
                    }
                </div>
            </main>
            <FeaturedAndProducts
                initFeaturedProducts={featuredProducts.editProducts} />
            <Footer
                footerData={footerData}
            />
        </div>
    )
}