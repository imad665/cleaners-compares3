// components/send-seller-message-dialog.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Users } from 'lucide-react'

const sellerBroadcastFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitleOrDate: z.string().min(1, 'Subtitle/Date is required'),
  introParagraph: z.string().min(1, 'Introduction paragraph is required'),
  metric1Value: z.string().min(1, 'Metric 1 value is required'),
  metric1Label: z.string().min(1, 'Metric 1 label is required'),
  metric2Value: z.string().min(1, 'Metric 2 value is required'),
  metric2Label: z.string().min(1, 'Metric 2 label is required'),
  metric3Value: z.string().min(1, 'Metric 3 value is required'),
  metric3Label: z.string().min(1, 'Metric 3 label is required'),
  primaryCtaUrl: z.string().url('Must be a valid URL'),
  primaryCtaLabel: z.string().min(1, 'CTA label is required'),
  preheaderText: z.string().optional(),
  heroImageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  image1Url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  image1Caption: z.string().optional(),
  image2Url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  image2Caption: z.string().optional(),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  webpageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type SellerBroadcastFormValues = z.infer<typeof sellerBroadcastFormSchema>

export function SendSellerMessageDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const form = useForm<SellerBroadcastFormValues>({
    resolver: zodResolver(sellerBroadcastFormSchema),
    defaultValues: {
      title: '',
      subtitleOrDate: '',
      introParagraph: '',
      metric1Value: '',
      metric1Label: '',
      metric2Value: '',
      metric2Label: '',
      metric3Value: '',
      metric3Label: '',
      primaryCtaUrl: '',
      primaryCtaLabel: '',
      preheaderText: '',
      heroImageUrl: '',
      image1Url: '',
      image1Caption: '',
      image2Url: '',
      image2Caption: '',
      videoUrl: '',
      webpageUrl: '',
    },
  })

  const onSubmit = async (data: SellerBroadcastFormValues) => {
    setIsLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value)
        }
      })

      const response = await fetch('/api/send-seller-broadcast', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setResult(result)

      if (result.success) {
        form.reset()
        setTimeout(() => setOpen(false), 2000)
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to send seller broadcast'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Pre-fill with example data
  const fillExampleData = () => {
    form.reset({
      title: 'Your Q4 Performance Insights',
      subtitleOrDate: 'December 2024 Report',
      introParagraph: 'Your listings are performing well! Here are your key metrics from the last quarter with opportunities to grow even further.',
      metric1Value: '24%',
      metric1Label: 'Conversion Rate',
      metric2Value: '156',
      metric2Label: 'Total Views',
      metric3Value: '£12,450',
      metric3Label: 'Revenue This Month',
      primaryCtaUrl: 'https://www.cleanerscompare.com/seller-analytics',
      primaryCtaLabel: 'View Detailed Analytics',
      preheaderText: 'Latest performance insights for Cleaners Compare sellers',
      heroImageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80',
      image1Url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=268&h=200&q=80',
      image1Caption: 'Seller dashboard overview',
      image2Url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=268&h=200&q=80',
      image2Caption: 'Performance analytics',
      videoUrl: 'https://www.youtube.com/watch?v=seller-guide',
      webpageUrl: 'https://www.cleanerscompare.com/seller-portal',
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Send Message to Sellers
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Broadcast to Sellers</DialogTitle>
          <DialogDescription>
            Send an email broadcast to all verified sellers. Focus on metrics and performance insights.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Q4 Performance Insights" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitleOrDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle or Date *</FormLabel>
                    <FormControl>
                      <Input placeholder="December 2024 Report" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introParagraph"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Introduction Paragraph *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your listings are performing well! Here are your key metrics from the last quarter..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Metrics Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Performance Metrics</h3>
                <Button type="button" variant="outline" size="sm" onClick={fillExampleData}>
                  Fill Example Data
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 p-4 border rounded-lg bg-purple-50">
                  <FormField
                    control={form.control}
                    name="metric1Value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metric 1 Value *</FormLabel>
                        <FormControl>
                          <Input placeholder="24%" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metric1Label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metric 1 Label *</FormLabel>
                        <FormControl>
                          <Input placeholder="Conversion Rate" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2 p-4 border rounded-lg bg-purple-50">
                  <FormField
                    control={form.control}
                    name="metric2Value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metric 2 Value *</FormLabel>
                        <FormControl>
                          <Input placeholder="156" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metric2Label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metric 2 Label *</FormLabel>
                        <FormControl>
                          <Input placeholder="Total Views" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2 p-4 border rounded-lg bg-purple-50">
                  <FormField
                    control={form.control}
                    name="metric3Value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metric 3 Value *</FormLabel>
                        <FormControl>
                          <Input placeholder="£12,450" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metric3Label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metric 3 Label *</FormLabel>
                        <FormControl>
                          <Input placeholder="Revenue This Month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primaryCtaUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary CTA URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.cleanerscompare.com/seller-analytics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryCtaLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary CTA Label *</FormLabel>
                    <FormControl>
                      <Input placeholder="View Detailed Analytics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Optional Fields</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preheaderText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preheader Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Latest performance insights for sellers" {...field} />
                      </FormControl>
                      <FormDescription>
                        Hidden preview text in email inbox
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heroImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/seller-hero.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image URLs and Captions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="image1Url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 1 URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image1.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image1Caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 1 Caption</FormLabel>
                      <FormControl>
                        <Input placeholder="Seller dashboard overview" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="image2Url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 2 URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image2.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image2Caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 2 Caption</FormLabel>
                      <FormControl>
                        <Input placeholder="Performance analytics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/watch?v=seller-guide" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="webpageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webpage URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.cleanerscompare.com/seller-portal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Result Message */}
            {result && (
              <div className={`p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {result.success ? '✅ ' : '❌ '}
                {result.message || result.error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send to Sellers
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}