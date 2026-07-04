import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (type && type !== "all") where.type = type;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { id: true, name: true } },
      tags: true,
      _count: { select: { comments: true, media: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, content, excerpt, type, tags, coverImage, location, fishType, weight } = body;

  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-яё-]/gi, "")
    .slice(0, 100);

  const slugUnique = `${slug}-${Date.now()}`;

  // Ensure we have an author — use first user or create system user
  let author = await prisma.user.findFirst();
  if (!author) {
    author = await prisma.user.create({
      data: { name: "System", role: "ADMIN" },
    });
  }

  // Handle tags
  const tagRecords = tags?.length
    ? await Promise.all(
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
      )
    : [];

  const post = await prisma.post.create({
    data: {
      title,
      slug: slugUnique,
      content,
      excerpt,
      coverImage,
      type: type || "CATCH",
      status: "DRAFT",
      authorId: author.id,
      location,
      fishType,
      weight: weight ? parseFloat(weight) : null,
      tags: tagRecords.length ? { connect: tagRecords.map((t) => ({ id: t.id })) } : undefined,
    },
    include: { tags: true },
  });

  return NextResponse.json(post, { status: 201 });
}
