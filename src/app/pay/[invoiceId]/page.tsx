import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export default async function PayPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { client: true, user: true },
  });

  if (!invoice) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="border rounded-xl p-8 max-w-sm w-full text-center">
        <p className="text-sm text-muted-foreground mb-1">Invoice from</p>
        <p className="font-medium mb-6">
          {invoice.user.businessName ?? invoice.user.name}
        </p>

        <p className="text-sm text-muted-foreground mb-1">Amount due</p>
        <p className="text-3xl font-semibold tabular-nums mb-2">
          ₹{Number(invoice.total).toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          {invoice.status === "PAID"
            ? "Already paid"
            : `Due ${invoice.dueDate.toDateString()}`}
        </p>

        {invoice.status === "PAID" ? (
          <p className="text-sm text-green-600 font-medium">
            ✓ This invoice has been paid
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Use the payment link sent to your email to complete payment.
          </p>
        )}
      </div>
    </div>
  );
}
