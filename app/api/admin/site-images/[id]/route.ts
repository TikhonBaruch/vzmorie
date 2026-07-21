import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logUpdate, logDelete } from "@/lib/audit";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session?.user as any)?.role;
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { url, urlAfter, alt, title, desc, sort } = body;

    const image = await prisma.siteImage.update({
      where: { id },
      data: {
        ...(url !== undefined && { url }),
        ...(urlAfter !== undefined && { urlAfter }),
        ...(alt !== undefined && { alt }),
        ...(title !== undefined && { title }),
        ...(desc !== undefined && { desc }),
        ...(sort !== undefined && { sort }),
      },
    });

    logUpdate(
      "siteImage",
      id,
      (session.user as any).id || "",
      session.user?.name || "User",
      role,
      `Updated image: ${image.key}`
    );

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session?.user as any)?.role;
  if (!["SUPER_ADMIN", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.siteImage.delete({ where: { id } });

    logDelete(
      "siteImage",
      id,
      (session.user as any).id || "",
      session.user?.name || "User",
      role
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
