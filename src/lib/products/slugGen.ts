export function generateSlug(productName:string) {
    return productName
      .toLowerCase()
      .trim()
      .replace(/["'/]+/g, '')       // remove quotes, slashes
      .replace(/[^a-z0-9]+/g, '-')  // replace non-alphanumeric characters with dashes
      .replace(/--+/g, '-')         // remove multiple dashes
      .replace(/^-+|-+$/g, '');     // trim dashes from start/end
  }


import slugify from 'slugify'; // or use your generateSlug function
import { prisma } from '../prisma';

export async function generateUniqueSlug(productName: string) {
  let baseSlug = slugify(productName, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  // Keep checking until we find a unique slug
  while (await prisma.product.findFirst({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
  