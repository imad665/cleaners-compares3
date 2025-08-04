-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('COMPANY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('LAUNDRY', 'DRY_CLEANING', 'FINISHING');

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "callOutCharges" DOUBLE PRECISION NOT NULL,
    "ratePerHour" DOUBLE PRECISION NOT NULL,
    "experience" TEXT NOT NULL,
    "areaOfService" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "companyType" "CompanyType" NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "category" "ServiceCategory" NOT NULL,
    "pictureUrl" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
