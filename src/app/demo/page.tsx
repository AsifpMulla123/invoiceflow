import { demoInvoices } from "@/data/seed-demo";
import { StatusBadge } from "@/components/invoices/status-badge";

export default function DemoPage() {
  const totalEarned = demoInvoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + i.total, 0);
  const outstanding = demoInvoices
    .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-sm bg-muted inline-block px-3 py-1 rounded-full mb-4">
          Read-only demo — no account needed
        </p>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total earned</p>
          <p className="text-2xl font-semibold tabular-nums">
            ₹{totalEarned.toFixed(2)}
          </p>
        </div>
        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
          <p className="text-2xl font-semibold tabular-nums">
            ₹{outstanding.toFixed(2)}
          </p>
        </div>
      </div>

      <p className="text-sm font-medium text-muted-foreground mb-2">
        Recent invoices
      </p>
      <div className="border rounded-xl overflow-hidden">
        {demoInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
          >
            <div>
              <p className="text-sm font-medium">{invoice.client.name}</p>
              <p className="text-xs text-muted-foreground">
                {invoice.invoiceNumber}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm tabular-nums">
                ₹{invoice.total.toFixed(2)}
              </span>
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
