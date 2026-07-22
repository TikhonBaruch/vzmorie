import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Fish,
  Scale,
  MessageSquare,
} from "lucide-react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ShareButtons } from "@/components/ShareButtons";
import { CommentsSection } from "@/components/CommentsSection";
import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await prisma.post.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: {
        title: true,
        excerpt: true,
        coverImage: true,
        content: true,
        metaTitle: true,
        metaDescription: true,
        ogImage: true,
      },
    });

    if (!post) return { title: "Публикация не найдена" };

    const title = post.metaTitle || post.title;
    const description =
      post.metaDescription ||
      post.excerpt ||
      post.content?.slice(0, 160) ||
      "";
    const image =
      post.ogImage ||
      post.coverImage ||
      `${SITE_URL}/images/hero.jpg`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/posts/${slug}`,
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `${SITE_URL}/posts/${slug}`,
      },
    };
  } catch {
    const { slug } = await params;
    return {
      title: "Публикация",
      description: "",
      alternates: { canonical: `${SITE_URL}/posts/${slug}` },
    };
  }
}

const typeLabels: Record<string, string> = {
  CATCH: "Улов",
  WEATHER: "Погода",
  WATER_LEVEL: "Уровень воды",
  EVENT: "Событие",
  PROMO: "Акция",
  NEWS: "Новость",
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      tags: { select: { id: true, name: true, slug: true } },
      media: { orderBy: { createdAt: "asc" } },
      comments: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: {
            include: {
              author: { select: { id: true, name: true, image: true } },
            },
          },
        },
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) notFound();

  const seoTitle = post.metaTitle || post.title;
  const seoDesc =
    post.metaDescription ||
    post.excerpt ||
    post.content?.slice(0, 160) ||
    "";
  const seoImage =
    post.ogImage ||
    post.coverImage ||
    `${SITE_URL}/images/hero.jpg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seoTitle,
    description: seoDesc,
    image: seoImage,
    url: `${SITE_URL}/posts/${post.slug}`,
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.author?.name || "Взморье",
    },
    publisher: {
      "@type": "Organization",
      name: "Взморье",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/hero.jpg` },
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Публикации",
        item: `${SITE_URL}/posts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: seoTitle,
        item: `${SITE_URL}/posts/${post.slug}`,
      },
    ],
  };

  return (
    <div className="text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Header />
      <main className="container-tactical pb-16 pt-24 sm:pt-28">
        <Link
          href="/posts"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к вестям
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            {typeLabels[post.type]}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-100">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
            {post.author && (
              <span className="flex items-center gap-2">
                {post.author.image && (
                  <img
                    src={post.author.image}
                    alt=""
                    className="h-6 w-6 rounded-full"
                  />
                )}
                {post.author.name}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {post.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {post.location}
              </span>
            )}
          </div>

          {/* Fish info */}
          {(post.fishType || post.weight) && (
            <div className="mt-4 flex gap-4">
              {post.fishType && (
                <span className="flex items-center gap-1 text-sm text-slate-300">
                  <Fish className="h-4 w-4 text-khaki-500" />
                  {post.fishType}
                </span>
              )}
              {post.weight && (
                <span className="flex items-center gap-1 text-sm text-slate-300">
                  <Scale className="h-4 w-4 text-khaki-500" />
                  {post.weight} кг
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-6 border-t border-slate-800 pt-6">
            <ShareButtons
              url={`${SITE_URL}/posts/${post.slug}`}
              title={post.title}
              description={post.content?.slice(0, 200) || post.title}
            />
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-200">
              {post.content}
            </div>
          </div>
        )}

        {/* Media gallery */}
        {post.media.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Медиа
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {post.media.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={item.url}
                    alt={item.filename || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 384px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments temporarily disabled */}
        {/* <CommentsSection postSlug={post.slug} /> */}
      </main>
      <Footer />
    </div>
  );
}
