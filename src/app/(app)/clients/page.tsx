import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ClientsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const clients = await prisma.client.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">+ Add client</Link>
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="border rounded-xl p-10 text-center text-muted-foreground">
          <p className="mb-4">
            No clients yet — add your first client to get started.
          </p>
          <Button asChild>
            <Link href="/clients/new">+ Add client</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Link
                    href={`/clients/${client.id}`}
                    className="text-primary hover:underline"
                  >
                    {client.name}
                  </Link>
                </TableCell>
                <TableCell>{client.state}</TableCell>
                <TableCell>{client.email || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
