
import { Header } from '@/components/header/header';
import { FeaturedAndProducts } from '@/components/home_page/featured_product';
import Footer from '@/components/home_page/footer';
import { CategoryCard } from '@/components/home_page/productTabs';
import ProductBreadcrumb from '@/components/productInfo/product/ProductBreadcrumb';
import { Button } from '@/components/ui/button';
import { getNotifications } from '@/lib/payement/get-notification-for-icon';
import { prisma } from '@/lib/prisma';
import { getFeaturedProducts, getFooterData, getRecentOrdersCount } from '@/lib/products/homeProducts';
export const revalidate = 18000; // ISR every 5 hours
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const categorySlug = (await params).category;

    const category = await prisma.category.findFirst({
        where: { slug: categorySlug },
        select: {
            name: true,
            description: true,
            slug: true,
        },
    });

    if (!category) {
        return {
            title: "Category Not Found | Cleaners Compare",
            description: "The category you're looking for doesn't exist.",
        };
    }

    const title = `${category.name} Products | Cleaners Compare`;
    const description = category.description || `Explore a wide range of ${category.name.toLowerCase()} for laundry and dry cleaning businesses.`;

    return {
        title,
        description,
        keywords: [
            category.name,
            "commercial laundry",
            "dry cleaning machines",
            "laundry equipment",
            "Cleaners Compare",
            category.slug,
        ],
        openGraph: {
            title,
            description,
            url: `https://cleanercompare.com/products/${category.slug}`,
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
            images: ["/uploads/logo.png"], // Replace with actual OG image
        },
    };
}


async function getCategory(categoryslug: string) {
    const category = await prisma.category.findFirst({
        where: { slug: categoryslug },
        select: {
            id: true,
            name: true,
            slug: true,
            children: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    imageUrl: true,
                    slug: true,
                }
            }
        }
    });

    const isMachineOrParts = category?.slug === 'machines' || category?.slug === 'parts';
    const result = {
        id: category?.id,
        name: category?.name,
        slug: category?.slug,
        subCategories: category?.children.map((child) => ({
            id: child.id,
            desc: child.description,
            href:
                isMachineOrParts ?
                    `/products/${category.slug}/${child.slug}/new` :
                    `/products/${category.slug}/${child.slug}`,
            img: child.imageUrl,
            slug: child.slug,
            title: child.name,
        })),
        subCategoriesUsed: isMachineOrParts ? category?.children.map((child) => ({
            id: child.id,
            desc: child.description,
            href: `/products/${category.slug}/${child.slug}/used`,
            img: child.imageUrl,
            slug: child.slug,
            title: child.name,
        })) : undefined,

    }

    return result;
}


