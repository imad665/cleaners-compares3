'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: string;
  category: string | null;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${params.id}`);
      if (response.ok) {
        const post = await response.json();
        setFormData(post);
      } else {
        toast.error('Failed to fetch blog post');
        router.push('/admin/blog');
      }
    } catch (error) {
      toast.error('Error fetching blog post');
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          featuredImage: formData.featuredImage,
          images: [],
          status: formData.status,
          category: formData.category,
          tags: formData.tags,
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
        }),
      });

      if (response.ok) {
        toast.success('Blog post updated successfully');
        router.push('/admin/blog');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update blog post');
      }
    } catch (error) {
      toast.error('Error updating blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | string[] | null) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const categories = [
    'INDUSTRY_NEWS',
    'PRODUCT_REVIEWS',
    'MAINTENANCE_TIPS',
    'BUSINESS_ADVICE',
    'TECHNOLOGY',
    'SUSTAINABILITY'
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Blog Post</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Post not found.</p>
          <Link href="/admin/blog">
            <Button className="mt-4">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-gray-600">Update your blog post content</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw size={14} />
          <span>Last updated: {new Date(formData.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Update your blog post content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter blog post title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Write your blog post content here..."
                    rows={15}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category || 'INDUSTRY_NEWS'}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Post Statistics</Label>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Views:</span>
                      <span className="font-medium">{formData.viewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(formData.createdAt).toLocaleDateString()}</span>
                    </div>
                    {formData.publishedAt && (
                      <div className="flex justify-between">
                        <span>Published:</span>
                        <span>{new Date(formData.publishedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    <Save size={16} className="mr-2" />
                    {saving ? 'Saving...' : 'Update Post'}
                  </Button>
                  <Link href={`/blog/${formData.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye size={16} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => handleChange('seoTitle', e.target.value)}
                    placeholder="SEO title (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => handleChange('seoDescription', e.target.value)}
                    placeholder="SEO description (optional)"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                    onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                    placeholder="comma, separated, tags"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="featuredImage">Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => handleChange('featuredImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {formData.featuredImage && (
                  <div className="mt-3">
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      <div className='w-[100vw] h-30'></div>
    </div>
  );
}