import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteCloudinaryFileByUrl } from '@/lib/cloudStorage';
 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {id} = await params

    const post = await prisma.blogPost.findUnique({
      where: { id: id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const {id} = await params;
/* title: post.title,
          excerpt: post.excerpt,
          status: newStatus,
          category: post.category,
          tags: post.tags, */
    const body = await request.json();
    const { 
      title, 
      excerpt, 
      status, 
      category, 
      tags, 
    
    } = body;

    // Validate category is a valid enum value
    const validCategories = [
      'INDUSTRY_NEWS',
      'PRODUCT_REVIEWS', 
      'MAINTENANCE_TIPS',
      'BUSINESS_ADVICE',
      'TECHNOLOGY',
      'SUSTAINABILITY'
    ];

    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let slug = existingPost.slug;
    if (title !== existingPost.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        status: status || 'DRAFT',
        category: category || 'INDUSTRY_NEWS',
        tags: tags || [],
        publishedAt: status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' 
          ? new Date() 
          : existingPost.publishedAt,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const {id} = await params;

    const post = await prisma.blogPost.delete({
      where: { id },
      select:{
        featuredImage:true,
        images:true
      }
    });
    let isFeaturedImage = false;
    for (const image of post.images) {
      if(!isFeaturedImage && post.featuredImage === image){
        isFeaturedImage=true;
      }
      await deleteCloudinaryFileByUrl(image);
    }

    console.log({post,isFeaturedImage},'eeeeeeeeeeeeeeeeeeeeeeee');
    

    if(!isFeaturedImage && post.featuredImage){
      await deleteCloudinaryFileByUrl(post.featuredImage);
    }



    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}