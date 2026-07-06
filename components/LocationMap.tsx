"use client";

import { motion } from "framer-motion";
import { MapPin, Timer, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const COORDS = { lat: 45.758469, lng: 48.136073 };

const rings = [
  {
    label: "5 минут",
    text: "Жереховые перекаты и котлы.",
    color: "text-khaki-500 border-khaki-500/40"
  },
  {
    label: "10 минут",
    text: "Зимовальные ямы 12-15м (Сом, Сазан).",
    color: "text-terracotta-500 border-terracotta-500/40"
  },
  {
    label: "15–20 минут",
    text: "Каспийские раскаты («Черная вода», Щука).",
    color: "text-sky-400 border-sky-400/40"
  }
];

function MapInner() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = L.map(mapRef.current!, {
        center: [COORDS.lat, COORDS.lng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="position:relative;width:40px;height:40px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(234,88,12,0.2);animation:pulse 2s infinite;"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;background:#ea580c;border:2px solid white;"></div>
        </div>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([COORDS.lat, COORDS.lng], { icon }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full" />;
}

export function LocationMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          Координаты: {COORDS.lat}, {COORDS.lng}
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-tactical shadow-black/40"
      >
        <div className="relative aspect-video w-full min-h-[320px] sm:min-h-[420px]">
          {mounted ? (
            <MapInner />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-900">
              <div className="text-slate-400">Загрузка карты...</div>
            </div>
          )}

          {/* Info cards overlay */}
          <div className="pointer-events-none absolute inset-0 p-4">
            <div className="flex h-full flex-col justify-between">
              {/* Top card */}
              <div className="pointer-events-auto self-start max-w-[280px]">
                <div className="rounded-2xl bg-slate-950/80 p-[1px] backdrop-blur">
                  <div className="flex items-start gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-200">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 text-terracotta-400" />
                    <div>
                      <div className="font-semibold">База Взморье</div>
                      <div className="mt-0.5 text-[11px] text-slate-300">
                        Кулагинский банк, Астраханская область
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom rings */}
              <div className="pointer-events-auto flex flex-wrap gap-2 justify-center sm:justify-start">
                {rings.map((ring) => (
                  <div
                    key={ring.label}
                    className="rounded-2xl bg-slate-950/80 p-[1px] backdrop-blur"
                  >
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map link */}
        <div className="border-t border-slate-800 bg-slate-950/60 px-4 py-3">
          <a
            href={`https://yandex.ru/maps/?pt=${COORDS.lng},${COORDS.lat}&z=12&l=map`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <ExternalLink className="h-3 w-3" />
            Открыть в Яндекс.Картах
          </a>
        </div>
      </motion.div>
    </section>
  );
}
