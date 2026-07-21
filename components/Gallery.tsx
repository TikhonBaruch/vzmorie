"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

interface GalleryImage {
  id: string;
  url: string;
  urlAfter: string | null;
  title: string | null;
  desc: string | null;
}

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

export const TYPE_LABELS: Record<string, string> = {
  CATCH: "Улов",
  WEATHER: "Погода",
  WATER_LEVEL: "Уровень воды",
  EVENT: "Мероприятие",
  PROMO: "Акция",
  NEWS: "Новость",
};

const MAX_ITEMS = 8;

export function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/site-images")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch("/api/public/posts")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ]).then(([imagesData, postsData]) => {
      setGalleryImages(
        imagesData
          .filter((img: any) => img.key.startsWith("gallery_"))
          .sort((a: any, b: any) => a.sort - b.sort)
      );
      setPosts(postsData.filter((p: Post) => p.type !== "WEATHER" && p.type !== "WATER_LEVEL"));
    });
  }, []);

  const allItems = [...galleryImages, ...posts.map((p) => ({
    id: p.id,
    url: p.coverImage || "",
    urlAfter: null,
    title: p.title,
    desc: p.fishType ? `${p.fishType}${p.weight ? ` — ${p.weight} кг` : ""}` : null,
  }))];
  const displayedItems = allItems.slice(0, MAX_ITEMS);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + displayedItems.length) % displayedItems.length : null));
  const nextImage = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % displayedItems.length : null));

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
        transition={{ ...fadeIn.transition, delay: 0.1 } as const}
        className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        {displayedItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            Пока нет публикаций. Загрузите фото через Telegram-бота!
          </div>
        ) : (
          displayedItems.map((item, idx) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-800 cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              {item.url ? (
                <Image
                  src={item.url}
                  alt={item.title || ""}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

              {item.urlAfter && (
                <div className="absolute right-2 top-2">
                  <span className="inline-block rounded-full bg-blue-600/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    До/После
                  </span>
                </div>
              )}

              <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition group-hover:opacity-100">
                <div className="text-xs font-medium text-slate-100">
                  {item.title}
                </div>
                {item.desc && (
                  <div className="mt-1 text-xs text-slate-300">
                    {item.desc}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </motion.div>

      {posts.length > 0 && (
        <motion.div
          {...fadeIn}
          transition={{ ...fadeIn.transition, delay: 0.15 } as const}
          className="mt-8 text-center"
        >
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            Все публикации
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 p-2 text-white/70 hover:text-white z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 p-2 text-white/70 hover:text-white z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <div
              className="max-w-5xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {displayedItems[lightboxIndex] && (
                <>
                  {displayedItems[lightboxIndex].urlAfter ? (
                    // Before/After side-by-side
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={displayedItems[lightboxIndex].url}
                          alt="До"
                          fill
                          className="object-cover"
                          sizes="50vw"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                          До
                        </div>
                      </div>
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={displayedItems[lightboxIndex].urlAfter!}
                          alt="После"
                          fill
                          className="object-cover"
                          sizes="50vw"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                          После
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Single image
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={displayedItems[lightboxIndex].url}
                        alt={displayedItems[lightboxIndex].title || ""}
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                  )}

                  {displayedItems[lightboxIndex].title && (
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold text-white">
                        {displayedItems[lightboxIndex].title}
                      </h3>
                      {displayedItems[lightboxIndex].desc && (
                        <p className="text-sm text-slate-400 mt-1">
                          {displayedItems[lightboxIndex].desc}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 text-center text-sm text-slate-500">
                    {lightboxIndex + 1} / {displayedItems.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
