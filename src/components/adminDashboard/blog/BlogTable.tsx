'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, MoreHorizontal, Search, Calendar, User, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  viewCount: number;
  author: {
    name: string;
    email: string;
  };
  tags: string[];
}

interface BlogTableProps {
  posts: BlogPost[];
  onPostUpdate: () => void;
}

export function BlogTable({ posts: initialPosts, onPostUpdate }: BlogTableProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<'title' | 'createdAt' | 'viewCount' | 'status'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'publishedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field: 'title' | 'createdAt' | 'viewCount' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Post deleted successfully');
        setPosts(posts.filter(post => post.id !== postId));
        onPostUpdate();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete post');
      }
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          excerpt: post.excerpt,
          images: [],
          status: newStatus,
          category: post.category,
          tags: post.tags,
     
        }),
      });

      if (response.ok) {
        toast.success('Post status updated successfully');
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, status: newStatus } : post
        ));
        onPostUpdate();
      } else {
        toast.error('Failed to update post status');
      }
    } catch (error) {
      toast.error('Error updating post status');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'default';
      case 'DRAFT':
        return 'secondary';
      case 'SCHEDULED':
        return 'outline';
      case 'ARCHIVED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getCategoryColor = (category: string | null) => {
    const colors: { [key: string]: string } = {
      INDUSTRY_NEWS: 'bg-blue-100 text-blue-800',
      PRODUCT_REVIEWS: 'bg-green-100 text-green-800',
      MAINTENANCE_TIPS: 'bg-yellow-100 text-yellow-800',
      BUSINESS_ADVICE: 'bg-purple-100 text-purple-800',
      TECHNOLOGY: 'bg-red-100 text-red-800',
      SUSTAINABILITY: 'bg-teal-100 text-teal-800',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const categories = [
    'INDUSTRY_NEWS',
    'PRODUCT_REVIEWS',
    'MAINTENANCE_TIPS',
    'BUSINESS_ADVICE',
    'TECHNOLOGY',
    'SUSTAINABILITY'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>
              Manage your blog posts ({filteredPosts.length} of {posts.length} posts)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/blog/create">
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Create Post
              </Button>
            </Link>
            <Link href="/admin/blog/ai-create">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus size={16} />
                AI Create
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search posts by title, excerpt, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No blog posts found.</p>
            <Link href="/admin/blog/create">
              <Button>Create Your First Post</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-1 p-0 hover:bg-transparent"
                    >
                      Title
                      <ArrowUpDown size={14} />
                    </Button>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 p-0 hover:bg-transparent"
                    >
                      Status
                      <ArrowUpDown size={14} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 p-0 hover:bg-transparent"
                    >
                      Created
                      <ArrowUpDown size={14} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('viewCount')}
                      className="flex items-center gap-1 p-0 hover:bg-transparent"
                    >
                      Views
                      <ArrowUpDown size={14} />
                    </Button>
                  </TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold line-clamp-2">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {post.excerpt}
                          </div>
                        )}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                        {post.category ? post.category.replace('_', ' ') : 'Uncategorized'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={getStatusVariant(post.status)}>
                          {post.status}
                        </Badge>
                        {post.status === 'PUBLISHED' && post.publishedAt && (
                          <div className="text-xs text-gray-500">
                            {formatDate(post.publishedAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        {formatDate(post.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {post.viewCount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <User size={14} className="text-gray-400" />
                        {post.author.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end items-center gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye size={14} />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit size={14} />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/blog/edit/${post.id}`}>
                                Edit Post
                              </Link>
                            </DropdownMenuItem>
                            {post.status !== 'PUBLISHED' && (
                              <DropdownMenuItem 
                                onClick={() => updatePostStatus(post.id, 'PUBLISHED')}
                              >
                                Publish
                              </DropdownMenuItem>
                            )}
                            {post.status !== 'DRAFT' && (
                              <DropdownMenuItem 
                                onClick={() => updatePostStatus(post.id, 'DRAFT')}
                              >
                                Move to Draft
                              </DropdownMenuItem>
                            )}
                            {post.status !== 'ARCHIVED' && (
                              <DropdownMenuItem 
                                onClick={() => updatePostStatus(post.id, 'ARCHIVED')}
                              >
                                Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => deletePost(post.id)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}