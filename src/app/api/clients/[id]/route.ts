import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { clientSchema } from "@/lib/validations/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const { id } = await params;
  const client = await prisma.client.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!client) {
    return NextResponse.json(
      { success: false, message: "Client not found", data: null },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Client fetched",
    data: client,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const { id } = await params;
  const existing = await prisma.client.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Client not found", data: null },
      { status: 404 },
    );
  }

  const body = await request.json();
  const parsed = clientSchema.partial().safeParse(body);

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

  const updated = await prisma.client.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({
    success: true,
    message: "Client updated",
    data: updated,
  });
}
