import { InvoiceBuilder } from "@/components/invoices/invoice-builder";

export default function NewInvoicePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">New invoice</h1>
      <InvoiceBuilder />
    </div>
  );
}
