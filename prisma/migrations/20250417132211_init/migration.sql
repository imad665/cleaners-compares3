/*
  Warnings:

  - You are about to drop the column `logo` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `imgUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SellerProfile" DROP COLUMN "logo";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imgUrl",
ADD COLUMN     "image" TEXT;
