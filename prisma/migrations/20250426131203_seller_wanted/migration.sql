-- CreateTable
CREATE TABLE "WantedItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WantedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessForSale" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "annualTurnover" DOUBLE PRECISION NOT NULL,
    "reasonFoSale" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessForSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "wantedId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactInfo_wantedId_key" ON "ContactInfo"("wantedId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInfo_businessId_key" ON "ContactInfo"("businessId");

-- AddForeignKey
ALTER TABLE "WantedItem" ADD CONSTRAINT "WantedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_wantedId_fkey" FOREIGN KEY ("wantedId") REFERENCES "WantedItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessForSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
