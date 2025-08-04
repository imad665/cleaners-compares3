
import { Header } from '@/components/header/header';
import { FeaturedAndProducts } from '@/components/home_page/featured_product';
import Footer from '@/components/home_page/footer';
import { CategoryCard } from '@/components/home_page/productTabs';
import ProductBreadcrumb from '@/components/productInfo/product/ProductBreadcrumb';
import { prisma } from '@/lib/prisma';
import { getFeaturedProducts, getFooterData, getRecentOrdersCount } from '@/lib/products/homeProducts';
export const revalidate = 18000; // ISR every 5 hours
import type { Metadata } from 'next';
 
export async function generateMetadata({ params }: { params: Promise<{ category: string }>}): Promise<Metadata> {
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
    const tt = subcategories?.length === 3?"grid-cols-3":'grid-cols-4'
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
    return (

        <div className="min-h-screen flex flex-col">
            <Header recentOrderCount={recentOrderCount}/>
            <main >
                <div className='m-auto'>
                    <div className="flex-grow max-w-8xl m-auto mt-5  mx-3">

                        <ProductBreadcrumb
                            className='justify-center  '
                            category={category}
                            subcategory={undefined}
                            name={undefined} />

                        {!isMachineOrParts &&
                            <div className=' w-fit m-auto'>
                                <div className='mt-12'>
                                    <h2 className='text-2xl font-bold'>
                                        Select a category
                                    </h2>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-4'>
                                        {subcategories?.map((sub, i) => (
                                            <CategoryCard key={i} className='!grow !min-w-[90vw] md:!min-w-[35vw] lg:!min-w-[100px]'  item={sub} />
                                        ))}
                                        {/* {subcategories?.map((sub, i) => (
                                            <CategoryCard key={i} item={sub} />
                                        ))} */}
                                    </div>

                                </div>

                            </div>}

                        {isMachineOrParts && <div className='flex flex-col gap-12 mt-12'>
                            {/* NEW IF MACHINES OR PARTS */}
                            <div  className='  m-auto'>
                                <h2 className='text-2xl font-bold' id='new'>New {categoryObj.name}</h2>
                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 [@media(min-width:1298px)]:grid-cols-${isParts?'3':'4'}`}>
                                    {subcategories?.map((sub, i) => (
                                        <CategoryCard key={i} className='!grow !min-w-[90vw] md:!min-w-[45vw] lg:!min-w-[100px]' item={sub} />
                                    ))}

                                </div>

                            </div>


                            {/* USED IF MACHINES OR PARTS */}
                            {subcategoriesUsed &&
                                <div  className=' m-auto' >
                                    <h2 className='text-2xl font-bold' id='used'>Used {categoryObj.name}</h2>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 [@media(min-width:1298px)]:grid-cols-${isParts?'3':'4'}`}>
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
