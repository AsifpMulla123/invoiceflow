"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClientForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    state: "",
    email: "",
    gstin: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!result.success) {
        if (result.data) setErrors(result.data);
        return;
      }

      router.push("/clients");
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={form.state}
          onChange={(e) => handleChange("state", e.target.value)}
          required
        />
        {errors.state && (
          <p className="text-sm text-destructive">{errors.state[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="gstin">GSTIN (optional)</Label>
        <Input
          id="gstin"
          value={form.gstin}
          onChange={(e) => handleChange("gstin", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>
      {errors.form && (
        <p className="text-sm text-destructive">{errors.form[0]}</p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add client"}
      </Button>
    </form>
  );
}
