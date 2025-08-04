import path from 'path';
import { promises as fs } from 'fs';

const cachePath = path.join(process.cwd(), 'image-cache.json');
let imageCache: Record<string, string> = {}; // url => cloudinaryUrl

export async function loadImageCache() {
    try {
        const content = await fs.readFile(cachePath, 'utf-8');
        imageCache = JSON.parse(content);
    } catch {
        imageCache = {};
    }
}

export async function saveImageCache() {
    await fs.writeFile(cachePath, JSON.stringify(imageCache, null, 2));
}

export function getCachedImageUrl(originalUrl: string): string | undefined {
    return imageCache[originalUrl];
}

export function setCachedImageUrl(originalUrl: string, cloudinaryUrl: string) {
    imageCache[originalUrl] = cloudinaryUrl;
}
