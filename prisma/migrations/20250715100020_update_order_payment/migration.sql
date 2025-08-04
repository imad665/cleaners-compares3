-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "shippingProofUrl" TEXT,
ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "OrderPayment" ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "shippingProofUrl" TEXT,
ADD COLUMN     "trackingNumber" TEXT;
