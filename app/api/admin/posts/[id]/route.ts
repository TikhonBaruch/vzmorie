import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true } },
      tags: true,
      media: true,
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { title, content, excerpt, status, type, tags, coverImage, location, fishType, weight } = body;

  const data: any = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (excerpt !== undefined) data.excerpt = excerpt;
  if (status !== undefined) data.status = status;
  if (type !== undefined) data.type = type;
  if (coverImage !== undefined) data.coverImage = coverImage;
  if (location !== undefined) data.location = location;
  if (fishType !== undefined) data.fishType = fishType;
  if (weight !== undefined) data.weight = weight ? parseFloat(weight) : null;
  if (status === "PUBLISHED") data.publishedAt = new Date();

  if (tags !== undefined) {
    const tagRecords = await Promise.all(
      tags.map(async (tagName: string) => {
        const tagSlug = tagName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9а-яё-]/gi, "");
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          create: { name: tagName, slug: tagSlug },
          update: {},
        });
      })
    );
    data.tags = { set: tagRecords.map((t) => ({ id: t.id })) };
  }

  const post = await prisma.post.update({
    where: { id: params.id },
    data,
    include: { tags: true },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
