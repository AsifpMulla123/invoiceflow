-- CreateEnum
CREATE TYPE "PaymentSource" AS ENUM ('RAZORPAY', 'MANUAL');

-- CreateTable
CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "source" "PaymentSource" NOT NULL,
    "razorpayId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEvent_razorpayId_key" ON "PaymentEvent"("razorpayId");

-- AddForeignKey
ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
