"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Fish } from "lucide-react";
const TYPE_LABELS: Record<string, string> = {
  CATCH: "Улов",
  WEATHER: "Погода",
  WATER_LEVEL: "Уровень воды",
  EVENT: "Мероприятие",
  PROMO: "Акция",
  NEWS: "Новость",
};

interface Post {
  id: string;
  title: string;
  coverImage: string | null;
  type: string;
  fishType: string | null;
  weight: number | null;
  location: string | null;
  publishedAt: string | null;
}

const filters = ["Все", "CATCH", "NEWS", "EVENT", "PROMO"] as const;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("Все");

  useEffect(() => {
    fetch("/api/public/posts?limit=100")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setPosts(data.filter((p: Post) => p.type !== "WEATHER" && p.type !== "WATER_LEVEL"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "Все"
    ? posts
    : posts.filter((p) => p.type === active);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container-tactical py-24">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Вести с воды</h1>
            <p className="mt-1 text-sm text-slate-400">
              Все публикации с воды — уловы, новости, события
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = filter === active;
            return (
              <button
                key={filter}
                onClick={() => setActive(filter)}
                type="button"
                className={[
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-terracotta-600 text-white"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                ].join(" ")}
              >
                {filter === "Все" ? "Все" : TYPE_LABELS[filter] || filter}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <p className="text-slate-400">Нет публикаций</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-slate-800"
              >
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition group-hover:opacity-100">
                  <div className="text-xs font-medium text-slate-100">
                    {post.title}
                  </div>
                  {post.fishType && (
                    <div className="mt-1 text-xs text-slate-300">
                      {post.fishType}{post.weight ? ` — ${post.weight} кг` : ""}
                    </div>
                  )}
                  {post.publishedAt && (
                    <div className="mt-1 text-[10px] text-slate-400">
                      {new Date(post.publishedAt).toLocaleDateString("ru-RU")}
                    </div>
                  )}
                </div>

                <div className="absolute left-2 top-2">
                  <span className="inline-block rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-sm">
                    {TYPE_LABELS[post.type] || post.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Count */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {filtered.length} {filtered.length === 1 ? "публикация" : filtered.length < 5 ? "публикации" : "публикаций"}
        </div>
      </div>
    </div>
  );
}
