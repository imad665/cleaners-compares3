// app/actions/send-message-seller-action.ts
'use server'

import { sendSellerBroadcastMessage } from '@/lib/payement/sendSellerBroadcast'
import { prisma } from '@/lib/prisma'
 
import { revalidatePath } from 'next/cache'

export async function sendMessageSellerAction(formData: {
  title: string
  subtitleOrDate: string
  introParagraph: string
  metric1Value: string
  metric1Label: string
  metric2Value: string
  metric2Label: string
  metric3Value: string
  metric3Label: string
  primaryCtaUrl: string
  primaryCtaLabel: string
  preheaderText?: string
  heroImageUrl?: string
  image1Url?: string
  image1Caption?: string
  image2Url?: string
  image2Caption?: string
  videoUrl?: string
  webpageUrl?: string
}) {
  try {
    // Fetch all sellers
    const sellers = await prisma.user.findMany({
      where: {
        role: 'SELLER',
        //emailVerified: { not: null } // Only send to verified emails
      },
      select: {
        email: true,
        name: true
      }
    })

    if (sellers.length === 0) {
      return { success: false, error: 'No verified sellers found' }
    }

    const results = []
    
    for (const seller of sellers) {
      try {
        // Extract first name from full name
        const firstName = seller.name.split(' ')[0]

        await sendSellerBroadcastMessage({
          to: seller.email,
          firstName,
          title: formData.title,
          subtitleOrDate: formData.subtitleOrDate,
          introParagraph: formData.introParagraph,
          metrics: {
            value1: formData.metric1Value,
            label1: formData.metric1Label,
            value2: formData.metric2Value,
            label2: formData.metric2Label,
            value3: formData.metric3Value,
            label3: formData.metric3Label
          },
          images: {
            heroImageUrl: formData.heroImageUrl,
            image1Url: formData.image1Url,
            image1Caption: formData.image1Caption,
            image2Url: formData.image2Url,
            image2Caption: formData.image2Caption
          },
          links: {
            videoUrl: formData.videoUrl,
            webpageUrl: formData.webpageUrl,
            primaryCtaUrl: formData.primaryCtaUrl,
            primaryCtaLabel: formData.primaryCtaLabel,
            preferencesUrl: 'https://www.cleanerscompare.com',
            unsubscribeUrl: 'https://www.cleanerscompare.com'
          },
          preheaderText: formData.preheaderText
        })

        results.push({ email: seller.email, success: true })
      } catch (error) {
        console.error(`Failed to send to ${seller.email}:`, error)
        results.push({ email: seller.email, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    revalidatePath('/admin') // Adjust path as needed

    return {
      success: true,
      message: `Seller broadcast sent: ${successful} successful, ${failed} failed`,
      details: results
    }

  } catch (error) {
    console.error('Error in sendMessageSellerAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send seller broadcast'
    }
  }
}