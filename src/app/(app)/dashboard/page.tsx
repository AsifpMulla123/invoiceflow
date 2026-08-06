import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/invoices/status-badge";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalEarnedAllTime,
    totalEarnedThisMonth,
    outstandingByStatus,
    recentInvoices,
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: { userId, status: "PAID" },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { userId, status: "PAID", createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    prisma.invoice.groupBy({
      by: ["status"],
      where: { userId, status: { in: ["SENT", "VIEWED", "OVERDUE"] } },
      _sum: { total: true },
    }),
    prisma.invoice.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const overdue = Number(
    outstandingByStatus.find((g) => g.status === "OVERDUE")?._sum.total ?? 0,
  );
  const pending = outstandingByStatus
    .filter((g) => g.status !== "OVERDUE")
    .reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0);

  const hasInvoices = recentInvoices.length > 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button asChild>
          <Link href="/invoices/new">+ New invoice</Link>
        </Button>
      </div>

      {!hasInvoices ? (
        <div className="border rounded-xl p-10 text-center text-muted-foreground">
          <p className="mb-4">
            No invoices yet — create your first one to get started.
          </p>
          <Button asChild>
            <Link href="/invoices/new">+ New invoice</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border rounded-xl p-5 hover:shadow-sm transition-shadow bg-card">
              <p className="text-sm text-muted-foreground mb-1">Total earned</p>
              <p className="text-2xl font-semibold tabular-nums">
                ₹{Number(totalEarnedAllTime._sum.total ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="border rounded-xl p-5 hover:shadow-sm transition-shadow bg-card">
              <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
              <p className="text-2xl font-semibold tabular-nums">
                ₹{pending.toFixed(2)}
              </p>
            </div>
            <div className="border rounded-xl p-5 hover:shadow-sm transition-shadow bg-card">
              <p className="text-sm text-muted-foreground mb-1">
                Paid this month
              </p>
              <p className="text-2xl font-semibold tabular-nums">
                ₹{Number(totalEarnedThisMonth._sum.total ?? 0).toFixed(2)}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-muted-foreground mb-2">
            Recent invoices
          </p>
          <div className="border rounded-xl overflow-hidden bg-card hover:shadow-sm transition-shadow">
            {recentInvoices.map((invoice) => (
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
        </>
      )}
    </div>
  );
}
