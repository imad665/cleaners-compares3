/*
  Warnings:

  - The `status` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategrySatuts" AS ENUM ('HIDDEN', 'ACTIVE', 'DELETING');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "CategrySatuts" NOT NULL DEFAULT 'HIDDEN';

-- DropEnum
DROP TYPE "CategrySatus";
