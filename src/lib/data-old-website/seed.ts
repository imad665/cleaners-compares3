import { prisma } from "../prisma";

import path from 'path';
import { promises as fs } from 'fs';
import { generateUniqueSlug } from "../products/slugGen";

import fetch from 'node-fetch';
import { uploadFileToCloud } from "../cloudStorage";
import { getCachedImageUrl, loadImageCache, saveImageCache, setCachedImageUrl } from "./imageUrlCach";
import { min } from "date-fns";

/* export async function fetchImageAsFile(imageUrl: string): Promise<File> {
    try {
        if(imageUrl.includes('ImageUnavailable')) {
            throw new Error(`Image fetch failed`); 
        }

        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Image fetch failed`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return {
            arrayBuffer: async () => buffer,
            type: response.headers.get('content-type') || 'image/jpeg',
            name: 'image-from-url',
            size: buffer.length,
        } as unknown as File;
    } catch (error) {
        // Fallback to image in /public/uploads/logo.png
        const fallbackUrl = '/uploads/logo.png'; // Don't include /public in path
        return fallbackUrl;
       
    }
} */

import axios from 'axios';
import https from 'https';

export async function fetchImageAsFile(imageUrl: string): Promise<File | string> {
  try {
    if (imageUrl.includes('ImageUnavailable')) {
      throw new Error(`Image fetch failed`);
    }

    const agent = new https.Agent({  
      rejectUnauthorized: false,  // <-- Ignore SSL errors
    });

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      httpsAgent: agent,
    });

    const buffer = Buffer.from(response.data);

    return {
      arrayBuffer: async () => buffer,
      type: response.headers['content-type'] || 'image/jpeg',
      name: 'image-from-url',
      size: buffer.length,
    } as unknown as File;

  } catch (error) {
    console.error('Image fetch failed:', error.message);

    // Return fallback path (local image path)
    return '/uploads/logo.png';
  }
}


export async function readSundriesData() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'data-old-website', 'sundries.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        return { data: JSON.parse(fileContents), start: 10 };
    } catch (error) {
        console.error('Error reading sundries.json:', error);
        return null;
    }
}
export async function readParts() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'data-old-website', 'parts.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        return { data: JSON.parse(fileContents), start: 5 };
    } catch (error) {
        console.error('Error reading parts.json:', error);
        return null;
    }
}

export async function readMachines() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'data-old-website', 'machines.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        return { data: JSON.parse(fileContents), start: 0 };
    } catch (error) {
        console.error('Error reading machines.json:', error);
        return null;
    }
}


async function createProductIfNotExist(
    productName: string,
    description: string,
    price: number,
    units: number,
    imageUrls: string[],  // these are remote URLs
    categoryId: string,
    slug: string,
    sellerId: string,
) {
    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
        where: { title: productName }
    });

    if (existingProduct) {
        return existingProduct;
    }

    // Upload images to Cloudinary and get secure URLs
    const uploadedImageUrls = [];
    for (const url of imageUrls) {
        const cached = getCachedImageUrl(url);
        if (cached) {
            uploadedImageUrls.push(cached);
            continue;
        }

        try {
            const file = await fetchImageAsFile(url);
            const uploaded = await uploadFileToCloud(file);
            uploadedImageUrls.push(uploaded.url);
            setCachedImageUrl(url, uploaded.url);
        } catch (error) {
            console.error('Error uploading image:', url, error);
        }
    }

    // Create product with uploaded image URLs
    const newProduct = await prisma.product.create({
        data: {
            title: productName,
            description,
            price,
            units,
            condition: 'NEW',
            imagesUrl: uploadedImageUrls,
            categoryId,
            slug,
            sellerId,
            isFeatured: false,
            stock: 2,
        },
    });

    return newProduct;
}


export function extractPrice(text: string): number {
    if (!text) return -1
    const match = text.match(/£(\d+(\.\d+)?)/);
    if (match && match[1]) {
        return parseFloat(match[1]);
    }
    throw new Error('Price not found in the string');
}

export default async function SeedData() {
    await loadImageCache();
    const { data, start } = await readMachines() || { data: [], start: 0 };
    let previousSub: any = null;

    for (let j = 0; j < data.length; j++) {
        const d = data[j];
        const item: string = d.subcategory;
        const category = d.category;
        const subcategory = item.split('-')[0];
        if (previousSub === null || item != previousSub.sub_subName) {
            const subCa = await prisma.category.findFirst({
                where: {
                    name: {
                        equals: subcategory,
                        mode: 'insensitive'
                    },
                    parent: {
                        name: {
                            equals: category,
                            mode: 'insensitive'
                        }
                    }
                },
                select: {
                    name: true,
                    id: true,
                }
            });

            previousSub = await prisma.category.update({
                where: {
                    id: subCa!.id
                },
                data: {
                    sub_subName: item.replace("-", '_$_')
                }
            })
        }
        const seller = await prisma.user.findFirst(
            {
                where: { email: 'admin@cleancompare.com' },
                select: { id: true }
            }
        )
        const allselers = await prisma.user.findMany()
        //'cma5ftfv4000gwna25vegx7zw' 
        //'cmbpdteoi0005wnfdnt28dqlp'
        //console.log(allselers,']]]]]]]]]]]]]]]]]]]][[[[[[[[[[[');

        const products = d.data;

        //const end = Math.min(start+5,products.length) 
        const end = products.length
        if (start >= products.length) continue
        for (let i = start; i < end; i++) {
            const product = products[i];
            const info = product.text;
            const img = product.img;
            const title = info.title;
            const units = parseInt(info.units) || 1;
            const price_exc_vat = extractPrice(info.price_exc_vat);

            const slug = await generateUniqueSlug(title);
            await createProductIfNotExist(
                title,
                title,
                price_exc_vat,
                units,
                [img],
                previousSub?.id,
                slug,
                seller!.id
            )
        }
    }
    await saveImageCache();

}