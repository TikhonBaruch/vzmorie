import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.siteImage.findMany({
    orderBy: { sort: "asc" },
    select: { key: true, url: true, alt: true, sort: true },
  });
  return NextResponse.json(images);
}
