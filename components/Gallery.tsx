"use client";

import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const filters = [
  "Все",
  "Спиннинг/Джиг",
  "Подводная охота",
  "Отдых/Баня"
] as const;

const items = Array.from({ length: 8 }).map((_, idx) => ({
  id: idx,
  label: "Октябрь. Сом 24 кг. Егерь: Михалыч"
}));

export function Gallery() {
  const active = "Все";

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
              type="button"
              className={[
                "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-terracotta-600 text-white shadow-tactical shadow-black/40"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              ].join(" ")}
            >
              {filter}
            </button>
          );
        })}
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.1 } as const}
        className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-slate-800"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.7),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_60%)] opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/40 to-slate-900/80" />

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 px-3 text-center text-xs font-medium text-slate-100 opacity-0 backdrop-blur-sm transition group-hover:bg-black/70 group-hover:opacity-100">
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

