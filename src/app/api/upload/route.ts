// app/api/upload/route.ts
import { authOptions } from '@/lib/auth';
import { uploadFileToCloud } from '@/lib/cloudStorage';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if(!session || session?.user.role != 'ADMIN') 
        return NextResponse.json({error:'somthing get wrong!'},{status:500})


    const { imageUrl, publicId } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 });
    }

    // Fetch image as buffer
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch image: ${response.statusText}` }, { status: 400 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Fake a File-like object for your upload function
    const fakeFile = {
      arrayBuffer: async () => buffer,
      type: response.headers.get('content-type') || 'image/jpeg',
      name: 'temp-image',
      size: buffer.length,
    } as unknown as File;

    // Upload to Cloudinary
    const uploadResult = await uploadFileToCloud(fakeFile, publicId);

    return NextResponse.json({ url: uploadResult.url, public_id: uploadResult.public_id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
