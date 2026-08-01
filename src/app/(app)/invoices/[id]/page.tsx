import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { SendInvoiceButton } from "@/components/invoices/send-invoice-button";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session!.user.id },
    include: { client: true, lineItems: true },
  });

  if (!invoice) {
    notFound();
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground text-sm">
            {invoice.client.name} · {invoice.status}
          </p>
        </div>

        <a
          href={`/api/invoices/${invoice.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline text-primary"
        >
          Download PDF
        </a>
        {invoice.status === "DRAFT" && (
          <SendInvoiceButton invoiceId={invoice.id} />
        )}
      </div>

      <div className="border rounded-xl p-4 text-sm space-y-2">
        {invoice.lineItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.description}</span>
            <span className="tabular-nums">
              {item.quantity} × ₹{Number(item.rate).toFixed(2)} = ₹
              {Number(item.amount).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span className="tabular-nums">
            ₹{Number(invoice.total).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
