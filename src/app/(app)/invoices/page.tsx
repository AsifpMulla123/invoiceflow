import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/invoices/status-badge";

export default async function InvoicesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const invoices = await prisma.invoice.findMany({
    where: { userId: session!.user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button asChild>
          <Link href="/invoices/new">+ New invoice</Link>
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="border rounded-xl p-10 text-center text-muted-foreground bg-card">
          <p className="mb-4">No invoices yet — create your first one.</p>
          <Button asChild>
            <Link href="/invoices/new">+ New invoice</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium">{invoice.client.name}</p>
                <p className="text-xs text-muted-foreground">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums">
                  ₹{Number(invoice.total).toFixed(2)}
                </span>
                <StatusBadge status={invoice.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
