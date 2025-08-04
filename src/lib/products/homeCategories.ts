import { prisma } from "../prisma";



export async function getCategoriesHome() {
    const categories = await prisma.category.findMany({
        where: { parentId: null },
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

    // Modify categories to duplicate "machines" and "parts"
    const duplicatedCategories = categories.map((c) => {
        // Prepare the subcategories for duplication if the category name is "machines" or "parts"
        let subCategories = c.children.map((sub) => ({
            id: sub.id,
            title: sub.name,
            desc: sub.description,
            img: sub.imageUrl,
            slug: sub.slug
        }));

        if (c.name.toLowerCase() === 'machines') {
            // Create duplicated categories for "machines"
            return [
                {
                    name: 'newMachines',
                    subCategories: subCategories.map((s) => (
                        { ...s, href: `products/${c.slug}/${s.slug}/new` }
                    )),
                },
                {
                    name: 'usedMachines',
                    subCategories: subCategories.map((s) => (
                        { ...s, href: `products/${c.slug}/${s.slug}/used` }
                    )),
                }
            ];
        }

        if (c.name.toLowerCase() === 'parts') {
            // Create duplicated categories for "parts"
            return [
                {
                    name: 'newParts',
                    subCategories: subCategories.map((s) => (
                        { ...s, href: `products/${c.slug}/${s.slug}/new` }
                    )),
                },
                {
                    name: 'usedParts',
                    subCategories: subCategories.map((s) => (
                        { ...s, href: `products/${c.slug}/${s.slug}/used` }
                    )),
                }
            ];
        }

        // For other categories, return as they are
        return {
            name: c.name,
            subCategories: subCategories.map((s) => (
                { ...s, href: `products/${c.slug}/${s.slug}` }
            )),
        };
    });
    const c = duplicatedCategories.flat();

    c.push({
        name: "Engineers",
        subCategories: [
            {
                id: '123',
                title: 'Laundry',
                desc: 'Professional laundry services',
                href: '/engineers/Laundry',
                img: '/uploads/service3/service0.jpeg',
                slug: 'Laundry'
            },
            {
                id: '124',
                title: 'Finishing',
                desc: 'Expert finishing solutions',
                href: '/engineers/Finishing',
                img: '/uploads/service3/service.webp',
                slug: 'Finishing'
            },
            {
                id: '125',
                title: 'Dry Cleaning',
                desc: 'High-quality dry cleaning',
                href: '/engineers/Dry-Cleaning',
                img: '/uploads/service3/service2.jpeg',
                slug: 'Dry-Cleaning'
            },
        ]
    })
    // Flatten the array to ensure it's a single level array (no nested arrays)
    return c;
}
