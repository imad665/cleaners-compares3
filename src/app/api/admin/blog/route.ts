import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Function to clean and normalize HTML content
function cleanHtmlContent(content: string): string {
    if (!content || typeof content !== 'string') {
        return '';
    }

    console.log('Original content type:', typeof content);
    console.log('Original content length:', content.length);
    console.log('First 200 chars of original:', content.substring(0, 200));

    // Remove JavaScript string concatenation artifacts
    let cleanedContent = content
        // Remove line continuation backslashes
        .replace(/\\\n/g, '')
        // Remove string concatenation operators
        .replace(/\s*\+\s*/g, '')
        // Remove extra whitespace and newlines
        .replace(/\s+/g, ' ')
        // Trim whitespace
        .trim();

    console.log('Cleaned content length:', cleanedContent.length);
    console.log('First 200 chars of cleaned:', cleanedContent.substring(0, 200));

    return cleanedContent;
}

// Function to validate if content is proper HTML
function isValidHtml(content: string): boolean {
    if (!content) return false;

    // Basic HTML validation - check for common HTML tags
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
    const hasProperStructure = content.includes('<div') || content.includes('<p>') || content.includes('<h1');

    return hasHtmlTags && hasProperStructure;
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            content,
            excerpt,
            featuredImage,
            images,
            status,
            category,
            tags,
            seoTitle,
            seoDescription
        } = body;

        console.log('=== DEBUG: RAW CONTENT ANALYSIS ===');
        console.log('Content type:', typeof content);
        console.log('Content length:', content?.length);
        console.log('Content sample:', content);
        console.log('Has newlines:', content?.includes('\n'));
        console.log('Has plus signs:', content?.includes('+'));
        console.log('=== END DEBUG ===');

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

        // Clean and validate the content
        const cleanedContent = cleanHtmlContent(content);

        if (!isValidHtml(cleanedContent)) {
            console.warn('Content may not be valid HTML:', cleanedContent.substring(0, 200));
            // You can choose to return an error or proceed with a warning
            // return NextResponse.json({ error: 'Invalid HTML content' }, { status: 400 });
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        console.log('=== DEBUG: FINAL CONTENT BEFORE SAVE ===');
        console.log('Cleaned content length:', cleanedContent.length);
        console.log('Cleaned content preview:', cleanedContent.substring(0, 200));
        console.log('=== END DEBUG ===');

        const blogPost = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content: cleanedContent, // Use cleaned content
                excerpt: excerpt || '',
                featuredImage: featuredImage || '',
                images: images || [],
                status: status || 'DRAFT',
                category: category || 'INDUSTRY_NEWS',
                tags: tags || [],
                seoTitle: seoTitle || '',
                seoDescription: seoDescription || '',
                authorId: session.user.id,
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
            },
        });

        console.log('=== DEBUG: SAVED CONTENT ===');
        console.log('Saved content length:', blogPost.content?.length);
        console.log('Saved content preview:', blogPost.content?.substring(0, 200));
        console.log('=== END DEBUG ===');

        return NextResponse.json(blogPost);
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                skip,
                take: limit,
                include: {
                    author: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.blogPost.count(),
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}