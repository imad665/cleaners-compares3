// lib/cloudStorage.ts
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadFileToCloud(
  file: File,
  publicId?: string
): Promise<{ url: string; public_id: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = Readable.from(buffer);

  // Dynamically determine resource_type (image or video)
  const mime = file.type;
  const isVideo = mime.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'products',
        public_id: publicId,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.pipe(uploadStream);
  });
}
function getPublicIdFromCloudinaryUrl(url: string): { publicId: string; resourceType: 'image' | 'video' } | null {
  const match = url.match(/\/(?:image|video)\/upload\/(?:v\d+\/)?(.+)\.(\w+)$/);
  if (!match) return null;

  const fullPath = match[1]; // e.g., 'products/z5zvwcixhvlcaqwpxgsy'
  const extension = match[2]; // e.g., 'mp4' or 'jpg'
  const resourceType = extension === 'mp4' || extension === 'webm' ? 'video' : 'image';

  return { publicId: fullPath, resourceType };
}

// Delete an image
export async function deleteCloudinaryFileByUrl(url: string) {
  const extracted = getPublicIdFromCloudinaryUrl(url);
  if (!extracted) {
    return { success: false, message: 'Invalid Cloudinary URL format.' };
  }

  const { publicId, resourceType } = extracted;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return { success: true, result };
  } catch (err) {
    return { success: false, error: err };
  }
}


export async function deleteAllCloudinaryImages(): Promise<{
  success: boolean;
  result?: any;
  error?: any;
}> {
  try {
    const result = await cloudinary.api.delete_all_resources({ resource_type: 'image' });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}
