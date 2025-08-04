-- CreateEnum
CREATE TYPE "StripStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "stripStatus" "StripStatus" NOT NULL DEFAULT 'PENDING';
