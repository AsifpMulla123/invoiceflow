import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { clientSchema } from "@/lib/validations/client";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    message: "Clients fetched",
    data: clients,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const body = await request.json();
  const parsed = clientSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        data: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const client = await prisma.client.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json(
    { success: true, message: "Client created", data: client },
    { status: 201 },
  );
}
