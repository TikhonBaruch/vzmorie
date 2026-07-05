import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.siteImage.findMany({
    orderBy: { sort: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key, url, alt, sort } = body;

    if (!key || !url) {
      return NextResponse.json({ error: "key and url required" }, { status: 400 });
    }

    const image = await prisma.siteImage.upsert({
      where: { key },
      update: { url, alt, sort },
      create: { key, url, alt, sort: sort ?? 0 },
    });

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
