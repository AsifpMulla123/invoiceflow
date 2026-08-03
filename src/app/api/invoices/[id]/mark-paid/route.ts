import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!invoice) {
    return NextResponse.json(
      { success: false, message: "Invoice not found", data: null },
      { status: 404 },
    );
  }

  if (invoice.status === "PAID" || invoice.status === "VOIDED") {
    return NextResponse.json(
      {
        success: false,
        message: `Cannot mark an invoice that is already ${invoice.status.toLowerCase()}`,
        data: null,
      },
      { status: 400 },
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.paymentEvent.create({
      data: { invoiceId: invoice.id, source: "MANUAL", amount: invoice.total },
    });

    return tx.invoice.update({
      where: { id: invoice.id },
      data: { status: "PAID" },
    });
  });

  return NextResponse.json({
    success: true,
    message: "Invoice marked as paid",
    data: updated,
  });
}
