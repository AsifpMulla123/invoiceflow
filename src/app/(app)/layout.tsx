import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.api.getSession({ headers: await headers() });

  return (
    <div className="min-h-screen bg-muted/20">
      <nav className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="font-bold text-base sm:text-lg text-primary shrink-0"
          >
            InvoiceFlow
          </Link>
          <div className="flex items-center gap-3 sm:gap-6 text-sm overflow-x-auto">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/invoices"
              className="text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Invoices
            </Link>
            <Link
              href="/clients"
              className="text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Clients
            </Link>
            <Link
              href="/profile"
              className="text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className="text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
