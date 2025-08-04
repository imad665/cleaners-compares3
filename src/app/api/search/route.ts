import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import to where your prisma instance is located

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters (for example: search query, page, limit)
    const { searchParams } = req.nextUrl;
    const page=1
    const limit=10;
    const query=searchParams.get('query')
    //console.log(query,page,limit,';;;;;;fffff;;;;;;;',req.nextUrl.searchParams);
    
    // Calculate pagination values
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Build the query filter based on the search parameter
    const where: any = query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive", // Case insensitive search
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive", // Case insensitive search
              },
            },
            {
              category: {
                name: {
                  contains: query,
                  mode: "insensitive", // Case insensitive search
                },
              },
            },
          ],
        }
      : {}; // If no search, return all products
    
      
    // Query the database
    const products = (await prisma.product.findMany({
      where,
      skip,
      take,
      select:{
        id:true,
        title:true,
        slug:true,
        category:{
          select:{
            name:true,
            slug:true,
            parent:{
              select:{slug:true}
            }
          }
        }
      }
    })).map((p)=>(
      {
        id:p.id,
        title:p.title,
        href: `/products/${p.category?.parent?.slug}/${p.category?.slug}/${p.slug}`,
        category:p.category
      }
    ));

    // Return the products in the response
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}
