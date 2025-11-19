'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Wand2, Save, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ImageFile {
  id: string;
  file: File;
  url: string;
  description: string;
  altText: string;
  uploading?: boolean;
  cloudinaryUrl?: string;
}

interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  featuredImage?: string;
  imagePlacements: Array<{
    imageUrl: string;
    position: number;
    caption?: string;
    altText?: string;
  }>;
}

export default function AICreateBlogPostPage() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    tone: 'professional',
    length: 'medium',
    category: 'INDUSTRY_NEWS',
  });
  const [images, setImages] = useState<ImageFile[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (files: FileList) => {
    const newImages: ImageFile[] = [];
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please upload only image files');
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Image ${file.name} is too large. Maximum size is 5MB.`);
          continue;
        }

        const imageId = `img-${Date.now()}-${i}`;
        const objectUrl = URL.createObjectURL(file);

        const imageFile: ImageFile = {
          id: imageId,
          file,
          url: objectUrl,
          description: '',
          altText: '',
          uploading: true
        };

        newImages.push(imageFile);
        setImages(prev => [...prev, imageFile]);

        // Upload to Cloudinary using direct upload endpoint
        try {
          const uploadResponse = await uploadToCloudinaryDirect(file);
          imageFile.cloudinaryUrl = uploadResponse.url;
          imageFile.uploading = false;

          // Auto-generate description based on filename
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          imageFile.description = `Image of ${fileName.replace(/[-_]/g, ' ')}`;
          imageFile.altText = `${fileName.replace(/[-_]/g, ' ')} in laundry and dry cleaning context`;

          // Update the image in state
          setImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, ...imageFile } : img
          ));

        } catch (error) {
          console.error('Cloudinary upload failed:', error);
          toast.error(`Failed to upload ${file.name}`);
          imageFile.uploading = false;
          setImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, uploading: false } : img
          ));
        }
      }

      toast.success(`Uploaded ${newImages.length} image(s) to Cloudinary`);
    } catch (error) {
      toast.error('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const uploadToCloudinaryDirect = async (file: File): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'blog-posts');

    console.log('Starting upload for file:', file.name, file.size, file.type);

    try {
      const response = await fetch('/api/upload/direct', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status, response.ok);

      if (!response.ok) {
        // Clone the response before reading it for error details
        const errorResponse = response.clone();
        let errorData;
        try {
          errorData = await errorResponse.json();
        } catch (parseError) {
          errorData = { error: `Upload failed with status: ${response.status}` };
        }
        console.error('Upload failed with error:', errorData);
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }

      // Parse the successful response
      const result = await response.json();
      console.log('Upload successful, Cloudinary URL:', result.url);
      return result;

    } catch (error) {
      console.error('Upload process failed:', error);
      throw error;
    }
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url); // Clean up object URL
    }
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const updateImageMetadata = (id: string, field: 'description' | 'altText', value: string) => {
    setImages(prev => prev.map(img =>
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const generateContent = async () => {
    if (!formData.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    // Check if any images are still uploading
    const stillUploading = images.some(img => img.uploading);
    if (stillUploading) {
      toast.error('Please wait for all images to finish uploading');
      return;
    }

    // Check if we have images but no Cloudinary URLs (upload might have failed)
    const imagesWithoutCloudinary = images.filter(img => !img.cloudinaryUrl);
    if (imagesWithoutCloudinary.length > 0) {
      toast.error(`Some images failed to upload: ${imagesWithoutCloudinary.map(img => img.file.name).join(', ')}`);
      return;
    }

    setGenerating(true);
    try {
      // Use ONLY Cloudinary URLs for AI analysis
      const imageData = images.map(img => ({
        url: img.cloudinaryUrl!, // We know this exists due to the check above
        description: img.description,
        altText: img.altText
      }));

      console.log('Sending images to AI:', imageData.map(img => ({
        url: img.url,
        description: img.description
      })));

      const response = await fetch('/api/admin/blog/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: imageData,
        }),
      });

      if (response.ok) {
        const content = await response.json();
        setGeneratedContent(content);
        toast.success('Content generated successfully using AI!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to generate content');
      }
    } catch (error) {
      toast.error('Error generating content');
    } finally {
      setGenerating(false);
    }
  };

  const savePost = async (status:"DRAFT" | 'PUBLISHED') => {
    if (!generatedContent) return;

    setLoading(true);
    try {
      // Use Cloudinary URLs for the final blog post
      const cloudinaryUrls = images.map(img => img.cloudinaryUrl || img.url);
      const featuredImage = generatedContent.featuredImage || (cloudinaryUrls.length > 0 ? cloudinaryUrls[0] : '');

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...generatedContent,
          status: status,//'DRAFT',
          category: formData.category,
          featuredImage,
          images: cloudinaryUrls,
        }),
      });

      if (response.ok) {
        const createdPost = await response.json();
        toast.success('Blog post saved successfully');

        // Reset form
        setGeneratedContent(null);
        setFormData({
          prompt: '',
          tone: 'professional',
          length: 'medium',
          category: 'INDUSTRY_NEWS',
        });

        // Clean up object URLs
        images.forEach(img => URL.revokeObjectURL(img.url));
        setImages([]);

      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save blog post');
      }
    } catch (error) {
      toast.error('Error saving blog post');
    } finally {
      setLoading(false);
    }
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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">AI Blog Post Generator</h1>
          <p className="text-gray-600">Generate blog posts using AI with image analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>Provide instructions and upload images for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Blog Topic *</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe what you want the blog post to be about. Be specific about the topic, key points, and any particular requirements for the laundry and dry cleaning industry."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="length">Length</Label>
                  <Select
                    value={formData.length}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (300-500 words)</SelectItem>
                      <SelectItem value="medium">Medium (500-800 words)</SelectItem>
                      <SelectItem value="long">Long (800-1200 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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

              <Button
                onClick={generateContent}
                disabled={generating || !formData.prompt.trim() || uploading}
                className="w-full"
              >
                <Wand2 size={16} className="mr-2" />
                {generating ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  'Generate Content with AI'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>
                AI will analyze images and place them strategically in the content
                {images.some(img => img.uploading) && (
                  <span className="text-yellow-600 ml-2">
                    (Uploading {images.filter(img => img.uploading).length} images...)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload size={16} className="mr-2" />
                  {uploading ? 'Uploading...' : 'Select Images'}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Upload up to 10 images. AI will analyze and place them in the content.
                  Images are stored securely in Cloudinary.
                </p>
              </div>

              {images.length > 0 && (
                <div className="space-y-3">
                  <Label>Uploaded Images ({images.length})</Label>
                  {images.map((image) => (
                    <div key={image.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={image.url}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {image.file.name}
                            </span>
                            {image.uploading ? (
                              <Loader2 size={14} className="animate-spin text-blue-500" />
                            ) : image.cloudinaryUrl ? (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                Uploaded
                              </span>
                            ) : null}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(image.id)}
                            className="h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <Label htmlFor={`desc-${image.id}`} className="text-xs">
                            Description for AI
                          </Label>
                          <Input
                            id={`desc-${image.id}`}
                            value={image.description}
                            onChange={(e) => updateImageMetadata(image.id, 'description', e.target.value)}
                            placeholder="Describe what's in this image for AI context"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`alt-${image.id}`} className="text-xs">
                            Alt Text
                          </Label>
                          <Input
                            id={`alt-${image.id}`}
                            value={image.altText}
                            onChange={(e) => updateImageMetadata(image.id, 'altText', e.target.value)}
                            placeholder="Accessibility description"
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>Review and edit the AI-generated content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 ">
            {generatedContent ? (
              <>
                <div className="space-y-4 h-[80vh] overflow-auto">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={generatedContent.title}
                      onChange={(e) => setGeneratedContent(prev => prev ? { ...prev, title: e.target.value } : null)}
                    />
                  </div>

                  <div>
                    <Label>Excerpt</Label>
                    <Textarea
                      value={generatedContent.excerpt}
                      onChange={(e) => setGeneratedContent(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>SEO Title</Label>
                    <Input
                      value={generatedContent.seoTitle}
                      onChange={(e) => setGeneratedContent(prev => prev ? { ...prev, seoTitle: e.target.value } : null)}
                    />
                  </div>

                  <div>
                    <Label>SEO Description</Label>
                    <Textarea
                      value={generatedContent.seoDescription}
                      onChange={(e) => setGeneratedContent(prev => prev ? { ...prev, seoDescription: e.target.value } : null)}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <Input
                      value={generatedContent.tags.join(', ')}
                      onChange={(e) => setGeneratedContent(prev => prev ? {
                        ...prev,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      } : null)}
                      placeholder="comma, separated, tags"
                    />
                  </div>

                  <div>
                    <Label>Content Preview</Label>
                    <div
                      className="border rounded-md p-4 max-h-96 overflow-y-auto text-sm prose prose-sm"
                      dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                    />
                  </div>

                  {generatedContent.imagePlacements.length > 0 && (
                    <div>
                      <Label>Image Placements</Label>
                      <div className="space-y-2 mt-2">
                        {generatedContent.imagePlacements.map((placement, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 border rounded">
                            <img
                              src={placement.imageUrl}
                              alt="Placement"
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="text-xs text-gray-500">
                                Position: {placement.position}
                              </div>
                              <div className="text-sm font-medium">
                                {placement.caption || 'No caption'}
                              </div>
                              <div className="text-xs text-gray-600">
                                Alt: {placement.altText}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex gap-2'>
                  <Button
                    onClick={()=>savePost('PUBLISHED')}
                    disabled={loading}
                    className='bg-blue-600 cursor-pointer hover:bg-blue-500'
                  >
                    <Save size={16} className="mr-2" />
                    {loading ? 'Publishing...' : 'Publish Now'}
                  </Button>
                  <Button
                    onClick={()=>savePost('DRAFT')}
                    disabled={loading}
                    className='cursor-pointer'
                  >
                    <Save size={16} className="mr-2" />
                    {loading ? 'Saving...' : 'Save as Draft'}
                  </Button>
                </div>

              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Wand2 size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Generate content to see the preview here</p>
                <p className="text-sm mt-2">
                  AI will analyze your images and create strategic placements in the content
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}