import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json(
      { success: false, message: "Invalid signature", data: null },
      { status: 400 },
    );
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "payment_link.paid") {
    return NextResponse.json({
      success: true,
      message: "Event ignored",
      data: null,
    });
  }

  const paymentId = event.payload.payment.entity.id;
  const invoiceId = event.payload.payment_link.entity.reference_id;
  const amount = event.payload.payment.entity.amount / 100;

  const existing = await prisma.paymentEvent.findUnique({
    where: { razorpayId: paymentId },
  });
  if (existing) {
    return NextResponse.json({
      success: true,
      message: "Already processed",
      data: null,
    });
  }

  await prisma.$transaction([
    prisma.paymentEvent.create({
      data: { invoiceId, source: "RAZORPAY", razorpayId: paymentId, amount },
    }),
    prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "PAID" },
    }),
  ]);

  return NextResponse.json({
    success: true,
    message: "Payment processed",
    data: null,
  });
}
