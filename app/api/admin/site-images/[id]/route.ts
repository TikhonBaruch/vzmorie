import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { url, alt, sort } = body;

    const image = await prisma.siteImage.update({
      where: { id },
      data: {
        ...(url !== undefined && { url }),
        ...(alt !== undefined && { alt }),
        ...(sort !== undefined && { sort }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.siteImage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
