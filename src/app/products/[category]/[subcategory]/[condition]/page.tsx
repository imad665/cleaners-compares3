import { PaginatedProducts } from "@/components/allProducts/allProducts";
import { Header } from "@/components/header/header";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
import Footer from "@/components/home_page/footer";
import ProductBreadcrumb from "@/components/productInfo/product/ProductBreadcrumb";
import ProductDetailPage from "@/components/productInfo/ProductDetailPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { prisma } from "@/lib/prisma";
import { fetchProducts } from "@/lib/products/fetchProducts";
import { getFeaturedProducts, getFooterData, getRecentOrdersCount } from "@/lib/products/homeProducts";
import { ChevronRight, Frown } from "lucide-react";

import type { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string; subcategory: string; condition: string }>;
}): Promise<Metadata> {
    const { category, subcategory, condition } = await params;
    const isCondition = condition === 'new' || condition === 'used';

    if (isCondition) {
        const subcategoryData = await prisma.category.findFirst({
            where: { slug: subcategory },
            select: {
                name: true,
                description: true,
                parent: {
                    select: { name: true },
                },
            },
        });

        if (!subcategoryData || !subcategoryData.parent) {
            return {
                title: 'Products Not Found | Cleaners Compare',
                description: 'No product listing found for this filter.',
            };
        }

        const title = `${condition.charAt(0).toUpperCase() + condition.slice(1)} ${subcategoryData.name} in ${subcategoryData.parent.name} | Cleaners Compare`;
        const description = `Browse our ${condition} ${subcategoryData.name.toLowerCase()} available under the ${subcategoryData.parent.name} category. Best deals for your commercial cleaning needs.`;

        return {
            title,
            description,
            keywords: [
                condition,
                subcategoryData.name,
                subcategoryData.parent.name,
                "industrial cleaning equipment",
                "dry cleaning machines",
                "Cleaners Compare",
            ],
            openGraph: {
                title,
                description,
                url: `https://cleanercompare.com/products/${category}/${subcategory}/${condition}`,
                siteName: 'Cleaners Compare',
                images: [
                    {
                        url: 'https://cleanercompare.com/og-condition.jpg',
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
                type: 'website',
            } as Metadata['openGraph'],  // ✅ ensure correct typing
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: ['https://cleanercompare.com/og-condition.jpg'],
            } as Metadata['twitter'],
        };
    }

    const product = await prisma.product.findFirst({
        where: { slug: condition },
        select: {
            title: true,
            description: true,
            imagesUrl: true,
        },
    });

    if (!product) {
        return {
            title: 'Product Not Found | Cleaners Compare',
            description: 'This product does not exist or may have been removed.',
        };
    }

    const title = `${product.title} | Cleaners Compare`;
    const description = product.description || `Explore features, pricing, and reviews for ${product.title}.`;
    const imageUrl = product.imagesUrl?.[0] || 'https://cleanercompare.com/default-product.jpg';

    return {
        title,
        description,
        keywords: [
            product.title,
            "commercial cleaning product",
            "dry cleaning",
            "industrial laundry",
            "Cleaners Compare",
        ],
        openGraph: {
            title,
            description,
            url: `https://cleanercompare.com/products/${category}/${subcategory}/${condition}`,
            siteName: 'CleanersCompare',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.title,
                },
            ],
            type: 'website',
        } as Metadata['openGraph'],
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        } as Metadata['twitter'],
    };
}



export function NoProductsFound({ subcategory }: { subcategory: { name: string; description: string } }) {
    return (
        <div className="max-w-4xl mx-auto text-center space-y-16 py-32">
            <div>
                <h1 className="text-5xl font-extrabold mb-4">{subcategory?.name}</h1>
                <p className="text-lg text-muted-foreground">{subcategory?.description}</p>
            </div>

            <Alert variant="default" className="max-w-2xl mx-auto py-10 px-8 text-center space-y-4">
                <Frown className="h-10 w-10 mx-auto text-muted-foreground" />
                <AlertTitle className="text-2xl font-semibold">No Products Found</AlertTitle>
                <AlertDescription className="text-base">
                    Unfortunately, there are currently no products in this category. Check back soon or explore other categories.
                </AlertDescription>
            </Alert>
        </div>
    )
}







function Breadcrumb({ category, subcategory, condition }: { category: string, subcategory: string, condition: string }) {
    return (
        <nav className="mt-5" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                    <a href="#" className="text-gray-600 hover:text-red-500 transition-colors">
                        {category}
                    </a>
                </li>
                <li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </li>
                <li>
                    <a href="#" className="text-gray-600 hover:text-red-500 transition-colors">
                        {subcategory}
                    </a>
                </li>
                <li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </li>
                <li className="text-gray-400">{condition}</li>
            </ol>
        </nav>
    );
}
export default async function ProductsPageCondition(
    {
        params
    }: {
        params: Promise<{ category: string, subcategory: string, condition: 'new' | 'used' }>
    }
) {
    const { category, subcategory, condition } = await params;
    const [
        featuredProducts,
        footerData,
    ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10 }),
        getFooterData(),
    ]);

    if (['new', 'used'].includes(condition)) {
        const { mappedProducts: products, newSubcategory, category: categoryP, pagination } = await fetchProducts(
            category, subcategory, condition, 1, 20);

        //console.log(products, pagination, categoryP, newSubcategory, '||||||||||||');
        const recentOrderCount = await getRecentOrdersCount();      
        return (
            <div className="bg-gray-100 ">
                <Header recentOrderCount={recentOrderCount}/>
                {!products ?
                    <div className="flex flex-col items-center">
                        <ProductBreadcrumb category={category}
                            subcategory={subcategory}
                            name={condition} />
                        <NoProductsFound subcategory={newSubcategory} />
                    </div>

                    :
                    <div className="container max-w-7xl m-auto space-y-3">
                        <ProductBreadcrumb category={category}
                            subcategory={subcategory}
                            name={condition} />
                        <PaginatedProducts
                            initProducts={products}
                            subCategory={categoryP}
                            totalPages={pagination.totalPages}
                            condition={condition}
                            page={pagination.currentPage}
                            pageSize={pagination.pageSize} />
                    </div>
                }
                <FeaturedAndProducts
                    initFeaturedProducts={featuredProducts.editProducts}
                />
                <Footer footerData={footerData} />
            </div>
        )
    } else {
         const recentOrderCount = await getRecentOrdersCount(); 
        return (
            <div className="min-h-screen flex flex-col">
                <Header recentOrderCount={recentOrderCount}/>
                <main className="flex-grow">
                    <ProductDetailPage
                        categorySlug={category}
                        subcategorySlug={subcategory}
                        productSlug={condition}
                    />
                    <FeaturedAndProducts
                        initFeaturedProducts={featuredProducts.editProducts} />
                </main>
                <Footer footerData={footerData} />
            </div>
        );
    }


}