export default async function ProductPageInfo(
    {
        params
    }:
        {
            params: Promise<{ category: string }>
        }
) {
    const { category } = await params;
    const categoryObj = await getCategory(category);

    const subcategories = categoryObj.subCategories;
    const subcategoriesUsed = categoryObj.subCategoriesUsed;
    const tt = subcategories?.length === 3 ? "[@media(min-width:1298px)]:grid-cols-3" : '[@media(min-width:1298px)]:grid-cols-4'
    const [
        featuredProducts,
        footerData,
    ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10 }),
        getFooterData(),
    ]);

    const isMachineOrParts = (subcategoriesUsed != undefined);
    const isParts = category === 'parts';
    const recentOrderCount = await getRecentOrdersCount();
    const messages = await getNotifications();

    const title = categoryObj.name;
    const description = title?.includes('Machines')
        ? "Discover the right equipment for your business — from brand-new commercial machines to quality used options across every category."
        : title?.includes('Parts')
            ? "Find new and used spare parts for every type of laundry, dry cleaning and finishing equipment — sourced from trusted suppliers."
            : title?.includes('Sundries')
                ? "Everyday essentials for laundry and dry cleaning operations — hangers, tag cards, heat-seal labels and more, sourced from trusted suppliers."
                : ""

    return (

        <div className="min-h-screen flex flex-col">
            <Header recentOrderCount={recentOrderCount} notificationData={messages} />
            <main >
                <div className='m-auto'>
                    <section className="bg-secondary/40 border-b">
                        <div className="container mx-auto px-4 py-12 text-center">
                            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">{
                                title?.includes('Parts')
                                    ? "Parts & Components"
                                    : title?.includes('Sundries')
                                        ? "Sundries & Supplies"
                                        : title}</h1>
                            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                                {description}
                            </p>
                            {isMachineOrParts && <div className="flex justify-center gap-3 mt-6">
                                <Button asChild>
                                    <a href="#new">New {title}</a>
                                </Button>
                                <Button asChild variant="outline">
                                    <a href="#used">Used {title}</a>
                                </Button>
                            </div>}
                        </div>
                    </section>
                    <div className="flex-grow max-w-7xl mx-auto mt-5   ">

                        <ProductBreadcrumb
                            className='justify-center  '
                            category={category}
                            subcategory={undefined}
                            name={undefined} />

                        {!isMachineOrParts &&
                            <div className=' container w-fit m-auto'>
                                <div className='mt-12'>
                                    {/* <h2 className='text-2xl font-bold'>
                                        Select a category
                                    </h2> */}
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-4'>
                                        {subcategories?.map((sub, i) => (
                                            <CategoryCard key={i} className='!grow !min-w-[90vw] md:!min-w-[35vw] lg:!min-w-[100px]' item={sub} />
                                        ))}
                                        {/* {subcategories?.map((sub, i) => (
                                            <CategoryCard key={i} item={sub} />
                                        ))} */}
                                    </div>

                                </div>

                            </div>}

                        {isMachineOrParts && <div className='flex flex-col gap-12 mt-1'>

                            {/* NEW IF MACHINES OR PARTS */}
                            <div className='mt-5'>
                                {/* <h2 className='text-2xl font-bold' id='new'>New {categoryObj.name}</h2> */}
                                <MachineSection eyebrow={`New ${categoryObj.name}`} condition="new" />
                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${tt}`}>
                                    {subcategories?.map((sub, i) => (
                                        <CategoryCard key={i} className='!grow !min-w-[90vw] md:!min-w-[45vw] lg:!min-w-[100px]' item={sub} />
                                    ))}

                                </div>

                            </div>


                            {/* USED IF MACHINES OR PARTS */}
                            {subcategoriesUsed &&
                                <div className=' container m-auto border-t pt-5 ' >
                                    {/* <h2 className='text-2xl font-bold' id='used'>Used {categoryObj.name}</h2> */}
                                    <MachineSection eyebrow={`Used ${categoryObj.name}`} condition="used" />
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${tt}`}>
                                        {subcategoriesUsed.map((subc, i) => (
                                            <CategoryCard className='!grow !min-w-[90vw] md:!min-w-[45vw] lg:!min-w-[100px]' key={i} item={subc} />
                                        ))}
                                    </div>
                                </div>
                            }

                        </div>}
                    </div>

                    <div className=''>
                        <div></div>
                    </div>
                </div>


                <FeaturedAndProducts initFeaturedProducts={featuredProducts.editProducts} />
            </main>

            <Footer footerData={footerData} />
        </div>

    );
}

function MachineSection({
    eyebrow,
    condition,
}: {
    eyebrow: string;
    condition: "new" | "used";
}) {

    let title = '';
    let subtitle = '';
    let id = condition
    if (eyebrow.includes('Machines')) {
        title = condition === 'new' ? "Brand-New Commercial Machines" : "Quality Used Machines";
        subtitle = condition === 'new'
            ? "The latest models from leading manufacturers — built for performance, efficiency, and long-term reliability."
            : "Inspected, refurbished and ready to work — a cost-effective way to grow your business."
    } else if (eyebrow.includes("Part")) {
        title = condition === 'new' ? "Brand-New Spare Parts" : "Quality Used Parts";
        subtitle = condition === 'new'
            ? "Genuine and OEM-quality components — covered by manufacturer warranty."
            : "Tested and inspected pre-owned components — a cost-effective way to keep equipment running."
    }


    return (
        <section id={id} className="container mx-auto px-4    ">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                    {eyebrow}
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">{title}</h2>
                <p className="text-muted-foreground mt-3">{subtitle}</p>
            </div>

        </section>
    );
}
