import { authOptions } from "@/lib/auth";
import { decryptPassword } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user.role === 'ADMIN'))
            return NextResponse.json({ success: 'false' }, { status: 404 })

        const rawUsers = await prisma.user.findMany(
            {
                include: {
                    _count: {
                        select: {
                            products: true,
                            wantedItems: true,
                            BusinessForSale: true,

                        },
                    },
                    sellerProfile: true,
                }
            }
        );

        const users = rawUsers
            .sort((a, b) => {
                // Put ADMINs first
                if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
                if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;

                // Same role: sort by createdAt descending
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            /* {
                  businessName: 'Tech World',
                  phoneNumber: '+212 600-123456',
                  country: 'Morocco',
                  postCode: '40000',
                  email: 'seller@example.com',
                  password: 'supersecurepassword',
                  productCount: 24,
                  wantedCount: 8,
                  businessForSaleCount: 3,
                } */
            .map((user) => {
                const createdAt = user.createdAt;
                const referenceDate = new Date("2025-10-07");
                const isGreat = new Date(createdAt) >= referenceDate;
                const password = isGreat && user.password ? decryptPassword(user.password) : user.password

                return (
                    {
                        id: user.id,
                        name: user.name,
                        role: user.role.toLocaleLowerCase(),
                        status: user.status.toLocaleLowerCase(),
                        isSignIn: user.isSigninSuccess,
                        password: password || 'Signed in with Google',
                        products_count: user._count.products,
                        wantedItems_count: user._count.wantedItems,
                        BusinessForSale_count: user._count.BusinessForSale,
                        sellerProfile: {
                            businessName: user.sellerProfile?.businessName,
                            phoneNumber: user.sellerProfile?.phoneNumber,
                            address: user.sellerProfile?.city,
                            postCode: user.sellerProfile?.country,
                            productCount: user._count.products,
                            wantedCount: user._count.wantedItems,
                            businessForSaleCount: user._count.BusinessForSale
                        },
                        joined: user.createdAt.toISOString().split('T')[0],
                        lastLogin: user.lastLogin.toISOString().split('T')[0],
                        email: user.email,
                    }
                )
            });

        return NextResponse.json({ success: true, users }, { status: 200 });

    } catch (error) {
        console.error('Failed to fetch users:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest) {
    try {
        const { id, status } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { status }
        })
        //console.log(updatedUser,';;;;;;;;;;;;;llll,,,,,,,');

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        const deletedUser = await prisma.user.delete({
            where: { id },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}