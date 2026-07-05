import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const post = await prisma.post.findFirst({
    where: { type: "WEATHER", status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, content: true, publishedAt: true },
  });

  return NextResponse.json(post);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    // Find existing weather post or create new one
    let post;
    if (id) {
      post = await prisma.post.update({
        where: { id },
        data: { title, content, publishedAt: new Date() },
      });
    } else {
      // Find first user for author
      const author = await prisma.user.findFirst();
      if (!author) {
        return NextResponse.json({ error: "No author" }, { status: 500 });
      }

      post = await prisma.post.create({
        data: {
          title: title || `Сводка на ${new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}`,
          slug: `weather-${Date.now()}`,
          content,
          type: "WEATHER",
          status: "PUBLISHED",
          publishedAt: new Date(),
          authorId: author.id,
        },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
