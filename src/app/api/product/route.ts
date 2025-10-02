import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { getDealCountdown } from '@/lib/products/homeProducts';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const catSlug = searchParams.get("catSlug");
        const subSlug = searchParams.get("subSlug");
        const pSlug = searchParams.get("pSlug");

        if (!catSlug || !subSlug || !pSlug) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const product = await prisma.product.findFirst({
            where: {
                slug: pSlug,
                category: {
                    slug: subSlug,
                    parent: {
                        slug: catSlug
                    }
                }
            },
            include: {
                category: {
                    include: {
                        parent: true // for subcategory name
                    }
                },
                ratings: {
                    include: {
                        user: true
                    }
                },
                seller:{
                    select:{
                        email:true,

                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const avgRating =
            product.ratings.length > 0
                ? product.ratings.reduce((sum, r) => sum + r.stars, 0) / product.ratings.length
                : 0;

        const transformedProduct = {
            id: product.id,
            name: product.title,
            description: product.description,
            category: product.category?.parent?.name || 'Unknown',
            subcategory: product.category?.name || 'Unknown',
            rating: Number(avgRating.toFixed(1)),
            reviews: product.ratings.length,
            isNew: new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // new if added in last 7 days
            isSale: !!product.discountPrice || !!product.discountPercentage,
            videoUrl: product.videoUrl || null,
            images: product.imagesUrl,
            isFeatured: product.isFeatured,
            units: product.units,
            unitPrice: (!product.isDealActive ? product.price : (product.discountPrice || productp.price)) / (product.units || 1),
            priceExcVat: !product.isDealActive ? product.price : product.discountPrice,
            price: product.price,
            stock:product.stock,
            dealCountdown: product.isDealActive ? getDealCountdown(product.dealEndDate) : null,
            sellerEmail:product.seller?.email,
            isIncVAT:product.isIncVAT,
            isOldProduct:false//new Date(product.createdAt)<new Date('2025-07-18')
        };

        const reviews = product.ratings.map((r) => ({
            id: r.id,
            userName: r.user.name || "Anonymous",
            rating: r.stars,
            title: r.comment?.split(' ').slice(0, 6).join(' ') || 'Review',
            comment: r.comment || '',
            date: format(new Date(r.createdAt), 'yyyy-MM-dd'),
            helpfulCount: Math.floor(Math.random() * 50), // placeholder, replace with real value if stored
            verifiedPurchase: true // assuming all are verified, else add logic
        }));

        return NextResponse.json({ product: transformedProduct, reviews });

    } catch (error) {
        console.error("Product fetch error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
