import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const result = await prisma.invoice.updateMany({
    where: {
      status: { in: ["SENT", "VIEWED"] },
      dueDate: { lt: new Date() },
    },
    data: { status: "OVERDUE" },
  });

  return NextResponse.json({
    success: true,
    message: `${result.count} invoice(s) marked overdue`,
    data: { count: result.count },
  });
}
