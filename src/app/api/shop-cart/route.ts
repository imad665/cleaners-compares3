import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust the path if needed
import { truncateSync } from 'node:fs';
import { getDealCountdown, getFeaturedProducts, getFooterData, getRecentOrdersCount } from '@/lib/products/homeProducts';
import { getNotifications } from '@/lib/payement/get-notification-for-icon';
import getDelveryChargeFromWight from '@/lib/delivery_charge_from_weight';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }
        const ep = body.filter((p) => p.productId.length > 8);
        const productIds = ep.map(item => item.productId);
        console.log(productIds, ';;;;;;;;;;;;;;;;;;;;;;;;;');
        `id: 'ord-001',
    productName: 'Eco-Friendly All-Purpose Cleaner',
    productImage: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg',
    sellerName: 'GreenClean Co.',
    sellerAvatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
    sellerRating: 4.8,
   
    price: 12.99,
    description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem rem ullam obcaecati ad ipsum amet distinctio cumque odio voluptatem quo, enim voluptates minima! Voluptatem porro neque eveniet et officia rerum!',
    hasConversation: true`
        const products = (await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                }
            },
            include: {
                seller: true,
                ratings: true,
                category: {
                    include: { parent: true }
                },

            }

        })).map((p) => ({
            productId: p.id,
            href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
            stars: p.ratings.reduce((sum, item) => (sum + item.stars), 0) / p.ratings.length,
            starsCount: p.ratings.length,
            units: p.units,
            unitPrice: (!p.isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1),
            priceExcVat: !p.isDealActive ? p.price : p.discountPrice,
            price: p.price,
            dealEndDate: p.dealEndDate,
            dealCountdown: p.isDealActive ? getDealCountdown(p.dealEndDate) : null,
            image: p.imagesUrl[0],
            stock: p.stock,
            title: p.title,
            sellerName: p.seller?.name,
            sellerAvatar: p.seller?.image,
            sellerId: p.seller?.id,
            description: p.description,
            sellerEmail: p.seller?.email,
            isIncVAT: p.isIncVAT,
            delivery_charge:p.delivery_charge? p.delivery_charge: getDelveryChargeFromWight(p.weight || 0),
            
            isOldProduct: false//new Date(p.createdAt) < new Date('2025-07-18')    

        }));
        const [
            featuredProducts,
            footerData,
        ] = await Promise.all([
            getFeaturedProducts({ page: 1, pageSize: 10 }),
            getFooterData(),
        ]);
        const recentOrderCount = await getRecentOrdersCount();
        const messages = await getNotifications();
        return NextResponse.json({ products, featuredProducts, footerData, messages, recentOrderCount }, { status: 200 });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
