"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Fish, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

const TYPE_LABELS: Record<string, string> = {
  CATCH: "Улов",
  WEATHER: "Погода",
  WATER_LEVEL: "Уровень воды",
  EVENT: "Мероприятие",
  PROMO: "Акция",
  NEWS: "Новость",
};

const TYPE_COLORS: Record<string, string> = {
  CATCH: "bg-khaki-600/80",
  WEATHER: "bg-blue-600/80",
  WATER_LEVEL: "bg-cyan-600/80",
  EVENT: "bg-purple-600/80",
  PROMO: "bg-terracotta-600/80",
  NEWS: "bg-slate-600/80",
};

interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  type: string;
  fishType: string | null;
  weight: number | null;
  location: string | null;
  publishedAt: string | null;
}

const PER_PAGE = 12;
const ALL_FILTERS = ["Все", "CATCH", "NEWS", "EVENT", "PROMO", "WEATHER", "WATER_LEVEL"] as const;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("Все");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/public/posts?limit=200")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "Все"
    ? posts
    : posts.filter((p) => p.type === active);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page when filter changes
  const handleFilterChange = (filter: string) => {
    setActive(filter);
    setPage(1);
  };

  // Count posts per type
  const typeCounts = posts.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="text-slate-100">
      <Header />
      <main className="container-tactical pb-16 pt-24 sm:pt-28">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
        </div>

        <div className="mb-2 text-[10px] tracking-[0.2em] text-slate-500 uppercase">Блог</div>
        <h1 className="mb-2 text-3xl font-bold text-slate-100">Вести с воды</h1>
        <p className="mb-8 text-sm text-slate-400">
          {filtered.length > 0
            ? `${filtered.length} ${filtered.length === 1 ? "публикация" : filtered.length < 5 ? "публикации" : "публикаций"}`
            : "Публикаций пока нет"}
        </p>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {ALL_FILTERS.map((filter) => {
            const isActive = filter === active;
            const count = filter === "Все" ? posts.length : (typeCounts[filter] || 0);
            return (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                type="button"
                className={[
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-terracotta-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                ].join(" ")}
              >
                {filter === "Все" ? "Все" : TYPE_LABELS[filter] || filter}
                {count > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Загрузка...</div>
        ) : paginated.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <p className="text-slate-400">Нет публикаций в этой категории</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {paginated.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
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
                  <div className="text-xs font-medium text-slate-100 line-clamp-2">
                    {post.title}
                  </div>
                  {post.fishType && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                      <Fish className="h-3 w-3" />
                      {post.fishType}{post.weight ? ` — ${post.weight} кг` : ""}
                    </div>
                  )}
                  {post.publishedAt && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishedAt).toLocaleDateString("ru-RU")}
                    </div>
                  )}
                </div>

                <div className="absolute left-2 top-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm ${TYPE_COLORS[post.type] || "bg-slate-600/80"}`}>
                    {TYPE_LABELS[post.type] || post.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-slate-200 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-sm transition ${
                  p === page
                    ? "bg-terracotta-600 text-white"
                    : "border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-slate-200 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
