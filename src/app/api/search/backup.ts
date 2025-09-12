import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = 1;
    const limit = 40;
    const query = searchParams.get('query');

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Build the query filter to search in products, categories, and subcategories
    const where: any = query ? {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { 
          category: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { 
                parent: {
                  name: { contains: query, mode: "insensitive" }
                }
              }
            ]
          }
        }
      ]
    } : {};

    // Fetch products with their category hierarchy
    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        title: true,
        slug: true,
        imagesUrl: true,
        price: true,
        discountPrice: true,
        isDealActive: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
                status: true
              }
            }
          }
        }
      }
    });

    // Format products with proper category hierarchy
    const formattedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      image: product.imagesUrl[0],
      price: product.price,
      discountPrice: product.discountPrice,
      isDealActive: product.isDealActive,
      href: `/products/${product.category?.parent?.slug || 'uncategorized'}/${product.category?.slug || 'uncategorized'}/${product.slug}`,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        href: `/products/${product.category?.parent?.slug || 'uncategorized'}/${product.category.slug}`,
        parent: product.category.parent ? {
          id: product.category.parent.id,
          name: product.category.parent.name,
          slug: product.category.parent.slug,
          href: `/products/${product.category.parent.slug}`
        } : null
      }
    }));

    // Get all unique categories (including parent categories)
    const allCategories = products.flatMap(product => {
      const categories = [];
      if (product.category) {
        categories.push({
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
          href: `/products/${product.category?.parent?.slug || 'uncategorized'}/${product.category.slug}`,
          parent: product.category.parent,
          isSubcategory: !!product.category.parent,
          hrefSubCateg : `/products/${product.category?.parent?.slug || 'uncategorized'}/${product.category.slug}`
        });
        
        if (product.category.parent) {
          categories.push({
            id: product.category.parent.id,
            name: product.category.parent.name,
            slug: product.category.parent.slug,
            href: `/products/${product.category.parent.slug}`,
            hrefCateg : `/products/${product.category?.parent?.slug || 'uncategorized'}`,
            parent: null,
            isSubcategory: false
          });
        }
      }
      return categories;
    });

    // Remove duplicate categories and count products
    const uniqueCategories = Array.from(new Map(
      allCategories.map(category => [category.id, category])
    ).values()).map(category => ({
      ...category,
      count: products.filter(p => 
        p.category.id === category.id || 
        (p.category.parent && p.category.parent.id === category.id)
      ).length
    }));

    return NextResponse.json({
      products: formattedProducts,
      categories: Array.from(uniqueCategories).filter(c => c.count > 0),
      meta: {
        page,
        limit,
        hasMore: products.length === take
      }
    });
     
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}