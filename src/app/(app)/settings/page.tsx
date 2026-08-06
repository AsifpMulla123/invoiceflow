"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDIAN_STATES } from "@/lib/constants/indian-states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    gstin: "",
    state: "",
    bankDetails: "",
    logoUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setForm(result.data);
      })
      .finally(() => setLoadingInitial(false));
  }, []);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();

      if (!result.success) {
        if (result.data) setErrors(result.data);
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setErrors({
        form: ["Something went wrong. Check your connection and try again."],
      });
    } finally {
      setLoading(false);
    }
  }
  if (loadingInitial) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading settings...
      </div>
    );
  }
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Business settings</h1>
      <p className="text-muted-foreground text-sm mb-6">
        These details appear on every invoice and drive automatic GST
        calculation.
      </p>

      <form
        onSubmit={handleSubmit}
        className="border rounded-2xl p-6 bg-card space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            value={form.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            required
          />
          {errors.businessName && (
            <p className="text-sm text-destructive">{errors.businessName[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>

          <Select
            value={form.state}
            onValueChange={(value) => handleChange("state", value)}
          >
            <SelectTrigger id="state" className="w-full">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.state && (
            <p className="text-sm text-destructive">{errors.state[0]}</p>
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
          <Label htmlFor="bankDetails">Bank details (optional)</Label>
          <Input
            id="bankDetails"
            value={form.bankDetails}
            onChange={(e) => handleChange("bankDetails", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL (optional)</Label>
          <Input
            id="logoUrl"
            value={form.logoUrl}
            onChange={(e) => handleChange("logoUrl", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Must be a direct link to a PNG or JPG image, publicly accessible
            without login. Some hosts (like Wikimedia) block automated requests
            — placehold.co or your own image host work reliably.
          </p>
          {errors.logoUrl && (
            <p className="text-sm text-destructive">{errors.logoUrl[0]}</p>
          )}
        </div>

        {errors.form && (
          <p className="text-sm text-destructive">{errors.form[0]}</p>
        )}
        {success && <p className="text-sm text-emerald-600">Settings saved.</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
