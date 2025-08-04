-- CreateEnum
CREATE TYPE "CategrySatus" AS ENUM ('HIDDEN', 'ACTIVE');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "status" "CategrySatus" NOT NULL DEFAULT 'HIDDEN';
