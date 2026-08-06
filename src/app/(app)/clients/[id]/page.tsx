import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { StatusBadge } from "@/components/invoices/status-badge";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = await params;

  const client = await prisma.client.findFirst({
    where: { id, userId: session!.user.id },
    include: { invoices: { orderBy: { createdAt: "desc" } } },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-semibold mb-1">{client.name}</h1>
      <p className="text-muted-foreground mb-6">
        {client.state}, {client.country}
      </p>

      <div className="space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">Email:</span>{" "}
          {client.email || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">Phone:</span>{" "}
          {client.phone || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">GSTIN:</span>{" "}
          {client.gstin || "—"}
        </p>
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Invoices
        </p>
        {client.invoices.length === 0 ? (
          <div className="border rounded-xl p-4 text-sm text-muted-foreground">
            No invoices yet for this client
          </div>
        ) : (
          <div className="border rounded-xl overflow-hidden bg-card hover:shadow-sm transition-shadow">
            {client.invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/invoices/${invoice.id}`}
                className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-muted/50"
              >
                <span className="text-sm">{invoice.invoiceNumber}</span>
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
    </div>
  );
}
