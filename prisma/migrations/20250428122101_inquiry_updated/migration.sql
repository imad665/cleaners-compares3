/*
  Warnings:

  - A unique constraint covering the columns `[sellerId]` on the table `Inquiry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `Inquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "buyerDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "sellerDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_sellerId_key" ON "Inquiry"("sellerId");

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
