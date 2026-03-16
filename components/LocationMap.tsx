"use client";

import { motion } from "framer-motion";
import { MapPin, Timer } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }
};

const rings = [
  {
    label: "5 минут",
    text: "Жереховые перекаты и котлы.",
    position: "top-8 left-6",
    color: "text-khaki-500 border-khaki-500/40"
  },
  {
    label: "10 минут",
    text: "Зимовальные ямы 12-15м (Сом, Сазан).",
    position: "bottom-10 left-1/2 -translate-x-1/2",
    color: "text-terracotta-500 border-terracotta-500/40"
  },
  {
    label: "15–20 минут",
    text: "Каспийские раскаты («Черная вода», Щука).",
    position: "top-10 right-6",
    color: "text-sky-400 border-sky-400/40"
  }
];

export function LocationMap() {
  return (
    <section className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          В самом эпицентре рыбных путей.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          Локация решает. База стоит на русле, а не в тупиковом ерике.
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 }}
        className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-tactical shadow-black/40"
      >
        <div className="relative aspect-video w-full min-h-[320px] sm:min-h-[420px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.6),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.9),rgba(15,23,42,0.8)),radial-gradient(circle_at_center,rgba(15,23,42,0.1),transparent_60%)] mix-blend-screen opacity-90" />

          <div className="pointer-events-none absolute inset-4 rounded-2xl border border-slate-800/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),_transparent_55%)] opacity-60" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.85),rgba(15,23,42,0.7))]" />
            <div className="absolute inset-6 rounded-full border border-slate-700/40" />
            <div className="absolute inset-12 rounded-full border border-slate-700/30" />
            <div className="absolute inset-16 rounded-full border border-slate-700/20" />
          </div>

          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-terracotta-600/20 ring-2 ring-terracotta-500/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 ring-2 ring-terracotta-500">
                <MapPin className="h-5 w-5 text-terracotta-400" />
              </div>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              База
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-100">
              Взморье
            </span>
          </div>

          {rings.map((ring) => (
            <div
              key={ring.label}
              className={`pointer-events-auto absolute ${ring.position}`}
            >
              <div className="rounded-2xl bg-slate-950/80 p-[1px] backdrop-blur">
                <div
                  className={`flex items-start gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 ${ring.color}`}
                >
                  <Timer className="mt-0.5 h-3.5 w-3.5" />
                  <div>
                    <div className="font-semibold">{ring.label}</div>
                    <div className="mt-0.5 text-[11px] text-slate-300">
                      {ring.text}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

