-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('HIDDEN', 'ACTIVE', 'DELETING');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'HIDDEN';
