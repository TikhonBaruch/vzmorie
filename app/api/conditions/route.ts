import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const post = await prisma.post.findFirst({
      where: {
        type: "WEATHER",
        status: "PUBLISHED",
      },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        publishedAt: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
