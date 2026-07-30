import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { invoiceSchema } from "@/lib/validations/invoice";
import { calculateTax } from "@/lib/tax/calculate-tax";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const body = await request.json();
  const parsed = invoiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        data: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { clientId, lineItems, discount, dueDate } = parsed.data;

  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: session.user.id },
  });

  if (!client) {
    return NextResponse.json(
      { success: false, message: "Client not found", data: null },
      { status: 404 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const discountedSubtotal = subtotal - discount;

  const tax = calculateTax({
    businessState: user?.state ?? "",
    clientState: client.state,
    clientCountry: client.country,
    subtotal: discountedSubtotal,
  });

  const lastInvoice = await prisma.invoice.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const nextNumber = lastInvoice
    ? parseInt(lastInvoice.invoiceNumber.split("-")[1]) + 1
    : 1;
  const invoiceNumber = `INV-${String(nextNumber).padStart(4, "0")}`;

  const invoice = await prisma.$transaction(async (tx) => {
    const newInvoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        userId: session.user.id,
        clientId,
        cgst: tax.cgst,
        sgst: tax.sgst,
        igst: tax.igst,
        discount,
        total: tax.total,
        dueDate: new Date(dueDate),
        status: "DRAFT",
      },
    });

    await tx.lineItem.createMany({
      data: lineItems.map((item) => ({
        invoiceId: newInvoice.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate,
      })),
    });

    return newInvoice;
  });

  return NextResponse.json(
    { success: true, message: "Invoice created", data: invoice },
    { status: 201 },
  );
}
