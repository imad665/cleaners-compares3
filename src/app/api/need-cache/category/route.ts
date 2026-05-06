import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function getCategory(categoryslug: string) {
    const category = await prisma.category.findFirst({
        where: { slug: categoryslug },
        select: {
            id: true,
            name: true,
            slug: true,
            children: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    imageUrl: true,
                    slug: true,
                }
            }
        }
    });

    const isMachineOrParts = category?.slug === 'machines' || category?.slug === 'parts';
    const result = {
        id: category?.id,
        name: category?.name,
        slug: category?.slug,
        subCategories: category?.children.map((child) => ({
            id: child.id,
            desc: child.description,
            href:
                isMachineOrParts ?
                    `/products/${category.slug}/${child.slug}/new` :
                    `/products/${category.slug}/${child.slug}`,
            img: child.imageUrl,
            slug: child.slug,
            title: child.name,
        })),
        subCategoriesUsed: isMachineOrParts ? category?.children.map((child) => ({
            id: child.id,
            desc: child.description,
            href: `/products/${category.slug}/${child.slug}/used`,
            img: child.imageUrl,
            slug: child.slug,
            title: child.name,
        })) : undefined,

    }

    return result;
}
export async function GET(req: NextRequest) {
    const categoryslug = req.nextUrl.searchParams.get('categoryslug');

    if (!categoryslug) {
        return NextResponse.json({ error: 'Missing categoryslug' }, { status: 400 });
    }

    const category = await getCategory(categoryslug);

    return NextResponse.json({ category });
}