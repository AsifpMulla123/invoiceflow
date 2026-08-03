"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function InvoiceActions({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleVoid() {
    setLoading(true);
    const res = await fetch(`/api/invoices/${invoiceId}/void`, {
      method: "POST",
    });
    const result = await res.json();
    setLoading(false);
    if (result.success) {
      router.push(`/invoices/${result.data.id}`);
    }
  }

  async function handleMarkPaid() {
    setLoading(true);
    await fetch(`/api/invoices/${invoiceId}/mark-paid`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  const canVoid = status !== "PAID" && status !== "VOIDED";
  const canMarkPaid = status !== "PAID" && status !== "VOIDED";

  if (!canVoid && !canMarkPaid) return null;

  return (
    <div className="flex gap-2">
      {canMarkPaid && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={loading}>
              Mark as paid
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark this invoice as paid?</AlertDialogTitle>
              <AlertDialogDescription>
                Use this if the client paid outside InvoiceFlow (bank transfer,
                cash, etc). This records a manual payment and cannot be undone
                from here.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleMarkPaid}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {canVoid && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={loading}>
              Void & create corrected invoice
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Void this invoice?</AlertDialogTitle>
              <AlertDialogDescription>
                This voids the current invoice and creates a new draft with a
                new invoice number, copying the same client and line items. Use
                this to fix a mistake — GST invoice numbers can&apos;t be edited
                directly once sent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleVoid}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
