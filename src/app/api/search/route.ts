import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { excludeSuspendedSeller, getDealCountdown } from "@/lib/products/homeProducts";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = 1;
    const limit = 40;
    const query = searchParams.get('query');
    const isInsearch = searchParams.get('isInsearch');

    // If no query, return all products with pagination
    if (!query) {
      return await getAllProducts(page, limit);
    }

    // Use our custom exact word search implementation
    return await getExactWordSearchProducts(query, isInsearch, page, limit);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}

// Exact word search implementation
function exactWordSearch(query: string, documents: any[], k: number = 10) {
  if (!query.trim() || documents.length === 0) return [];

  // Split query into words and filter out short words
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  if (queryWords.length === 0) return [];

  // Create regex patterns for exact word matching (word boundaries)
  const wordPatterns = queryWords.map(word =>
    new RegExp(`\\b${word}\\b`, 'gi')
  );

  // Score documents based on exact word matches
  const scoredDocuments = documents.map(doc => {
    const content = doc.pageContent.toLowerCase();
    let score = 0;
    let matches = 0;

    for (const pattern of wordPatterns) {
      const wordMatches = (content.match(pattern) || []).length;
      if (wordMatches > 0) {
        matches++;
        score += wordMatches * 2; // Higher weight for exact matches
      }
    }

    // Bonus for matching all query words
    if (matches === queryWords.length) {
      score += 10;
    }

    // Bonus for title matches (exact word in title)
    const title = doc.metadata.title.toLowerCase();
    for (const pattern of wordPatterns) {
      const titleMatches = (title.match(pattern) || []).length;
      score += titleMatches * 3; // Even higher weight for title matches
    }

    return { ...doc, score };
  });

  // Filter out documents with no matches and sort by score
  return scoredDocuments
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

// Function to get products using exact word search
async function getExactWordSearchProducts(query: string, isInsearch: string | null, page: number, limit: number) {
  try {
    // Fetch all products for search indexing
    const allProducts = await prisma.product.findMany({
      where:{...excludeSuspendedSeller},
      select: {
        id: true,
        title: true,
        description: true,
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

    if (allProducts.length === 0) {
      return NextResponse.json({
        products: [],
        categories: [],
        meta: { page, limit, hasMore: false }
      });
    }

    // Prepare documents for search
    const documents = allProducts.map((product) => ({
      pageContent: `${product.title} ${product.description || ''} ${product.category?.name || ''} ${product.category?.parent?.name || ''}`.toLowerCase(),
      metadata: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        imagesUrl: product.imagesUrl,
        price: product.price,
        discountPrice: product.discountPrice,
        isDealActive: product.isDealActive,
        category: product.category
      }
    }));

    // Use our exact word search implementation
    const results = exactWordSearch(query, documents, 100);

    // Extract product IDs from search results
    const productIds = results
      .filter((r) => r && r.metadata && r.metadata.id)
      .map((r) => r.metadata.id);

    // Remove duplicates
    const uniqueProductIds = Array.from(new Set(productIds));

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedProductIds = uniqueProductIds.slice(skip, skip + limit);

    // Fetch complete product details for the paginated IDs
    const products = await prisma.product.findMany({
      where: {
        ...excludeSuspendedSeller,
        id: { in: paginatedProductIds }
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
        createdAt: true,
        stock: true,
        ratings: {
          select: {
            stars: true,
          }
        },
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

    // Preserve the order from search results
    const orderedProducts = paginatedProductIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    const formattedProducts = formatProducts(orderedProducts);
    const categories = extractCategories(orderedProducts, isInsearch);

    return NextResponse.json({
      products: formattedProducts,
      categories: categories || [],
      meta: {
        page,
        limit,
        hasMore: uniqueProductIds.length > skip + limit,
        total: uniqueProductIds.length
      }
    });

  } catch (error) {
    console.error("Error in exact word search:", error);
    // Fallback to simple text search if exact search fails
    return await getTextSearchProducts(query, isInsearch, page, limit);
  }
}

// Function to get all products with pagination (when no query)
async function getAllProducts(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const take = limit;

  const products = await prisma.product.findMany({
    where:excludeSuspendedSeller,
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

  const formattedProducts = formatProducts(products);
  const categories = extractCategories(products, isInsearch);

  return NextResponse.json({
    products: formattedProducts,
    categories,
    meta: {
      page,
      limit,
      hasMore: products.length === take
    }
  });
}

// Fallback text search function (using exact word matching)
async function getTextSearchProducts(query: string, isInsearch: any, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const take = limit;

  // Split query into words for exact matching
  const queryWords = query.split(/\s+/).filter(word => word.length > 2);

  // Create exact word search conditions
  const exactMatchConditions = queryWords.flatMap(word => [
    { title: { contains: ` ${word} `, mode: "insensitive" } }, // Word surrounded by spaces
    { title: { startsWith: `${word} `, mode: "insensitive" } }, // Word at start
    { title: { endsWith: ` ${word}`, mode: "insensitive" } },   // Word at end
    { description: { contains: ` ${word} `, mode: "insensitive" } },
    { description: { startsWith: `${word} `, mode: "insensitive" } },
    { description: { endsWith: ` ${word}`, mode: "insensitive" } },
    {
      category: {
        OR: [
          { name: { contains: ` ${word} `, mode: "insensitive" } },
          { name: { startsWith: `${word} `, mode: "insensitive" } },
          { name: { endsWith: ` ${word}`, mode: "insensitive" } },
          {
            parent: {
              OR: [
                { name: { contains: ` ${word} `, mode: "insensitive" } },
                { name: { startsWith: `${word} `, mode: "insensitive" } },
                { name: { endsWith: ` ${word}`, mode: "insensitive" } }
              ]
            }
          }
        ]
      }
    }
  ]);

  const products = await prisma.product.findMany({
    where: {
      OR: exactMatchConditions,
      ...excludeSuspendedSeller,
    },
    skip,
    take,
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
    },
    include: {

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
      },
      ratings: true
    }
  });

  const formattedProducts = formatProducts(products);
  const categories = extractCategories(products, isInsearch);

  return NextResponse.json({
    products: formattedProducts,
    categories: categories || [],
    meta: {
      page,
      limit,
      hasMore: products.length === take
    }
  });
}

// Helper function to format products
function formatProducts(products: any[]) {
  return products.map(product => {
    const p = product;
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

      stars: p.ratings?.reduce((sum, item) => (sum + item.stars), 0) / p.ratings?.length,
      starsCount: p.ratings?.length,
      units: p.units,
      productId:p.id,
      unitPrice: ((!isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1)),
      priceExcVat: !isDealActive ? p.price : p.discountPrice,
      price: p.price,
      dealEndDate: p.dealEndDate,
      dealCountdown: isDealActive ? getDealCountdown(p.dealEndDate) : null,
      image: p.imagesUrl[0],
      stock: p.stock,
      title: p.title,
      isOldProduct: new Date(p.createdAt) < new Date('2025-07-18'),
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
      href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
      parent: product.category.parent,
      isSubcategory: !!product.category.parent,
      hrefSubCateg: `/products/${product.category?.parent?.slug || 'uncategorized'}/${product.category.slug}`,
      
      discountPrice: product.discountPrice,
      isDealActive: product.isDealActive,
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
    }
  });
}

// Helper function to extract categories
function extractCategories(products: any[], isInsearch: any) {
  //console.log(products?.[1], 'dddddddddddddddddddddddddddd');

  const allCategories = products.flatMap(product => {
    const categories = [];
    if (product.category) {
      const p = product;
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
      categories.push({
        productId: p.id,

        stars: p.ratings?.reduce((sum, item) => (sum + item.stars), 0) / p.ratings?.length,
        starsCount: p.ratings?.length,
        units: p.units,
        unitPrice: ((!isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1)),
        priceExcVat: !isDealActive ? p.price : p.discountPrice,
        price: p.price,
        dealEndDate: p.dealEndDate,
        dealCountdown: isDealActive ? getDealCountdown(p.dealEndDate) : null,
        image: p.imagesUrl[0],
        stock: p.stock,
        title: p.title,
        isOldProduct: new Date(p.createdAt) < new Date('2025-07-18'),

        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        href: isInsearch ? `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}` :
          `/products/${product.category?.parent?.slug || 'uncategorized'}/${product.category.slug}`,
        parent: product.category.parent,
        isSubcategory: !!product.category.parent,
        hrefSubCateg: `/products/${product.category?.parent?.slug || 'uncategorized'}/${product.category.slug}`
      });

      if (product.category.parent && !isInsearch) {
        categories.push({
          id: product.category.parent.id,
          name: product.category.parent.name,
          slug: product.category.parent.slug,
          href: `/products/${product.category.parent.slug}`,
          hrefCateg: `/products/${product.category?.parent?.slug || 'uncategorized'}`,
          parent: null,
          isSubcategory: false
        });
      }
    }
    return categories;
  });

  // Remove duplicate categories and count products
  return Array.from(new Map(
    allCategories.map(category => [category.id, category])
  ).values()).map(category => ({
    ...category,
    count: products.filter(p =>
      p.category.id === category.id ||
      (p.category.parent && p.category.parent.id === category.id)
    ).length
  })).filter(c => c.count > 0);
}