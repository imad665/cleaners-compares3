// src/app/api/admin/blog/test/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        /* const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        } */

        const { id } = await params;

        const post = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: post.id,
            title: post.title,
            contentLength: post.content.length,
            contentPreview: post.content.substring(0, 200),
            excerpt: post.excerpt,
            featuredImage: post.featuredImage,
            images: post.images,
            status: post.status,
            category: post.category,
            tags: post.tags,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        });
    } catch (error) {
        console.error('Error fetching test post:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}