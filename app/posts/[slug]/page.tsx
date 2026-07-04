"use client";

import { use } from "react";
import { trpc } from "@/lib/trpc";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Fish,
  Weight,
  MessageSquare,
} from "lucide-react";

const typeLabels: Record<string, string> = {
  CATCH: "Улов",
  WEATHER: "Погода",
  WATER_LEVEL: "Уровень воды",
  EVENT: "Событие",
  PROMO: "Акция",
  NEWS: "Новость",
};

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: post, isLoading } = trpc.post.bySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100">
            Публикация не найдена
          </h1>
          <Link
            href="/posts"
            className="mt-4 inline-flex items-center gap-2 text-terracotta-500 hover:text-terracotta-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container-tactical py-24">
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
                  <Weight className="h-4 w-4 text-khaki-500" />
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
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-100">
            <MessageSquare className="h-5 w-5" />
            Комментарии ({post.comments.length})
          </h2>

          {post.comments.length === 0 ? (
            <p className="text-slate-400">Пока нет комментариев</p>
          ) : (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="flex items-center gap-2">
                    {comment.author.image && (
                      <img
                        src={comment.author.image}
                        alt=""
                        className="h-6 w-6 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-slate-200">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
