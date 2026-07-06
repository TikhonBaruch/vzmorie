"use client";

import { motion } from "framer-motion";
import { MapPin, Timer, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const rings = [
  {
    label: "5 минут",
    shortLabel: "5 мин",
    text: "Жереховые перекаты и котлы.",
    position: "top-8 left-6",
    color: "text-khaki-500 border-khaki-500/40",
    bg: "bg-khaki-500/10"
  },
  {
    label: "10 минут",
    shortLabel: "10 мин",
    text: "Зимовальные ямы 12-15м (Сом, Сазан).",
    position: "bottom-10 left-1/2 -translate-x-1/2",
    color: "text-terracotta-500 border-terracotta-500/40",
    bg: "bg-terracotta-500/10"
  },
  {
    label: "15–20 минут",
    shortLabel: "15-20 мин",
    text: "Каспийские раскаты («Черная вода», Щука).",
    position: "top-10 right-6",
    color: "text-sky-400 border-sky-400/40",
    bg: "bg-sky-400/10"
  }
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export function LocationMap() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const handleToggle = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

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
          90 км от Астрахани, трансфер через п. Кировский, далее лодкой.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Координаты: 45.758469, 48.136073
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-tactical shadow-black/40"
      >
        <div className="relative aspect-video w-full min-h-[320px] sm:min-h-[420px]">
          {/* Background map tiles - Kulaginsky Bank area (5x5 grid) */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: [
                [1295,1296,1297,1298,1299].map(x => [728,729,730,731,732].map(y => `url("https://tile.openstreetmap.org/11/${x}/${y}.png")`)).flat()
              ].flat().join(", "),
              backgroundSize: "256px 256px",
              backgroundRepeat: "no-repeat",
              filter: "invert(1) hue-rotate(180deg) saturate(0.4) brightness(0.7)",
              opacity: 0.35,
            }}
          />

          {/* Dark overlay layers */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.5),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.8),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.85),rgba(15,23,42,0.75)),radial-gradient(circle_at_center,rgba(15,23,42,0.1),transparent_60%)] mix-blend-screen opacity-90" />

          {/* Concentric rings */}
          <div className="pointer-events-none absolute inset-4 rounded-2xl border border-slate-800/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),_transparent_55%)] opacity-60" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.85),rgba(15,23,42,0.7))]" />
            <div className="absolute inset-6 rounded-full border border-slate-700/40" />
            <div className="absolute inset-12 rounded-full border border-slate-700/30" />
            <div className="absolute inset-16 rounded-full border border-slate-700/20" />
          </div>

          {/* Center marker */}
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

          {/* Center label */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              База
            </span>
            <span className="mt-1 text-sm font-semibold text-slate-100">
              Взморье
            </span>
          </div>

          {/* Desktop: absolute positioned cards */}
          <div className="hidden sm:block">
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

          {/* Mobile: collapsible cards at bottom */}
          <div className="sm:hidden absolute inset-x-0 bottom-0 p-3">
            <div className="flex gap-2 justify-center">
              {rings.map((ring, index) => {
                const isExpanded = expanded === index;
                return (
                  <button
                    key={ring.label}
                    onClick={() => handleToggle(index)}
                    className={`flex-shrink-0 rounded-xl border transition-all duration-200 ${
                      isExpanded
                        ? `border-slate-700 bg-slate-950/95 ${ring.color}`
                        : `border-slate-800/60 bg-slate-950/80 ${ring.color}`
                    }`}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-2">
                      <Timer className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">{ring.shortLabel}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3 opacity-50" />
                      ) : (
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                    {isExpanded && (
                      <div className="border-t border-slate-800/60 px-3 py-2">
                        <div className="text-[11px] leading-relaxed text-slate-300">
                          {ring.text}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
