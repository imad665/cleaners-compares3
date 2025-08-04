-- DropForeignKey
ALTER TABLE "ContactInfo" DROP CONSTRAINT "ContactInfo_businessId_fkey";

-- DropForeignKey
ALTER TABLE "ContactInfo" DROP CONSTRAINT "ContactInfo_wantedId_fkey";

-- AlterTable
ALTER TABLE "ContactInfo" ALTER COLUMN "wantedId" DROP NOT NULL,
ALTER COLUMN "businessId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_wantedId_fkey" FOREIGN KEY ("wantedId") REFERENCES "WantedItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessForSale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
