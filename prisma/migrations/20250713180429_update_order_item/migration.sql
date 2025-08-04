-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "isReadBuyer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReadSeller" BOOLEAN NOT NULL DEFAULT false;
