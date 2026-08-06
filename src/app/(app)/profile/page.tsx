import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { LogoutButton } from "@/components/logout-button";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      {/* Identity header */}
      <div className="border rounded-2xl p-6 bg-card mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Business details */}
      <div className="border rounded-2xl bg-card mb-6 overflow-hidden">
        <p className="text-xs font-semibold text-muted-foreground px-5 pt-4 pb-2 uppercase tracking-wide">
          Business details
        </p>
        <div className="divide-y">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">Business name</span>
            <span className="text-sm">{user?.businessName || "Not set"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">GSTIN</span>
            <span className="text-sm">{user?.gstin || "Not set"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-muted-foreground">State</span>
            <span className="text-sm">{user?.state || "Not set"}</span>
          </div>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
