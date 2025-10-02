// app/actions/send-message-buyer-action.ts
'use server'

import { sendBuyerBroadcastMessage } from '@/lib/payement/sendBuyerBroadcastMessage'
import { prisma } from '@/lib/prisma'
 
import { revalidatePath } from 'next/cache'

export async function sendMessageBuyerAction(formData: {
  title: string
  subtitleOrDate: string
  introParagraph: string
  benefit1Title: string
  benefit1Text: string
  benefit2Title: string
  benefit2Text: string
  benefit3Title: string
  benefit3Text: string
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
    // Fetch all buyers
    const buyers = await prisma.user.findMany({
      where: {
        role: 'BUYER',
        //emailVerified: { not: null } // Only send to verified emails
      },
      select: {
        email: true,
        name: true
      }
    })

    if (buyers.length === 0) {
      return { success: false, error: 'No verified buyers found' }
    }

    const results = []
    
    for (const buyer of buyers) {
      try {
        // Extract first name from full name
        const firstName = buyer.name.split(' ')[0]

        await sendBuyerBroadcastMessage({
          to: buyer.email,
          firstName,
          title: formData.title,
          subtitleOrDate: formData.subtitleOrDate,
          introParagraph: formData.introParagraph,
          benefits: {
            title1: formData.benefit1Title,
            text1: formData.benefit1Text,
            title2: formData.benefit2Title,
            text2: formData.benefit2Text,
            title3: formData.benefit3Title,
            text3: formData.benefit3Text
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
            preferencesUrl: 'https://www.cleanerscompare.com/',
            unsubscribeUrl: 'https://www.cleanerscompare.com/'
          },
          preheaderText: formData.preheaderText
        })

        return

        results.push({ email: buyer.email, success: true })
      } catch (error) {
        console.error(`Failed to send to ${buyer.email}:`, error)
        results.push({ email: buyer.email, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    revalidatePath('/admin') // Adjust path as needed

    return {
      success: true,
      message: `Broadcast sent: ${successful} successful, ${failed} failed`,
      details: results
    }

  } catch (error) {
    console.error('Error in sendMessageBuyerAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send broadcast'
    }
  }
}