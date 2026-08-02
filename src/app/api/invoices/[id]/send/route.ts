import { razorpay } from "@/lib/razorpay/client";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    include: { client: true, lineItems: true },
  });

  if (!invoice) {
    return NextResponse.json(
      { success: false, message: "Invoice not found", data: null },
      { status: 404 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  const paymentLink = await razorpay.paymentLink.create({
    amount: Math.round(Number(invoice.total) * 100),
    currency: "INR",
    description: `Payment for invoice ${invoice.invoiceNumber}`,
    customer: {
      name: invoice.client.name,
      email: invoice.client.email ?? undefined,
    },
    notify: { sms: false, email: false },
    reference_id: invoice.id,
    callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pay/${invoice.id}/success`,
    callback_method: "get",
  });
  try {
    const lineItemsHtml = invoice.lineItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 6px 12px; border-bottom: 1px solid #eee;">${item.description}</td>
        <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
        <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.rate).toFixed(2)}</td>
        <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.amount).toFixed(2)}</td>
      </tr>`,
      )
      .join("");

    await resend.emails.send({
      from: "InvoiceFlow <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `Invoice ${invoice.invoiceNumber} from ${user?.businessName ?? user?.name}`,
      html: `
    <p>Hi ${invoice.client.name},</p>
    <p>You have a new invoice: <strong>${invoice.invoiceNumber}</strong>, due ${invoice.dueDate.toDateString()}.</p>
    <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
      <thead>
        <tr>
          <th style="padding: 6px 12px; text-align: left; border-bottom: 2px solid #333;">Description</th>
          <th style="padding: 6px 12px; text-align: right; border-bottom: 2px solid #333;">Qty</th>
          <th style="padding: 6px 12px; text-align: right; border-bottom: 2px solid #333;">Rate</th>
          <th style="padding: 6px 12px; text-align: right; border-bottom: 2px solid #333;">Amount</th>
        </tr>
      </thead>
      <tbody>${lineItemsHtml}</tbody>
    </table>
    <p style="text-align: right; font-weight: bold;">Total: ₹${Number(invoice.total).toFixed(2)}</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/api/invoices/${invoice.id}/pdf">View invoice PDF</a></p>
    <p><a href="${paymentLink.short_url}" style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Pay ₹${Number(invoice.total).toFixed(2)}</a></p>
  `,
    });
  } catch (err) {
    console.error("Resend email failed:", err);
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: { status: "SENT" },
  });

  return NextResponse.json({
    success: true,
    message: "Invoice sent",
    data: updated,
  });
}
