-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "featureDays" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "featureDays" TEXT;
