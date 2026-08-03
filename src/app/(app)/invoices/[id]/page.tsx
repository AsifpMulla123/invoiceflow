import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { SendInvoiceButton } from "@/components/invoices/send-invoice-button";
import { InvoiceActions } from "@/components/invoices/invoice-actions";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      client: true,
      lineItems: true,
      paymentEvents: { orderBy: { createdAt: "desc" } },
    },
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
        <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
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
        <div className="mt-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Payment history
          </p>
          {invoice.paymentEvents.length === 0 ? (
            <div className="border rounded-xl p-4 text-sm text-muted-foreground">
              No payment received yet
            </div>
          ) : (
            <div className="border rounded-xl divide-y">
              {invoice.paymentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {event.source === "RAZORPAY"
                        ? "Paid via Razorpay"
                        : "Marked paid manually"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.createdAt.toDateString()}
                    </p>
                  </div>
                  <span className="tabular-nums">
                    ₹{Number(event.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
