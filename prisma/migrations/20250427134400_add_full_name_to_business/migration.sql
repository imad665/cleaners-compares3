/*
  Warnings:

  - Added the required column `description` to the `BusinessForSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessForSale" ADD COLUMN     "description" TEXT NOT NULL;
