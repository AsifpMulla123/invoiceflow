"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });
      if (signInError) {
        setError(
          signInError.message ?? "Login failed. Check your email and password.",
        );
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-bold text-lg text-primary">
            InvoiceFlow
          </Link>
          <h1 className="text-2xl font-bold mt-8 mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Log in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-12">
        <div className="border rounded-2xl bg-card shadow-xl p-6 max-w-sm w-full">
          <p className="text-xs text-muted-foreground mb-3">
            Dashboard preview
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-muted/60 p-3">
              <p className="text-xs text-muted-foreground mb-1">Earned</p>
              <p className="text-lg font-bold tabular-nums">₹42,000</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-3">
              <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
              <p className="text-lg font-bold tabular-nums">₹18,000</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Track every invoice, from sent to paid, in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
