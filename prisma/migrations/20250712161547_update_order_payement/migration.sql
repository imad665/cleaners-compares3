-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('CANCELLED', 'PENDING', 'DELIVERED');

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "status" "OrderItemStatus" NOT NULL DEFAULT 'PENDING';
