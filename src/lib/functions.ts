import { getServerSession } from "next-auth";
import { prisma } from "./prisma";
import { authOptions } from "./auth";

export async function getSellerProfile() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) return null
    const sellerProfile = await prisma.sellerProfile.findUnique({
        where: {
            userId: user.id
        },
        select: {
            businessName: true,
            phoneNumber: true,
            city: true,
            country: true,
            id: true,
        }
    })
    return {
        sellerProfile: {
            businessName: sellerProfile?.businessName,
            phoneNumber: sellerProfile?.phoneNumber,
            address: sellerProfile?.city,
            postCode: sellerProfile?.country
        },
        id:sellerProfile?.id
    }

}

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                parentId: null,
                status: {
                    not: 'DELETING'
                }
            },
            select: {
                name: true,
                children: {
                    where: {
                        status: {
                            not: 'DELETING'
                        }
                    },
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });
        return categories || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}