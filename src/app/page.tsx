import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <nav className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-primary">InvoiceFlow</span>
          <div className="flex items-center gap-6">
            <Link
              href="/demo"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Live demo
            </Link>
            {session ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Link>
                <Button asChild size="sm">
                  <Link href="/signup">Start free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/50 px-3 py-1 rounded-full">
              For Indian freelancers
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight leading-[1.15]">
              Get paid faster, without the GST paperwork
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Send a professional invoice, get GST calculated automatically, and
              let clients pay you by UPI in one tap. Built for one person — not
              an accounting team.
            </p>
            <div className="flex flex-wrap gap-3">
              {session ? (
                <Button asChild size="lg">
                  <Link href="/dashboard">Go to dashboard</Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href="/signup">Start invoicing free</Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline">
                <Link href="/demo">See a live demo</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card. No invoice limits. Set up in under 2 minutes.
            </p>
          </div>

          <div className="border rounded-2xl bg-card shadow-xl p-5">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground mb-1">Earned</p>
                <p className="text-base font-bold tabular-nums">₹42,000</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Outstanding
                </p>
                <p className="text-base font-bold tabular-nums">₹18,000</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground mb-1">This month</p>
                <p className="text-base font-bold tabular-nums">₹24,000</p>
              </div>
            </div>
            <div className="rounded-xl border divide-y">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Aarav Studio</p>
                  <p className="text-xs text-muted-foreground">INV-0042</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm tabular-nums">₹18,000</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-medium">
                    Overdue
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Kavya Designs</p>
                  <p className="text-xs text-muted-foreground">INV-0040</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm tabular-nums">₹10,000</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 font-medium">
                    Paid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm text-muted-foreground">
          <span>✓ Auto GST — CGST, SGST, or IGST</span>
          <span>✓ UPI &amp; card payments via Razorpay</span>
          <span>✓ No invoice caps, ever</span>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">
            Built for freelancers, not accountants
          </h2>
          <p className="text-muted-foreground">
            Everything you need. Nothing you don&apos;t.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">
              %
            </div>
            <h3 className="font-semibold mb-2">Tax handled for you</h3>
            <p className="text-sm text-muted-foreground">
              We work out CGST, SGST, or IGST from your client&apos;s state
              automatically. You never touch a tax calculator again.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">
              ₹
            </div>
            <h3 className="font-semibold mb-2">Get paid in one tap</h3>
            <p className="text-sm text-muted-foreground">
              Clients pay by UPI or card straight from the invoice. You get
              notified the second it lands — no bank statement checking.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">
              ↗
            </div>
            <h3 className="font-semibold mb-2">See who owes you money</h3>
            <p className="text-sm text-muted-foreground">
              Total earned, what&apos;s outstanding, what&apos;s overdue — the
              moment you log in, not buried in a report.
            </p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Send your first invoice in under 2 minutes
          </h2>
          <p className="opacity-90 mb-8">
            No credit card. No setup fee. No invoice caps.
          </p>
          {session ? (
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Start invoicing free</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <span className="font-bold text-lg text-primary">
                InvoiceFlow
              </span>
              <p className="text-sm text-muted-foreground mt-3 max-w-xs">
                GST-compliant invoicing and UPI payments, built for solo
                freelancers and small agencies across India.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/demo" className="hover:text-foreground">
                    Live demo
                  </Link>
                </li>
                {session ? (
                  <li>
                    <Link href="/dashboard" className="hover:text-foreground">
                      Dashboard
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link href="/signup" className="hover:text-foreground">
                        Get started
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="hover:text-foreground">
                        Log in
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Why InvoiceFlow</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>No invoice caps</li>
                <li>Automatic GST</li>
                <li>UPI-native payments</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © 2026 InvoiceFlow. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made for freelancers who&apos;d rather be working.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
