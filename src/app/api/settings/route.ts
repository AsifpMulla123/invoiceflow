import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { settingsSchema } from "@/lib/validations/settings";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  return NextResponse.json({
    success: true,
    message: "Settings fetched",
    data: {
      businessName: user?.businessName ?? "",
      gstin: user?.gstin ?? "",
      state: user?.state ?? "",
      bankDetails: user?.bankDetails ?? "",
      logoUrl: user?.logoUrl ?? "",
    },
  });
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 },
    );
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);

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

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });

  return NextResponse.json({
    success: true,
    message: "Settings updated",
    data: updated,
  });
}
