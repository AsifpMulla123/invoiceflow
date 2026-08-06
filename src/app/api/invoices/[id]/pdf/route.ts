import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { InvoicePdf } from "@/lib/pdf/invoice-template";

export async function GET(
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
    include: { client: true, lineItems: true },
  });

  if (!invoice) {
    return NextResponse.json(
      { success: false, message: "Invoice not found", data: null },
      { status: 404 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  const exportNote =
    Number(invoice.igst) === 0 &&
    Number(invoice.cgst) === 0 &&
    Number(invoice.sgst) === 0
      ? "Supply meant for export under LUT without payment of IGST"
      : null;

  const pdfBuffer = await renderToBuffer(
    InvoicePdf({
      invoiceNumber: invoice.invoiceNumber,
      logoUrl: user?.logoUrl || null,
      businessName: user?.businessName ?? user?.name ?? "InvoiceFlow User",
      businessGstin: user?.gstin ?? null,
      clientName: invoice.client.name,
      clientGstin: invoice.client.gstin,
      clientState: invoice.client.state,
      dueDate: invoice.dueDate.toDateString(),
      lineItems: invoice.lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        rate: Number(item.rate),
        amount: Number(item.amount),
      })),
      cgst: Number(invoice.cgst),
      sgst: Number(invoice.sgst),
      igst: Number(invoice.igst),
      discount: Number(invoice.discount),
      total: Number(invoice.total),
      exportNote,
    }),
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}
