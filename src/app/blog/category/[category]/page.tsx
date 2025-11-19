import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
 

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const categoryMap: { [key: string]: string } = {
  'industry-news': 'INDUSTRY_NEWS',
  'product-reviews': 'PRODUCT_REVIEWS',
  'maintenance-tips': 'MAINTENANCE_TIPS',
  'business-advice': 'BUSINESS_ADVICE',
  'technology': 'TECHNOLOGY',
  'sustainability': 'SUSTAINABILITY',
};

async function getCategoryPosts(category: string) {
  const mappedCategory = categoryMap[category.toLowerCase()];
  
  if (!mappedCategory) {
    return [];
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        category: mappedCategory,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return posts;
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

function getCategoryDisplayName(category: string) {
  const mappedCategory = categoryMap[category.toLowerCase()];
  return mappedCategory ? mappedCategory.replace('_', ' ') : 'Unknown Category';
}

function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    INDUSTRY_NEWS: 'bg-blue-100 text-blue-800',
    PRODUCT_REVIEWS: 'bg-green-100 text-green-800',
    MAINTENANCE_TIPS: 'bg-yellow-100 text-yellow-800',
    BUSINESS_ADVICE: 'bg-purple-100 text-purple-800',
    TECHNOLOGY: 'bg-red-100 text-red-800',
    SUSTAINABILITY: 'bg-teal-100 text-teal-800',
  };
  
  const mappedCategory = categoryMap[category.toLowerCase()];
  return colors[mappedCategory || ''] || 'bg-gray-100 text-gray-800';
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = getCategoryDisplayName(params.category);
  
  return {
    title: `${categoryName} - Blog`,
    description: `Browse all ${categoryName.toLowerCase()} articles and insights about commercial laundry and dry cleaning equipment.`,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const posts = await getCategoryPosts(params.category);
  const categoryName = getCategoryDisplayName(params.category);

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/blog">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft size={16} className="mr-2" />
                Back to Blog
              </Button>
            </Link>
            
            <Badge className={`${getCategoryColor(params.category)} text-lg mb-4`}>
              {categoryName}
            </Badge>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Articles Found
            </h1>
            <p className="text-gray-600 mb-8">
              There are no {categoryName.toLowerCase()} articles published yet.
            </p>
            
            <Link href="/blog">
              <Button>
                Browse All Articles
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft size={16} className="mr-2" />
                Back to Blog
              </Button>
            </Link>
            
            <div className="text-center">
              <Badge className={`${getCategoryColor(params.category)} text-lg mb-4`}>
                {categoryName}
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {categoryName} Articles
              </h1>
              <p className="text-xl text-gray-600">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'} about {categoryName.toLowerCase()} in the cleaning industry
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardHeader className="flex-1">
                <CardTitle className="text-xl font-bold mb-2 line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {post.author.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`} className="block">
                  <Button variant="outline" className="w-full">
                    Read Article
                    <ArrowRight size={14} className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}