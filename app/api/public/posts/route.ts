import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = { status: "PUBLISHED" };
    if (type) where.type = type;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        coverImage: true,
        type: true,
        fishType: true,
        weight: true,
        location: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
