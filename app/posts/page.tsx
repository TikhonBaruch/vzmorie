"use client";

import { trpc } from "@/lib/trpc";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Fish, Waves } from "lucide-react";

const typeLabels: Record<string, string> = {
  CATCH: "Улов",
  WEATHER: "Погода",
  WATER_LEVEL: "Уровень воды",
  EVENT: "Событие",
  PROMO: "Акция",
  NEWS: "Новость",
};

const typeColors: Record<string, string> = {
  CATCH: "bg-blue-900/50 text-blue-300",
  WEATHER: "bg-yellow-900/50 text-yellow-300",
  WATER_LEVEL: "bg-cyan-900/50 text-cyan-300",
  EVENT: "bg-purple-900/50 text-purple-300",
  PROMO: "bg-pink-900/50 text-pink-300",
  NEWS: "bg-slate-800 text-slate-300",
};

export default function PostsPage() {
  const { data, isLoading } = trpc.post.list.useQuery({
    status: "PUBLISHED",
    limit: 12,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  const posts = data?.posts || [];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container-tactical py-24">
        <h1 className="mb-8 text-3xl font-bold text-slate-100">
          Вести с воды
        </h1>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <Waves className="mx-auto h-12 w-12 text-slate-600" />
            <p className="mt-4 text-slate-400">Пока нет публикаций</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition hover:border-slate-700 hover:bg-slate-900"
              >
                {/* Cover image */}
                {post.coverImage && (
                  <div className="relative aspect-video">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-5">
                  {/* Type badge */}
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${typeColors[post.type]}`}
                  >
                    {typeLabels[post.type]}
                  </span>

                  {/* Title */}
                  <h2 className="mt-3 text-lg font-semibold text-slate-100 group-hover:text-white">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                    {post.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {post.location}
                      </span>
                    )}
                    {post.fishType && (
                      <span className="flex items-center gap-1">
                        <Fish className="h-3 w-3" />
                        {post.fishType}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("ru-RU")
                        : ""}
                    </span>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
