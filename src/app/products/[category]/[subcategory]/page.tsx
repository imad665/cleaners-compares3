
import { PaginatedProducts } from '@/components/allProducts/allProducts';
import { Header } from '@/components/header/header';
import Footer from '@/components/home_page/footer';
import ProductBreadcrumb from '@/components/productInfo/product/ProductBreadcrumb';
import { prisma } from '@/lib/prisma';
import { fetchProducts } from '@/lib/products/fetchProducts';
import { NoProductsFound } from './[condition]/page';
import { LetterCaseLowercaseIcon } from '@radix-ui/react-icons';
import { FeaturedAndProducts } from '@/components/home_page/featured_product';
/* import Footer from '@/components/productInfo/layout/Footer';
import Navbar from '@/components/productInfo/layout/Navbar'; */
//import ProductDetailPage from '@/components/productInfo/ProductDetailPage';
import type { Metadata } from 'next';
 
import { getFeaturedProducts, getFooterData, getRecentOrdersCount } from '@/lib/products/homeProducts';
import { getNotifications } from '@/lib/payement/get-notification-for-icon';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
    const { category: categorySlug, subcategory: subcategorySlug } = await params;

    const subcategory = await prisma.category.findFirst({
        where: { slug: subcategorySlug, parent: { slug: categorySlug } },
        select: {
            name: true,
            description: true,
            slug: true,
            parent: {
                select: {
                    name: true,
                    slug: true,
                },
            },
        },
    });

    if (!subcategory || !subcategory.parent) {
        return {
            title: 'Subcategory Not Found | Cleaners Compare',
            description: 'The subcategory you’re looking for does not exist.',
        };
    }

    const title = `${subcategory.name} in ${subcategory.parent.name} | Cleaners Compare`;
    const description =
        subcategory.description ||
        `Browse our selection of ${subcategory.name.toLowerCase()} in the ${subcategory.parent.name.toLowerCase()} category. Perfect for laundry and dry cleaning professionals.`;

    return {
        title,
        description,
        keywords: [
            subcategory.name,
            subcategory.parent.name,
            "commercial laundry",
            "dry cleaning machines",
            "Cleaners Compare",
            categorySlug,
            subcategorySlug,
        ],
        openGraph: {
            title,
            description,
            url: `https://cleanercompare.com/products/${categorySlug}/${subcategorySlug}`,
            siteName: 'CleanersCompare',
            images: [
                {
                    url: '/uploads/logo.png', // Replace with actual OG image
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/uploads/logo.png'], // Replace with actual OG image
        },
    };
}



export default async function ProductPageInfo(
    {
        params
    }:
        {
            params: Promise<{ category: string; subcategory: string }>
        }
) {
    const { category, subcategory } = await params;
    const isMachineOrParts = category === 'machines' || category === 'parts'
    const pageSize = isMachineOrParts ? 40 : 20;

    const { mappedProducts: products, newSubcategory, category: categoryP, pagination } = await fetchProducts(
        category, subcategory, '', 1, pageSize);

    //console.log(products, pagination, categoryP, newSubcategory, '||||||||||||');
    let newProducts = [];
    let usedProducts = [];
    let newP = '';
    if (isMachineOrParts) {
        newProducts = products?.filter((p) => p.condition === 'NEW') || [];
        usedProducts = products?.filter((p) => p.condition !== 'NEW') || [];
        newP = 'New';
    } else {
        newProducts = products || [];
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

        <div className="bg-gray-100 ">
            <Header recentOrderCount={recentOrderCount} notificationData={messages}/>
            {!products ?
                <div className="flex flex-col items-center">
                    <ProductBreadcrumb
                        category={category}
                        subcategory={subcategory}
                        name={undefined} />
                    <NoProductsFound subcategory={newSubcategory} />
                </div>

                :
                <div className="container max-w-7xl m-auto space-y-3">
                    <ProductBreadcrumb
                        category={category}
                        subcategory={subcategory}
                        name={undefined} />
                    <PaginatedProducts
                        initProducts={newProducts}
                        subCategory={categoryP}
                        totalPages={pagination.totalPages}
                        condition={undefined}
                        page={pagination.currentPage}
                        title={`New ${categoryP.name}`}
                        pageSize={pageSize/* pagination.pageSize */} />
                    {isMachineOrParts &&
                        <div>
                            {usedProducts.length > 0 && <PaginatedProducts
                                initProducts={usedProducts}
                                subCategory={categoryP}
                                totalPages={pagination.totalPages}
                                condition={undefined}
                                page={pagination.currentPage}
                                showDescription={false}
                                title={`Used ${categoryP.name}`}
                                pageSize={pageSize/* pagination.pageSize */} />
                            }
                            {usedProducts.length === 0 &&
                                <div className="flex flex-col items-center">

                                    <ProductBreadcrumb
                                        category={category}
                                        subcategory={subcategory}
                                        name={undefined} />
                                    <NoProductsFound subcategory={{ name: `used ${categoryP.name}`, description: '' }} />
                                </div>
                            }
                        </div>

                    }
                </div>
            }
            <FeaturedAndProducts
             initFeaturedProducts={featuredProducts.editProducts}
            />
            <Footer  
                footerData={footerData}
            />
        </div>

    );
}
