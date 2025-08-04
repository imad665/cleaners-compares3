/*
  Warnings:

  - You are about to drop the column `userId` on the `Inquiry` table. All the data in the column will be lost.
  - Added the required column `buyerId` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_userId_fkey";

-- AlterTable
ALTER TABLE "Inquiry" DROP COLUMN "userId",
ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "buyerRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "buyerStarred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerStarred" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
