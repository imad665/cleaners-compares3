import { prisma } from "../prisma";
import { excludeSuspendedSeller, getDealCountdown } from "./homeProducts";
import { generateSlug } from "./slugGen";





export const fetchProducts = async (
    category: string | null,
    subcategory: string | null,
    condition: 'used' | 'new',
    page: number,
    pageSize: number,
    id?: string
) => {
    try {
        const inCondition = condition === 'new'
            ? ['NEW']
            : condition === 'used'
                ? ['USED']
                : ['NEW', 'USED'];
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        let whereClause;
        if (id) {
            // Fetch by product ID
            whereClause = {
                categoryId:id,
                ...excludeSuspendedSeller,
                condition: { in: inCondition }
            };
        } else {
            // Fetch by category and subcategory slug
            whereClause = {
                condition: { in: inCondition },
                ...excludeSuspendedSeller,
                category: {
                    slug: {
                        equals: subcategory,
                    },
                    parent: {
                        slug: {
                            equals: category,
                        }
                    }
                }
            };
        }



        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: whereClause,
                select: {
                    id: true,
                    condition: true,
                    description: true,
                    units: true,
                    title: true,
                    imagesUrl: true,
                    slug: true,
                    price: true,
                    discountPercentage: true,
                    discountPrice: true,
                    isDealActive: true,
                    dealEndDate: true,
                    createdAt:true,
                    stock: true,
                    isIncVAT:true,
                    ratings: {
                        select: {
                            stars: true,
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            slug: true,
                            parent: {
                                select: { slug: true }
                            }
                        },
                    },

                    _count: {
                        select: {
                            ratings: true,
                        }
                    }
                },

                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.product.count({
                where: whereClause
            })
        ]);
       // console.log(page,products.length,'uuuuuuuuuuuuuu');
        
        if (products.length > 0 || page != 1) {
            let categoryP = 'none';
            if(products.length>0)
                categoryP = products[0].category || 'none';
            const mappedProducts = products.map(p => {
                return {
                    productId: p.id,
                    href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
                    stars: p.ratings.reduce((sum, item) => (sum + item.stars), 0) / p.ratings.length,
                    starsCount: p.ratings.length,
                    units: p.units,
                    unitPrice: ((!p.isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1)).toFixed(2),
                    priceExcVat: !p.isDealActive ? p.price : p.discountPrice,
                    price: p.price,
                    dealEndDate: p.dealEndDate,
                    dealCountdown: p.isDealActive ? getDealCountdown(p.dealEndDate) : null,
                    image: p.imagesUrl[0],
                    stock: p.stock,
                    title: p.title,
                    condition: p.condition,
                    isIncVAT:p.isIncVAT,
                    isOldProduct:false//new Date(p.createdAt) < new Date('2025-07-18')
                };
            });

            const totalPages = Math.ceil(total / pageSize);

            return {
                category: categoryP,
                mappedProducts,
                pagination: {
                    total,
                    currentPage: page,
                    totalPages,
                    pageSize
                }
            };
        } 
        const newSubcategory = await prisma.category.findFirst({
            where: whereClause,
            select: {
                name: true,
                description: true,
                parent: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return { newSubcategory }

    } catch (error) {
        console.error("Failed to fetch products:", error);
        return {}
    }
};
