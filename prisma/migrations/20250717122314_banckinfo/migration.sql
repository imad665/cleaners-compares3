-- CreateTable
CREATE TABLE "SellerBankInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountHolder" TEXT NOT NULL,
    "sortCode" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT,
    "iban" TEXT,
    "swiftCode" TEXT,
    "paypalEmail" TEXT,
    "preferredMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerBankInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellerBankInfo_userId_key" ON "SellerBankInfo"("userId");

-- AddForeignKey
ALTER TABLE "SellerBankInfo" ADD CONSTRAINT "SellerBankInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
