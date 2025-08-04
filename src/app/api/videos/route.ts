import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Utility to extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop() || "";
  } catch {
    return "";
  }
}

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Define your category structure
    const categoryNames = [
      'Dry Cleaning Machines',
      'Laundry Machines',
      'Laundry Dryers',
      'Guide Videos',
      'Wet Cleaning Systems',
      'Company Profile Videos',
      'Flat Work Ironers',
      'Packaging / Folding',
      'Shirt Machines',
      'Laundry Installations',
    ];

    const slugify = (name: string) =>
      name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const categories = categoryNames.map(name => ({
      id: slugify(name),
      name,
      videos: [] as { id: string; title: string }[],
    }));

    // Group videos into their categories
    for (const video of videos) {
      const categoryName = video.category || "Uncategorized";
      const categoryId = slugify(categoryName);
      const videoId = extractYouTubeId(video.url);

      const matchingCategory = categories.find(cat => cat.id === categoryId);
      if (matchingCategory && videoId) {
        matchingCategory.videos.push({
          id: videoId,
          title: video.title,
        });
      }
    }

    return NextResponse.json(categories);
  } catch (e) {
    console.error("Failed to fetch videos", e);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
