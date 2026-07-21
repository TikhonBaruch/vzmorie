import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logCreate } from "@/lib/audit";

export async function GET() {
  const images = await prisma.siteImage.findMany({
    orderBy: { sort: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session?.user as any)?.role;
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { key, url, urlAfter, alt, title, desc, sort } = body;

    if (!key || !url) {
      return NextResponse.json({ error: "key and url required" }, { status: 400 });
    }

    const image = await prisma.siteImage.upsert({
      where: { key },
      update: { url, urlAfter, alt, title, desc, sort },
      create: { key, url, urlAfter, alt, title, desc, sort: sort ?? 0 },
    });

    logCreate(
      "siteImage",
      image.id,
      (session.user as any).id || "",
      session.user?.name || "User",
      role,
      `Created/updated image: ${key}`
    );

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
