import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
 
 
// GET: Fetch all videos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch videos.' }, { status: 500 });
  }
}

// POST: Add a new video
export async function POST(req: Request) {
  try {
    const { title, url, description, thumbnail,category } = await req.json();

    const video = await prisma.video.create({
      data: {
        title,
        url,
        description,
        thumbnail,
        category
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add video.' }, { status: 500 });
  }
}



export async function DELETE(req:NextRequest) {
  const { id } = await req.json();

  try {
    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete video' }, { status: 500 });
  }
}
