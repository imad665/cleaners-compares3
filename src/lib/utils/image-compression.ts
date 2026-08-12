import sharp from 'sharp';

/**
 * Compresses an image and converts it to WebP format.
 * @param file The original File object from FormData
 * @param quality Compression quality (1-100)
 * @returns A Buffer containing the compressed WebP image data
 */
export async function compressToWebP(file: File, quality: number = 80): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return await sharp(buffer)
        .webp({ quality })
        .toBuffer();
}
