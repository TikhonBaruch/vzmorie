"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
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

interface SiteImage {
  key: string;
  url: string;
  alt: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  CATCH: "Улов",
  WEATHER: "Погода",
  WATER_LEVEL: "Уровень воды",
  EVENT: "Мероприятие",
  PROMO: "Акция",
  NEWS: "Новость",
};

const filters = ["Все", "CATCH", "NEWS", "EVENT"] as const;

export function Gallery() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [active, setActive] = useState<string>("Все");

  useEffect(() => {
    Promise.all([
      fetch("/api/public/posts")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch("/api/site-images")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ]).then(([postsData, imagesData]) => {
      setPosts(postsData.filter((p: Post) => p.type !== "WEATHER" && p.type !== "WATER_LEVEL"));
      setSiteImages(imagesData.filter((img: SiteImage) => img.key.startsWith("gallery_")));
    });
  }, []);

  const gallerySiteImages = siteImages.map((img, i) => ({
    id: `site_${img.key}`,
    title: img.alt || `Фото ${i + 1}`,
    coverImage: img.url,
    type: "SITE",
    fishType: null,
    weight: null,
    location: null,
    publishedAt: null,
  }));

  const allItems = [...gallerySiteImages, ...posts];
  const filtered = active === "Все"
    ? allItems
    : allItems.filter((p) => p.type === active);

  return (
    <section className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Реальные трофеи. Реальные люди.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          Никаких стоковых фото. Только уловы наших гостей.
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
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
                  ? "bg-terracotta-600 text-white shadow-tactical shadow-black/40"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              ].join(" ")}
            >
              {filter === "Все" ? "Все" : TYPE_LABELS[filter] || filter}
            </button>
          );
        })}
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.1 } as const}
        className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            Пока нет публикаций. Загрузите фото через Telegram-бота!
          </div>
        ) : (
          filtered.map((post) => (
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
                  sizes="(max-width: 768px) 50vw, 25vw"
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
              </div>

              <div className="absolute left-2 top-2">
                <span className="inline-block rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-sm">
                  {TYPE_LABELS[post.type] || post.type}
                </span>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </section>
  );
}
