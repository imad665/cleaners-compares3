 
import { authOptions } from "@/lib/auth";
import { deleteCloudinaryFileByUrl } from "@/lib/cloudStorage";
import { getCategories } from "@/lib/functions";
import { prisma } from "@/lib/prisma";
import { updateExpiredAndDealsProducts } from "@/lib/updateExpiredProducts";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

/*
{
        id: 10,
        name: 'Spot Cleaning Gun',
            category: 'Sundries',
            subcategory: 'Cleaning Tools',
            price: '$75',
            status: 'Low Stock',
            featured: false,
            date: '2023-04-18',
            stock: 3
    },*/

export async function GET(req: NextRequest) {
    try {

        await updateExpiredAndDealsProducts() // 🔄 Auto-clean expired features/deals

        const session = await getServerSession(authOptions);
        if(!session || !session.user) redirect('/auth/signin'); 
        const user = session.user;
          
        const products = (await prisma.product.findMany({
            where:{
                sellerId:user.id
            },
            orderBy:{
                createdAt:'desc'
            },
            select: {
                id: true,
                title: true,
                price: true,
                status: true,
                isFeatured: true,
                units: true,
                createdAt: true,
                description: true,
                condition: true,
                imagesUrl: true,
                videoUrl: true,
                discountPercentage: true,
                discountPrice: true,
                dealEndDate: true,
                featuredEndDate: true,
                isDealActive:true,
                weight: true,
                featureDays: true,
                stock: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        parent: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        }))?.map((p) => (
            {
                id: p.id,
                name: p.title,
                category: p.category?.parent?.name,
                subcategory: p.category?.name,
                price: p.price,
                status: p.status,
                featured: p.isFeatured,
                stock: p.units,
                date: p.createdAt.toISOString().split('T')[0],
                stockCount: p.stock,
                description: p.description,
                condition: p.condition,
                imagesUrl: p.imagesUrl,
                videoUrl: p.videoUrl,
                isDealActive:p.isDealActive,
                discountPercentage: p.discountPercentage,
                discountPrice: p.discountPrice,
                dealEndDateFormate:p.dealEndDate?.toISOString().split('T')[0],
                dealEndDate: p.dealEndDate
                ?new Date(p.dealEndDate).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
                : null,
                featuredEndDate: p.featuredEndDate
                    ? new Date(p.featuredEndDate).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })
                    : null,
                subCategoryId: p.category?.id,
                weight: p.weight,
                featureDays: p.featureDays,

            }
        ));
        const categories = await getCategories();

        return NextResponse.json({ success: true, products, categories }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: "can't fetch products" }, { status: 500 });
    }
}


async function getSellerId() {
    const session = await getServerSession(authOptions);
    return session && session.user && (session.user.role === 'SELLER' || session.user.role === 'ADMIN') && session.user.id;

}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
        const sellerId = await getSellerId();
        if (!sellerId) return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
        const deletedProduct = await prisma.product.delete({
            where: { id, sellerId },
            select: {
                imagesUrl: true,
                videoUrl: true,
            }
        });
        deletedProduct.imagesUrl.forEach(async (url) => {
            await deleteCloudinaryFileByUrl(url);
        });
        if (deletedProduct.videoUrl) {
            deleteCloudinaryFileByUrl(deletedProduct.videoUrl);
        }


        return NextResponse.json({ success: true, message: 'product deleted successfuly' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'failed to delete product' }, { status: 500 })
    }
}