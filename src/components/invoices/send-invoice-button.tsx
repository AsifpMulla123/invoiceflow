"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SendInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button onClick={handleSend} disabled={loading}>
      {loading ? "Sending..." : "Send invoice"}
    </Button>
  );
}
