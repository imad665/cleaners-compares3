/*
  Warnings:

  - Added the required column `phoneNumber` to the `SellerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "phoneNumber" TEXT NOT NULL;
