import { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vzmorie-five.vercel.app";

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/posts`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  // Dynamic post pages - fetch from API at runtime
  try {
    const { prisma } = await import("@/lib/prisma");
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });

    const postPages = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...postPages];
  } catch {
    // During build, just return static pages
    return staticPages;
  }
}
