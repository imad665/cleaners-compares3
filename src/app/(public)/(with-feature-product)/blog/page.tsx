import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
 

export const metadata: Metadata = {
  title: 'Blog - Industry Insights & News',
  description: 'Latest articles, news, and insights about laundry, dry cleaning, and commercial cleaning equipment industry.',
};

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
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
      take: 12,
    });

    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getCategoryColor(category: string | null) {
  const colors: { [key: string]: string } = {
    INDUSTRY_NEWS: 'bg-blue-100 text-blue-800',
    PRODUCT_REVIEWS: 'bg-green-100 text-green-800',
    MAINTENANCE_TIPS: 'bg-yellow-100 text-yellow-800',
    BUSINESS_ADVICE: 'bg-purple-100 text-purple-800',
    TECHNOLOGY: 'bg-red-100 text-red-800',
    SUSTAINABILITY: 'bg-teal-100 text-teal-800',
  };
  return colors[category || ''] || 'bg-gray-100 text-gray-800';
}

function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Industry Insights & News
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Stay updated with the latest trends, innovations, and best practices 
              in the commercial laundry and dry cleaning industry.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['INDUSTRY_NEWS', 'PRODUCT_REVIEWS', 'MAINTENANCE_TIPS', 'BUSINESS_ADVICE'].map(category => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className={getCategoryColor(category)}
                >
                  {category.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Calendar size={64} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Blog Posts Yet
            </h2>
            <p className="text-gray-500">
              Check back soon for industry insights and updates.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post (First post) */}
            {posts.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {posts[0].featuredImage && (
                      <div className="lg:order-2">
                        <img
                          src={posts[0].featuredImage}
                          alt={posts[0].title}
                          className="w-48 h-auto lg:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-8 lg:order-1">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge className={getCategoryColor(posts[0].category)}>
                          {posts[0].category?.replace('_', ' ') || 'Uncategorized'}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} />
                          {getReadingTime(posts[0].content)}
                        </div>
                      </div>
                      <CardTitle className="text-2xl lg:text-3xl font-bold mb-4">
                        {posts[0].title}
                      </CardTitle>
                      <CardDescription className="text-lg mb-6 line-clamp-3">
                        {posts[0].excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {posts[0].author.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(posts[0].publishedAt || posts[0].createdAt)}
                          </div>
                        </div>
                        <Link href={`/blog/${posts[0].slug}`}>
                          <Button>
                            Read More
                            <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Recent Posts Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(1).map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardHeader className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category?.replace('_', ' ') || 'Uncategorized'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          {getReadingTime(post.content)}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold mb-2 line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {post.author.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="block mt-4">
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

            {/* Categories Section */}
            <div className="bg-white rounded-lg border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {['INDUSTRY_NEWS', 'PRODUCT_REVIEWS', 'MAINTENANCE_TIPS', 'BUSINESS_ADVICE', 'TECHNOLOGY', 'SUSTAINABILITY'].map((category) => {
                  const categoryPosts = posts.filter(post => post.category === category);
                  return (
                    <Link
                      key={category}
                      href={`/blog/category/${category.toLowerCase()}`}
                      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      <Badge className={`${getCategoryColor(category)} mb-2`}>
                        {category.replace('_', ' ')}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {categoryPosts.length} {categoryPosts.length === 1 ? 'article' : 'articles'}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}