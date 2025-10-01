'server only'

import { Description } from "@radix-ui/react-dialog"
import { prisma } from "../prisma"
import { featuresProductsSlides, limitDealProducts } from "./tempData"
import { getCategoriesHome } from "./homeCategories"
import { Notable } from "next/font/google"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

type GetProductsParams = {
    page?: number
    pageSize?: number
    isFeatured?: boolean
    isRandom?: boolean
}

const excludeAdminSeller = {
    seller: {
        email: {
            not: {
                equals: "admin@cleancompare2.com",
            },
        },
    },
};


export const getDealCountdown = (dealEndDate: any) => {
    const now = new Date();
    const end = new Date(dealEndDate);
    const diffMs = end - now;

    if (diffMs <= 0) return null;

    const totalMinutes = Math.floor(diffMs / 1000 / 60);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    //console.log(days,'oooooooooooooooooo');

    if (days >= 6) return `${getRandomInt(1, 5)} days`;
    if (days > 0) return `${days} days `;
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
};


function getFeaturedProductsChunk(where: any, skip: number, pageSize: number) {
    const featuredProducts = prisma.product.findMany({
        where: where,
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
            createdAt: true,
            stock: true,
            ratings: {
                select: {
                    stars: true,
                }
            },
            category: {
                select: {
                    slug: true,
                    parent: {
                        select: {
                            slug: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            featuredStartDate: 'desc',
        },
        skip,
        take: pageSize,
    })
    return featuredProducts;
}

export async function getFeaturedProducts({ page = 1, pageSize = 10, isFeatured = true, isRandom = false }: GetProductsParams) {

    try {
        const where = isFeatured ? {
            isFeatured: isFeatured,
            ...excludeAdminSeller,
            featuredStartDate: {
                lte: new Date(),
            },
            featuredEndDate: {
                gte: new Date(),
            },
        } : { isFeatured, ...excludeAdminSeller, }
        let skip = (page - 1) * pageSize
        if (isRandom) {
            const totalProducts = await prisma.product.count({
                where: where
            })
            skip = Math.max(0, getRandomInt(0, totalProducts - pageSize));

        }

        let [products, total] = await Promise.all([
            getFeaturedProductsChunk(where, skip, pageSize),
            prisma.product.count({
                where: {
                    isFeatured: true,
                    featuredStartDate: {
                        lte: new Date(),
                    },
                    featuredEndDate: {
                        gte: new Date(),
                    },
                },
            }),
        ]);

        //console.log(products, '[[[[[[[[[[[[[');

        let editProducts = products.map((p) => {
            const dealCountdown = getDealCountdown(p.dealEndDate);
            let isDealActive = dealCountdown != null;
            if (dealCountdown === null) {
                prisma.product.update({
                    where: { id: p.id },
                    data: {
                        isDealActive: false,
                    }
                })

            }
            return {
                productId: p.id,
                href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
                stars: p.ratings.reduce((sum, item) => (sum + item.stars), 0) / p.ratings.length,
                starsCount: p.ratings.length,
                units: p.units,
                unitPrice: ((!isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1)),
                priceExcVat: !isDealActive ? p.price : p.discountPrice,
                price: p.price,
                dealEndDate: p.dealEndDate,
                dealCountdown: isDealActive ? getDealCountdown(p.dealEndDate) : null,
                image: p.imagesUrl[0],
                stock: p.stock,
                title: p.title,
                isOldProduct: false//new Date(p.createdAt) < new Date('2025-07-18')
            }
        })

        if (products.length > 0) {
            if (products.length < 5 && isFeatured) {
                const placeholders = await getFeaturedProducts({ page, pageSize: 10, isFeatured: false, isRandom: false })
                editProducts = editProducts.concat(placeholders.editProducts)
                total = placeholders.total;
            }
            return {
                editProducts,
                total,
                currentPage: page,
                totalPage: Math.ceil(total / pageSize)
            }
        } else {
            if (isFeatured)
                return await getFeaturedProducts({ page, pageSize: 10, isFeatured: false, isRandom: false })
            const editProducts = featuresProductsSlides;
            const total = editProducts.length;
            return {
                editProducts,
                total,
                currentPage: page,
                totalPage: Math.ceil(total / pageSize)
            }
        }


    } catch (error) {
        console.error("Failed to fetch featured products:", error)
        throw new Error("Failed to fetch featured products.")
    }
}
function getRandomInt(min: number, max: number) {
    // Returns an integer between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function mockDeals() {
    const total = await prisma.product.count({
        where: { ...excludeAdminSeller, }
    });

    const randomSkip = Math.max(0, getRandomInt(0, total - 20)); // Ensure no overflow

    const products = await prisma.product.findMany({
        where: { ...excludeAdminSeller, },
        skip: randomSkip,
        take: 20,
        include: {
            category: {
                select: {
                    slug: true,
                    parent: {
                        select: {
                            slug: true,
                        }
                    }
                }
            },
            ratings: {
                select: {
                    stars: true,
                }
            },
        }
    });
    const editProducts = products.map((p) => {
        const discount = getRandomInt(5, 20); // make this random between [5,20]%
        const price = p.price + p.price * (discount / 100);
        const discountAmount = p.price * (discount / 100);
        const discountedPrice = price - discountAmount;
        const daysToAdd = getRandomInt(1, 3);
        const dealEndDate = new Date();
        dealEndDate.setDate(dealEndDate.getDate() + daysToAdd);
        return {
            productId: p.id,
            href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
            stars: p.ratings?.reduce((sum, item) => (sum + item.stars), 0) / p.ratings?.length,
            starsCount: p.ratings?.length,
            units: p.units,
            unitPrice: ((discountedPrice) / (p.units || 1)),
            priceExcVat: price,
            discountPrice: discountedPrice,
            image: p.imagesUrl[0],
            title: p.title,
            endDeal: getDealCountdown(dealEndDate),
            stock: p.stock,
            discountPercentage: discount,
            isOldProduct: false//new Date(p.createdAt) < new Date('2025-07-18')
        }
    })
    return editProducts
}



export async function getDealsProducts({ page = 1, pageSize = 10, isRandom = false }: GetProductsParams) {

    const now = new Date();
    let skip = (page - 1) * pageSize
    if (isRandom) {
        const totalProducts = await prisma.product.count({
            where: {
                isDealActive: true,
                dealStartDate: { lte: now },
                dealEndDate: { gte: now },
                ...excludeAdminSeller
            }
        })
        skip = Math.max(0, getRandomInt(0, totalProducts - pageSize));
    }
    const take = pageSize;

    let [products, total] = await Promise.all([
        prisma.product.findMany({
            where: {
                isDealActive: true,
                dealStartDate: { lte: now },
                dealEndDate: { gte: now },
                ...excludeAdminSeller,
            },
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
                stock: true,
                createdAt: true,
                ratings: {
                    select: {
                        stars: true,
                    }
                },
                category: {
                    select: {
                        slug: true,
                        parent: {
                            select: {
                                slug: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                dealEndDate: 'asc',
            },
            skip,
            take,

        }),
        prisma.product.count({
            where: {
                ...excludeAdminSeller,
                isDealActive: true,
                dealStartDate: { lte: now },
                dealEndDate: { gte: now },

            }
        })
    ]);

    `title: 'Speed Queen Commercial Washer Speed Queen Commercial Washer Speed Queen Commercial Washer',
        discountPrice: 1599.99,
        price: 1999.99,
        endDeal: '2d 10h 35m',
        image: 'https://www.cleanerscompare.com/pics/1/80154_C_BLD12H_(01)_CleanersCompare.png',
        discountPercentage: 20,
        productId:'7777',
        slug:'/'`

    let editProducts = products.map((p) => {
        const dealCountdown = getDealCountdown(p.dealEndDate);
        let isDealActive = dealCountdown != null;
        if (dealCountdown === null) {
            prisma.product.update({
                where: { id: p.id },
                data: {
                    isDealActive: false,
                }
            })

        }
        return {
            productId: p.id,
            href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
            stars: p.ratings?.reduce((sum, item) => (sum + item.stars), 0) / p.ratings.length,
            starsCount: p.ratings?.length,
            units: p.units,
            unitPrice: ((!p.isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1)),
            priceExcVat: !isDealActive ? p.price : p.discountPrice,
            discountPrice: p.discountPrice,
            price: p.price,
            image: p.imagesUrl[0],
            title: p.title,
            endDeal: getDealCountdown(p.dealEndDate),
            dealEndDate:getDealCountdown(p.dealEndDate),
            dealCountdown: isDealActive ? getDealCountdown(p.dealEndDate) : null,
            stock: p.stock,
            discountPercentage: p.discountPercentage,
            isOldProduct: false//new Date(p.createdAt) < new Date('2025-07-18')
        }
    }
    )
    /* productId: p.id,
    href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
    stars: p.ratings.reduce((sum, item) => (sum + item.stars), 0) / p.ratings.length,
    starsCount: p.ratings.length,
    units: p.units,
    unitPrice: ((!isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1)),
    priceExcVat: !isDealActive ? p.price : p.discountPrice,
    price: p.price,
    dealEndDate: p.dealEndDate,
    dealCountdown: isDealActive ? getDealCountdown(p.dealEndDate) : null,
    image: p.imagesUrl[0],
    stock: p.stock,
    title: p.title,
    isOldProduct: new Date(p.createdAt) < new Date('2025-07-18') */
    //console.log(editProducts, 'ooooooooo');

    if (products.length > 0) {
        if (products.length < 5) {
            const placeholders = await mockDeals();
            editProducts = editProducts.concat(placeholders)
            total = 20
        }
        return {
            editProducts,
            total,
            currentPage: page,
            totalPage: Math.ceil(total / pageSize)
        }
    } else {
        const editProducts = await mockDeals();
        //const total = editProducts.length;
        return {
            editProducts,
            total: 20,
            currentPage: page,
            totalPage: 1
        }
    }
}

export async function getPartsAndAccessoirsProducts({ page = 1, pageSize = 10, isRandom = false }: GetProductsParams) {
    let skip = (page - 1) * pageSize;
    if (isRandom) {
        const totalProducts = await prisma.product.count({
            where: {
                ...excludeAdminSeller,
                category: {
                    parent: {
                        name: {
                            in: ['Parts', 'Sundries'],
                            mode: 'insensitive'
                        },
                    }
                },
            }
        })
        skip = Math.max(0, getRandomInt(0, totalProducts - pageSize));
    }

    const take = pageSize;
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: {
                ...excludeAdminSeller,
                category: {
                    parent: {
                        name: {
                            in: ['Parts', 'Sundries'],
                            mode: 'insensitive'
                        },
                    }
                },
            }, select: {
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
                stock: true,
                createdAt: true,
                ratings: {
                    select: {
                        stars: true,
                    }
                },
                category: {
                    select: {
                        slug: true,
                        parent: {
                            select: {
                                slug: true,
                            }
                        }
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
            where: {
                ...excludeAdminSeller,
                category: {
                    parent: {
                        name: {
                            in: ['Parts', 'Sundries'],
                            mode: 'insensitive'
                        },
                    }
                }
            }
        })
    ])
    const editProducts = products.map((p) => {
        const dealCountdown = getDealCountdown(p.dealEndDate);
        let isDealActive = dealCountdown != null;
        if (dealCountdown === null) {
            prisma.product.update({
                where: { id: p.id },
                data: {
                    isDealActive: false,
                }
            })

        }

        return {
            productId: p.id,
            href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
            stars: p.ratings.reduce((sum, item) => (sum + item.stars), 0) / p.ratings.length,
            starsCount: p.ratings.length,
            units: p.units,
            unitPrice: (!isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1),
            priceExcVat: !isDealActive ? p.price : p.discountPrice,
            price: p.price,
            dealEndDate: p.dealEndDate,
            dealCountdown: isDealActive ? dealCountdown : null,
            image: p.imagesUrl[0],
            title: p.title,
            stock: p.stock,
            isOldProduct: false//new Date(p.createdAt) < new Date('2025-07-18')
        }
    }
    )

    if (products.length > 0) {
        return {
            editProducts,
            total,
            currentPage: page,
            totalPage: Math.ceil(total / pageSize)
        }
    } else {
        const editProducts = featuresProductsSlides;
        const total = editProducts.length;
        return {
            editProducts,
            total,
            currentPage: page,
            totalPage: Math.ceil(total / pageSize)
        }
    }

}

export async function getWantedItems({ page = 1, pageSize = 10, isRandom = false }: GetProductsParams) {
    let skip = (page - 1) * pageSize;
    if (isRandom) {
        const totalProducts = await prisma.wantedItem.count()
        skip = Math.max(0, getRandomInt(0, totalProducts - pageSize));
    }
    const take = pageSize;

    const [wantedItems, total] = await Promise.all([
        prisma.wantedItem.findMany({
            take,
            skip,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                createdAt: true,
                location: true,
                contactInfo: {
                    select: {
                        email: true,
                        phone: true,
                    }
                }
            }
        }),
        prisma.wantedItem.count(),
    ]);

    const editedWantedItem = wantedItems.map((item) => (
        {
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            location: item.location,
            datePosted: item.createdAt.toISOString().split('T')[0],
            contactInfo: `Email:${item.contactInfo?.email} | Phone:${item.contactInfo?.phone}`
        }
    ))
    return {
        editedWantedItem,
        total,
        currentPage: page,
        totalPage: Math.ceil(total / pageSize)
    }

}


export async function getBusinesessForSale({ page = 1, pageSize = 10, isRandom = false }: GetProductsParams) {

    let skip = (page - 1) * pageSize;
    if (isRandom) {
        const totalProducts = await prisma.businessForSale.count()
        skip = Math.max(0, getRandomInt(0, totalProducts - pageSize));
    }
    const take = pageSize;

    const [businessesForSale, total] = await Promise.all([
        prisma.businessForSale.findMany({
            take,
            skip,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                createdAt: true,
                location: true,
                reasonFoSale: true,
                annualTurnover: true,
                contactInfo: {
                    select: {
                        email: true,
                        phone: true,
                    }
                }
            }
        }),
        prisma.businessForSale.count(),
    ]);


    const editedBusinessForSale = businessesForSale.map((item) => (
        {
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            location: item.location,
            reason: item.reasonFoSale,
            value: item.annualTurnover,
            datePosted: item.createdAt.toISOString().split('T')[0],
            contactInfo: `Email:${item.contactInfo?.email} | Phone:${item.contactInfo?.phone}`
        }
    ))
    return {
        editedBusinessForSale,
        total,
        currentPage: page,
        totalPage: Math.ceil(total / pageSize)
    }

}

type GetVideosParams = {
    page?: number;
    pageSize?: number;
    isRandom?: boolean
};

export async function getYoutubeVideos({ page = 1, pageSize = 10, isRandom = false }: GetVideosParams) {
    let skip = (page - 1) * pageSize;
    if (isRandom) {
        const totalProducts = await prisma.video.count()
        skip = Math.max(0, getRandomInt(0, totalProducts - pageSize));
    }

    const [videos, total] = await Promise.all([
        prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize,
        }),
        prisma.video.count(),
    ]);

    const transformedVideos = videos.map((video) => ({
        videoUrl: video.url,
        title: video.title,
        description: video.description,
        views: Math.floor(Math.random() * 100_000), // Mocked views
        thumbnail: video.thumbnail || 'https://via.placeholder.com/600x400?text=No+Thumbnail',
        duration: 12 * 60, // Mocked duration (in seconds)
    }));

    return {
        videos: transformedVideos,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}


export async function getFooterData() {
    const pagesUrl = (await prisma.adminSetting.findMany({
        where: {
            OR: [
                { key: 'privacyPolicy' },
                { key: "termAndCondition" },
                { key: 'youtube' },
                { key: 'facebook' },
                { key: 'twitter' },
                { key: 'linkedin' }
            ]
        },
        select: {
            key: true,
            value: true,
        }
    })).map((p) => (
        {
            key: p.key,
            href: p.value.includes('https') ? p.value : '/notfound',
        }
    ));

    return pagesUrl;
}

export async function getAllHomeProducts() {

    const [
        featuredProducts,
        dealsProducts,
        //partsAndAccessoirsProducts,
        allCategories,
    ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10, isRandom: true }),
        getDealsProducts({ page: 1, pageSize: 10, isRandom: true }),
        //getPartsAndAccessoirsProducts({ page: 1, pageSize: 10, isRandom: true }),
        getCategoriesHome(),
    ])

    const [
        wantedItems,
        businessesForSale,
        youtubeVideos,
        footerData,
    ] = await Promise.all([
        getWantedItems({ page: 1, pageSize: 10, isRandom: true }),
        getBusinesessForSale({ page: 1, pageSize: 10, isRandom: true }),
        getYoutubeVideos({ page: 1, pageSize: 10, isRandom: true }),
        getFooterData(),
    ])


    return {
        success: true,
        featuredProducts,
        dealsProducts,
        //partsAndAccessoirsProducts,
        allCategories,
        wantedItems,
        businessesForSale,
        youtubeVideos,
        footerData,
        //recentOrderCount,
    }
}


export async function getRecentOrdersCount() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return null;
    }

    try {
        // Count of unread orders where user is the seller
        /* const unreadSellerOrders = await prisma.orderItem.count({
            where: {
                sellerId: session.user.id,
                isReadSeller: false
            },
        }); */
        const unreadSellerOrders = await prisma.order.count({
            where: {
                orderItems: {
                    some: {
                        sellerId: session.user.id,
                        isReadSeller: false
                    }
                }

            },
        });

        // Count of unread orders where user is the buyer
        const unreadBuyerOrders = await prisma.order.count({
            where: {
                userId: session.user.id,
                orderItems: {
                    some: {
                        isReadBuyer: false
                    }
                }
            },
        });

        return {
            unreadSellerOrders,  // Orders where user is seller and items are unread
            unreadBuyerOrders    // Orders where user is buyer and has unread items
        };
    } catch (error) {
        console.error("Error fetching order counts:", error);
        return null;
    }
}

