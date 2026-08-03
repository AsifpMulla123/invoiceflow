import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const userId = session.user.id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalEarnedAllTime,
    totalEarnedThisMonth,
    outstandingByStatus,
    recentInvoices,
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: { userId, status: "PAID" },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { userId, status: "PAID", createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    prisma.invoice.groupBy({
      by: ["status"],
      where: { userId, status: { in: ["SENT", "VIEWED", "OVERDUE"] } },
      _sum: { total: true },
    }),
    prisma.invoice.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const overdue =
    outstandingByStatus.find((g) => g.status === "OVERDUE")?._sum.total ?? 0;
  const pending = outstandingByStatus
    .filter((g) => g.status !== "OVERDUE")
    .reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0);

  return NextResponse.json({
    success: true,
    message: "Dashboard data fetched",
    data: {
      totalEarnedAllTime: Number(totalEarnedAllTime._sum.total ?? 0),
      totalEarnedThisMonth: Number(totalEarnedThisMonth._sum.total ?? 0),
      overdue: Number(overdue),
      pending,
      recentInvoices,
    },
  });
}
