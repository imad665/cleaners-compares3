import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const getChange = (current: number, last: number) => {
    if (last === 0) return current > 0 ? 100 : 0;
    return +(((current - last) / last) * 100).toFixed(2);
};

async function getProductsStats() {
    const now = new Date();
    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);
    const lastStart = startOfMonth(subMonths(now, 1));
    const lastEnd = endOfMonth(subMonths(now, 1));

    const current = await prisma.product.count({
        where: {
            createdAt: { gte: currentStart, lte: currentEnd },
        },
    });

    const last = await prisma.product.count({
        where: {
            createdAt: { gte: lastStart, lte: lastEnd },
        },
    });

    return {
        total: current,
        change: getChange(current, last),
    };
}
async function getUsersStats() {
    const now = new Date();
    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);
    const lastStart = startOfMonth(subMonths(now, 1));
    const lastEnd = endOfMonth(subMonths(now, 1));

    const current = await prisma.user.count({
        where: {
            createdAt: { gte: currentStart, lte: currentEnd },
        },
    });

    const last = await prisma.user.count({
        where: {
            createdAt: { gte: lastStart, lte: lastEnd },
        },
    });

    return {
        total: current,
        change: getChange(current, last),
    };
}

async function getRevenueStats() {
    const now = new Date();
    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);
    const lastStart = startOfMonth(subMonths(now, 1));
    const lastEnd = endOfMonth(subMonths(now, 1));

    const currentData = await prisma.order.findMany({
        where: {
            createdAt: { gte: currentStart, lte: currentEnd },
        },
        select: { totalPrice: true },
    });

    const lastData = await prisma.order.findMany({
        where: {
            createdAt: { gte: lastStart, lte: lastEnd },
        },
        select: { totalPrice: true },
    });

    const current = currentData.reduce((sum, o) => sum + o.totalPrice, 0);
    const last = lastData.reduce((sum, o) => sum + o.totalPrice, 0);

    return {
        total: current,
        change: getChange(current, last),
    };
}
async function getNewListingsStats() {
    // Assuming it's also based on products created this month
    return await getProductsStats();
}




export async function GET() {
    try {

        const session = await getServerSession(authOptions);
        if (!session || !session.user) redirect('/auth/signin');
        const user = session.user; 
        const sellerId = user.id;
        
        const where = user.role === 'ADMIN'?{}:{sellerId}

        const [totalProducts, totalUsers, totalRevenue, newListings] = await Promise.all([
            prisma.product.count({where:where}),
            prisma.user.count(),
            prisma.order.aggregate({
                _sum: {
                    totalPrice: true,
                },
            }),
            prisma.product.count({
                where: {
                    sellerId,
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                    },
                },
            }),

        ]);

        // Monthly Revenue - last 6 months
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const monthlyRevenueRaw = await prisma.$queryRaw<
            {
                month: number;
                year: number;
                total: number;
            }[]
        >`
      SELECT
        EXTRACT(MONTH FROM "createdAt") AS month,
        EXTRACT(YEAR FROM "createdAt") AS year,
        SUM("totalPrice") AS total
      FROM "Order"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY month, year
      ORDER BY year, month
    `;

        // Popular categories by product count (top 5)
        const popularCategories = await prisma.category.findMany({
            orderBy: {
                products: {
                    _count: "desc",
                },
            },
            take: 5,
            select: {
                id: true,
                name: true,

                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        const recentProducts = (await prisma.product.findMany({
            where:{sellerId},
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            select: {
                id:true,
                title: true,
                price: true,
                createdAt: true,
                discountPrice: true,
                isDealActive: true,
                category: {
                    select: {
                        name: true,
                        parent: {
                            select: {
                                name: true
                            }
                        }
                    },
                },
            },
        })).map((p) => ({
            name: p.title,
            category: p.category.name,
            parent: p.category.parent.name,
            discountPrice: !p.isDealActive ? p.price : p.discountPrice,
            price: p.price,
            isDealActive: p.isDealActive,
            date: p.createdAt,
            id:p.id,

        }));

        const [products, users, revenue, listings] = await Promise.all([
            getProductsStats(),
            getUsersStats(),
            getRevenueStats(),
            getNewListingsStats(),
        ])

        return NextResponse.json({
            totalProducts,
            totalUsers,
            totalRevenue: totalRevenue._sum.totalPrice ?? 0,
            newListings,
            monthlyRevenue: monthlyRevenueRaw,
            popularCategories,
            recentProducts,
            percentChanges: {
                products: products.change,
                users: users.change,
                revenue: revenue.change,
                listings: listings.change,
            }
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
