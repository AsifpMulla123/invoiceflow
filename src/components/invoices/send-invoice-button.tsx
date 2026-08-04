"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SendInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setLoading(true);
    setError(null);
    try {
      await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" });
      router.refresh();
    } catch {
      setError("Failed to send. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={handleSend} disabled={loading}>
        {loading ? "Sending..." : "Send invoice"}
      </Button>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
