import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = await params;

  const client = await prisma.client.findFirst({
    where: { id, userId: session!.user.id },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-semibold mb-1">{client.name}</h1>
      <p className="text-muted-foreground mb-6">
        {client.state}, {client.country}
      </p>

      <div className="space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">Email:</span>{" "}
          {client.email || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">Phone:</span>{" "}
          {client.phone || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">GSTIN:</span>{" "}
          {client.gstin || "—"}
        </p>
      </div>

      <p className="text-sm text-muted-foreground mt-8">
        Invoice history will appear here once invoices exist (Day 4 onward).
      </p>
    </div>
  );
}
