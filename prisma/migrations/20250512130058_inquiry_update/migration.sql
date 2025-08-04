-- DropForeignKey
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_productId_fkey";

-- AlterTable
ALTER TABLE "Inquiry" ALTER COLUMN "productId" DROP NOT NULL,
ALTER COLUMN "subject" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
