import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stars, comment, productId } = body;
    const sessions = await getServerSession(authOptions); 
    if(!sessions || !sessions.user) return NextResponse.json({error:'-1'},{status:400});

    const user = sessions.user;
    const userId = user.id;

    // Validate input
    if (!productId || !stars || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (stars < 1 || stars > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    // Prevent duplicate reviews from same user
    const existingReview = await prisma.rating.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product." }, { status: 400 });
    }

    // Create new rating
    const newRating = await prisma.rating.create({
      data: {
        userId,
        productId,
        stars,
        comment
      } 
    });

    return NextResponse.json({ success: true, rating: newRating }, { status: 201 });

  } catch (error) {
    console.error("[POST_REVIEW_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
