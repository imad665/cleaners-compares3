-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stripCommission" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
ALTER COLUMN "commisionRate" SET DEFAULT 4,
ALTER COLUMN "commisionRate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "delivery_charge" DOUBLE PRECISION,
ADD COLUMN     "isIncVAT" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "metadata" JSONB,
    "embedding" vector,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
