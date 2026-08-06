"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineItemRow,
  type LineItem,
} from "@/components/invoices/line-item-row";

interface Client {
  id: string;
  name: string;
  state: string;
  country: string;
}

export function InvoiceBuilder() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setClients(result.data);
      });
  }, []);

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const discountedSubtotal = Math.max(subtotal - discount, 0);

  function updateLineItem(index: number, updated: LineItem) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? updated : item)),
    );
  }

  function addLineItem() {
    setLineItems((prev) => [
      ...prev,
      { description: "", quantity: 1, rate: 0 },
    ]);
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, lineItems, discount, dueDate }),
      });

      const result = await res.json();

      if (!result.success) {
        if (result.data) setErrors(result.data);
        return;
      }

      router.push(`/invoices/${result.data.id}`);
      router.refresh();
    } catch {
      setErrors({
        form: ["Something went wrong. Check your connection and try again."],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <select
          id="client"
          className="w-full border rounded-md h-10 px-3 text-sm"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">Select a client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.state})
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="text-sm text-destructive">{errors.clientId[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Line items</Label>
        {lineItems.map((item, index) => (
          <LineItemRow
            key={index}
            item={item}
            onChange={(updated) => updateLineItem(index, updated)}
            onRemove={() => removeLineItem(index)}
            canRemove={lineItems.length > 1}
          />
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
          + Add line item
        </Button>
        {errors.lineItems && (
          <p className="text-sm text-destructive">{errors.lineItems[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount">Discount (₹)</Label>
        <Input
          id="discount"
          type="number"
          min={0}
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {errors.dueDate && (
          <p className="text-sm text-destructive">{errors.dueDate[0]}</p>
        )}
      </div>

      <div className="border-t pt-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal after discount</span>
          <span className="tabular-nums">₹{discountedSubtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Tax will be calculated automatically based on the client&apos;s state
          and country.
        </p>
      </div>
      {errors.form && (
        <p className="text-sm text-destructive">{errors.form[0]}</p>
      )}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !clientId || !dueDate}
      >
        {loading ? "Saving..." : "Save as draft"}
      </Button>
    </div>
  );
}
