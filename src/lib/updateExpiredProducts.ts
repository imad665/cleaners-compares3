'server only'

// lib/updateExpiredProducts.ts

import { prisma } from "@/lib/prisma";

export async function updateExpiredAndDealsProducts() {
  const now = new Date();

  await Promise.all([
    prisma.product.updateMany({
      where: {
        isFeatured: true,
        featuredEndDate: {
          lt: now,
        },
      },
      data: {
        isFeatured: false,
        featuredEndDate: null,
        featureDays: null,
      },
    }),
    prisma.product.updateMany({
      where: {
        isDealActive: true,
        dealEndDate: {
          lt: now,
        },
      },
      data: {
        isDealActive: false,
        dealEndDate: null,
        dealStartDate: null,
      },
    }),
    prisma.service.updateMany({
      where: {
        isFeatured: true,
        featuredEndDate: {
          lt: now,
        },
      },
      data: {
        isFeatured: false,
        featuredEndDate: null,
        featureDays: null,
      },
    })
  ]);
}
