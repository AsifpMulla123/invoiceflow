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
    include: { lineItems: true },
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
        message: `Cannot void an invoice that is already ${invoice.status.toLowerCase()}`,
        data: null,
      },
      { status: 400 },
    );
  }

  const lastInvoice = await prisma.invoice.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  const nextNumber = lastInvoice
    ? parseInt(lastInvoice.invoiceNumber.split("-")[1]) + 1
    : 1;
  const newInvoiceNumber = `INV-${String(nextNumber).padStart(4, "0")}`;

  const newInvoice = await prisma.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id: invoice.id },
      data: { status: "VOIDED" },
    });

    const created = await tx.invoice.create({
      data: {
        invoiceNumber: newInvoiceNumber,
        userId: session.user.id,
        clientId: invoice.clientId,
        status: "DRAFT",
        cgst: invoice.cgst,
        sgst: invoice.sgst,
        igst: invoice.igst,
        discount: invoice.discount,
        total: invoice.total,
        dueDate: invoice.dueDate,
        voidedInvoiceId: invoice.id,
      },
    });

    await tx.lineItem.createMany({
      data: invoice.lineItems.map((item) => ({
        invoiceId: created.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
    });

    return created;
  });

  return NextResponse.json({
    success: true,
    message: "Invoice voided and reissued",
    data: newInvoice,
  });
}
