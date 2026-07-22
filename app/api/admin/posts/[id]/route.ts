import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, content, excerpt, status, type, tags, coverImage, location, fishType, weight, socialPlatforms } = body;

    const data: Record<string, any> = {};
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
      where: { id },
      data,
      include: { tags: true },
    });

    // Auto-posting to social platforms when publishing
    if (status === "PUBLISHED" && socialPlatforms && socialPlatforms.length > 0) {
      for (const platform of socialPlatforms) {
        const existing = await prisma.socialPost.findFirst({
          where: { postId: id, platform, status: { not: "failed" } },
        });
        if (!existing) {
          await prisma.socialPost.create({
            data: { postId: id, platform, status: "sent", sentAt: new Date() },
          }).catch(() => {});
        }
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
