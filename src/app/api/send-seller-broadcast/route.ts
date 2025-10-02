// app/api/send-seller-broadcast/route.ts
import { sendMessageSellerAction } from '@/actions/send-message-seller-action'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
 

export async function POST(request: NextRequest) {
  try {

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if(user && user.role != 'ADMIN') return NextResponse.json({message:''},{status:401});
    

    const formData = await request.formData()
    
    const data = {
      title: formData.get('title') as string,
      subtitleOrDate: formData.get('subtitleOrDate') as string,
      introParagraph: formData.get('introParagraph') as string,
      metric1Value: formData.get('metric1Value') as string,
      metric1Label: formData.get('metric1Label') as string,
      metric2Value: formData.get('metric2Value') as string,
      metric2Label: formData.get('metric2Label') as string,
      metric3Value: formData.get('metric3Value') as string,
      metric3Label: formData.get('metric3Label') as string,
      primaryCtaUrl: formData.get('primaryCtaUrl') as string,
      primaryCtaLabel: formData.get('primaryCtaLabel') as string,
      preheaderText: formData.get('preheaderText') as string | undefined,
      heroImageUrl: formData.get('heroImageUrl') as string | undefined,
      image1Url: formData.get('image1Url') as string | undefined,
      image1Caption: formData.get('image1Caption') as string | undefined,
      image2Url: formData.get('image2Url') as string | undefined,
      image2Caption: formData.get('image2Caption') as string | undefined,
      videoUrl: formData.get('videoUrl') as string | undefined,
      webpageUrl: formData.get('webpageUrl') as string | undefined,
    }

    // Filter out empty strings
    Object.keys(data).forEach(key => {
      if (data[key as keyof typeof data] === '') {
        data[key as keyof typeof data] = undefined
      }
    })

    const result = await sendMessageSellerAction(data)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in seller broadcast API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}