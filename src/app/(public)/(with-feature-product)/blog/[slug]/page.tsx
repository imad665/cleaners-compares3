import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowLeft, Eye, Tag, Share2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ShareButton from './ShareButton';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(currentPostId: string, category: string | null, limit: number = 3) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        category,
        id: { not: currentPostId },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });

    return posts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

function formatDate(date: Date | null) {
  if (!date) return 'Unknown date';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function getCategoryColor(category: string | null) {
  const colors: { [key: string]: string } = {
    INDUSTRY_NEWS: 'bg-blue-500/10 text-blue-700 border-blue-200',
    PRODUCT_REVIEWS: 'bg-green-500/10 text-green-700 border-green-200',
    MAINTENANCE_TIPS: 'bg-amber-500/10 text-amber-700 border-amber-200',
    BUSINESS_ADVICE: 'bg-purple-500/10 text-purple-700 border-purple-200',
    TECHNOLOGY: 'bg-red-500/10 text-red-700 border-red-200',
    SUSTAINABILITY: 'bg-teal-500/10 text-teal-700 border-teal-200',
  };
  return colors[category || ''] || 'bg-gray-500/10 text-gray-700 border-gray-200';
}

// Enhanced blog content with wider layout and better styling
function BlogContent({ content }: { content: string }) {
  return (
    <div className="prose prose-xl max-w-none w-full
      prose-headings:font-bold prose-headings:text-gray-900
      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
      prose-p:text-gray-800 prose-p:leading-relaxed prose-p:text-lg
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-a:font-medium
      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
      prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-gray-400
      prose-li:text-gray-800 prose-li:text-lg
      prose-strong:text-gray-900 prose-strong:font-bold
      prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-mono
      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:border
      prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
      prose-table:border prose-table:border-gray-300 prose-table:rounded-lg prose-table:overflow-hidden
      prose-th:bg-gray-100 prose-th:text-gray-900 prose-th:font-semibold prose-th:p-4
      prose-td:border prose-td:border-gray-200 prose-td:p-4
      prose-hr:border-gray-300
      prose-lead:text-gray-600 prose-lead:text-xl
    ">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

// Author component
function AuthorInfo({ author, date, readingTime, viewCount }: { author: any; date: string; readingTime: string; viewCount: number }) {
  return (
    <div className="flex items-center gap-6 py-8 border-y border-gray-200">
      {author.image && (
        <img
          src={author.image}
          alt={author.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <User size={18} className="text-gray-500" />
            <span className="font-semibold text-gray-900">{author.name}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-gray-700">{date}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <Clock size={18} className="text-gray-500" />
            <span className="text-gray-700">{readingTime}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <Eye size={18} className="text-gray-500" />
            <span className="text-gray-700">{viewCount} views</span>
          </div>
        </div>
        {author.bio && (
          <p className="text-gray-600 text-lg mt-3 leading-relaxed">{author.bio}</p>
        )}
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category, 3);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button variant="ghost" className="flex items-center gap-2 group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-lg">Back to Blog</span>
              </Button>
            </Link>
            
            {/* Reading Progress Bar */}
            <div className="hidden lg:block flex-1 max-w-xl mx-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  id="progress-bar"
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ShareButton post={post} shareUrl={shareUrl} />
            </div>
          </div>
        </div>
      </nav>

      {/* Article Header with Gradient */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 border-b border-gray-200">
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-6xl mx-auto">
            {/* Category and Metadata */}
            <div className="flex items-center justify-between mb-10">
              <Badge 
                variant="outline" 
                className={`${getCategoryColor(post.category)} border-2 px-4 py-2 font-semibold text-lg`}
              >
                {post.category?.replace('_', ' ') || 'Uncategorized'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-2xl lg:text-3xl text-gray-600 mb-10 leading-relaxed font-light">
              {post.excerpt}
            </p>

            {/* Author Info */}
            <AuthorInfo 
              author={post.author}
              date={formatDate(post.publishedAt || post.createdAt)}
              readingTime={getReadingTime(post.content)}
              viewCount={post.viewCount}
            />

            {/* Featured Image - FIXED */}
            {post.featuredImage && (
              <div className="mt-12 rounded-3xl shadow-2xl border border-gray-200 bg-gray-100">
                {/* Remove overflow-hidden and use responsive aspect ratio */}
                <div className="w-full h-auto max-h-[600px] overflow-hidden rounded-3xl">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-auto object-contain max-h-[600px] mx-auto"
                    // Fallback to cover if contain doesn't work well
                    style={{ 
                      objectFit: 'contain',
                      maxHeight: '600px',
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                </div>
                {/* Optional: Add a caption if needed */}
                {/* <p className="text-center text-gray-500 text-sm mt-2">Featured image for {post.title}</p> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content - WIDER LAYOUT */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            {/* Main Content - MUCH WIDER */}
            <div className="xl:col-span-10 xl:col-start-2">
              <article className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10 lg:p-16">
                {post.content ? (
                  <BlogContent content={post.content} />
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-6">
                      <Calendar size={80} className="mx-auto" />
                    </div>
                    <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                      Content Not Available
                    </h2>
                    <p className="text-gray-500 text-xl">
                      The content for this blog post is not available.
                    </p>
                  </div>
                )}
              </article>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Tag size={24} className="text-gray-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Article Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-lg font-medium"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Enjoyed this article?
                    </h3>
                    <p className="text-xl text-gray-600">
                      Share it with your network to spread the knowledge.
                    </p>
                  </div>
                  <ShareButton post={post} shareUrl={shareUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Continue Reading
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
                  Discover more articles that might interest you
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
                  >
                    {relatedPost.featuredImage && (
                      <div className="overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <Badge className={`${getCategoryColor(relatedPost.category)} mb-4 text-sm font-medium`}>
                        {relatedPost.category?.replace('_', ' ')}
                      </Badge>
                      <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-base line-clamp-3 mb-4 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                        <span>{formatDate(relatedPost.publishedAt)}</span>
                        <span>{getReadingTime(relatedPost.content)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reading Progress Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('scroll', () => {
              const winHeight = window.innerHeight;
              const docHeight = document.documentElement.scrollHeight;
              const scrollTop = window.pageYOffset;
              const trackLength = docHeight - winHeight;
              const progress = Math.floor((scrollTop / trackLength) * 100);
              
              const progressBar = document.getElementById('progress-bar');
              if (progressBar) {
                progressBar.style.width = progress + '%';
              }
            });
          `,
        }}
      />
    </div>
  );
}