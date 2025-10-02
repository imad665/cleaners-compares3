// components/send-buyer-message-dialog.tsx
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
import { Loader2, Mail } from 'lucide-react'

const broadcastFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitleOrDate: z.string().min(1, 'Subtitle/Date is required'),
  introParagraph: z.string().min(1, 'Introduction paragraph is required'),
  benefit1Title: z.string().min(1, 'Benefit 1 title is required'),
  benefit1Text: z.string().min(1, 'Benefit 1 text is required'),
  benefit2Title: z.string().min(1, 'Benefit 2 title is required'),
  benefit2Text: z.string().min(1, 'Benefit 2 text is required'),
  benefit3Title: z.string().min(1, 'Benefit 3 title is required'),
  benefit3Text: z.string().min(1, 'Benefit 3 text is required'),
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

type BroadcastFormValues = z.infer<typeof broadcastFormSchema>

export function SendBuyerMessageDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastFormSchema),
    defaultValues: {
      title: '',
      subtitleOrDate: '',
      introParagraph: '',
      benefit1Title: '',
      benefit1Text: '',
      benefit2Title: '',
      benefit2Text: '',
      benefit3Title: '',
      benefit3Text: '',
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

  const onSubmit = async (data: BroadcastFormValues) => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/send-buyer-broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        error: 'Failed to send broadcast'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Send Message to Buyers
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Broadcast to Buyers</DialogTitle>
          <DialogDescription>
            Send an email broadcast to all verified buyers. Fill in the details below.
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
                      <Input placeholder="New Laundry Equipment Available!" {...field} />
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
                      <Input placeholder="October 2024" {...field} />
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
                        placeholder="We have exciting new commercial laundry machines from top brands now available on our platform..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Benefits Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Benefits Section</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="benefit1Title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefit 1 Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Latest Models" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="benefit1Text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefit 1 Text *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brand new 2024 equipment with warranty" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="benefit2Title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefit 2 Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Competitive Pricing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="benefit2Text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefit 2 Text *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Compare prices from multiple suppliers" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="benefit3Title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefit 3 Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Fast Delivery" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="benefit3Text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefit 3 Text *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Quick shipping across the UK" {...field} />
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
                      <Input placeholder="https://www.cleanerscompare.com/new-equipment" {...field} />
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
                      <Input placeholder="Browse New Equipment" {...field} />
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
                        <Input placeholder="Latest updates from Cleaners Compare" {...field} />
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
                        <Input placeholder="https://example.com/hero-image.jpg" {...field} />
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
                        <Input placeholder="https://youtube.com/watch?v=example" {...field} />
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
                        <Input placeholder="https://www.cleanerscompare.com" {...field} />
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
                Send Broadcast
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}