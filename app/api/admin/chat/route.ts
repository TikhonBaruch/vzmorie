import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-яё-]/gi, "")
    .slice(0, 80);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, coverImage, type } = await request.json();
  const content = text || "";

  if (!content && !coverImage) {
    return NextResponse.json({ error: "Нет содержимого" }, { status: 400 });
  }

  // Parse hashtags
  const hashtagRegex = /#(\S+)/g;
  const tagNames: string[] = [];
  let match;
  while ((match = hashtagRegex.exec(content)) !== null) {
    tagNames.push(match[1]);
  }

  // Generate title from content (first line, max 100 chars, strip hashtags)
  const cleanContent = content.replace(/#\S+/g, "").trim();
  const title =
    cleanContent.slice(0, 100).split("\n")[0] ||
    (coverImage ? "Фото из чата" : "Публикация из чата");

  // Generate unique slug
  let slug = generateSlug(title);
  let slugCandidate = slug;
  let counter = 0;
  while (await prisma.post.findUnique({ where: { slug: slugCandidate } })) {
    counter++;
    slugCandidate = `${slug}-${counter}`;
  }

  // Generate excerpt
  const excerpt = cleanContent
    ? cleanContent.slice(0, 150) + (cleanContent.length > 150 ? "..." : "")
    : null;

  // Find author from session
  const author = await prisma.user.findUnique({
    where: { email: session.user.email || "" },
  });

  if (!author) {
    return NextResponse.json({ error: "Автор не найден" }, { status: 500 });
  }

  // Create tags
  const tagConnections = [];
  for (const tagName of tagNames) {
    const tagSlug = tagName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9а-яё-]/gi, "");
    const tag = await prisma.tag.upsert({
      where: { slug: tagSlug },
      update: {},
      create: { name: tagName, slug: tagSlug },
    });
    tagConnections.push({ id: tag.id });
  }

  // Create post
  const post = await prisma.post.create({
    data: {
      title,
      slug: slugCandidate,
      content: content || null,
      excerpt,
      type: (type || "NEWS") as "CATCH" | "WEATHER" | "WATER_LEVEL" | "EVENT" | "NEWS",
      status: "PENDING",
      coverImage: coverImage || null,
      authorId: author.id,
      tags: tagConnections.length > 0 ? { connect: tagConnections } : undefined,
    },
    include: {
      author: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  return NextResponse.json({
    ok: true,
    post: {
      id: post.id,
      title: post.title,
      type: post.type,
      status: post.status,
      tags: post.tags.map((t) => t.name),
      author: post.author?.name,
    },
  });
}
