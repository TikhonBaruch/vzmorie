"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Fish, Radar, Shield, Target, Waves } from "lucide-react";

function Tile({
  className,
  children,
  accent = "none"
}: {
  className?: string;
  children: React.ReactNode;
  accent?: "khaki" | "terracotta" | "red" | "none";
}) {
  const accentRing =
    accent === "khaki"
      ? "hover:ring-khaki-500/35"
      : accent === "terracotta"
        ? "hover:ring-terracotta-500/35"
        : accent === "red"
          ? "hover:ring-red-500/35"
          : "hover:ring-slate-700/35";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={[
        "group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70",
        "shadow-tactical shadow-black/25 ring-1 ring-transparent",
        "transition hover:bg-slate-900",
        accentRing,
        className ?? ""
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
      </div>
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

export function HeroBento() {
  return (
    <section aria-label="Первый экран">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-2">
        <Tile className="md:col-span-2 md:row-span-2" accent="terracotta">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.35),rgba(2,6,23,0.85))]" />
            <Image
              src="https://picsum.photos/1400/900?blur=1"
              alt="Заглушка видео/фото воды"
              fill
              priority
              className="object-cover opacity-40"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>

          <div className="flex h-full flex-col justify-end p-6 sm:p-8">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
              <Shield className="h-4 w-4 text-khaki-500" />
              Expedition Design / Dark Mode
            </div>

            <h1 className="font-brutal text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              ЖИВИ НА ВОДЕ. ОТДЫХАЙ НА ЗЕМЛЕ.
            </h1>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-slate-200/90 sm:text-base">
              Трофейная рыбалка и подводная охота в 5 минутах от базы.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#dates"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-terracotta-600 px-5 py-3 text-sm font-semibold text-white ring-1 ring-terracotta-500/40 transition hover:bg-terracotta-500 sm:w-auto"
              >
                Узнать даты и места
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/30 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-950/50 sm:w-auto"
              >
                Смотреть тарифы
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-slate-200/90 sm:max-w-md">
              <div className="rounded-xl border border-slate-800 bg-slate-950/25 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-slate-200" />
                  <span>Кулагинский банк</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/25 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-khaki-500" />
                  <span>5 минут до воды</span>
                </div>
              </div>
            </div>
          </div>
        </Tile>

        <Tile className="md:col-span-1 md:row-span-1" accent="khaki">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-khaki-500">
                  Для подвохов
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-50">
                  Сезон ПО открыт
                </div>
              </div>
              <Radar className="h-5 w-5 text-slate-200/80" />
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-100">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-emerald-400/50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="font-semibold">Прозрак</span>
                <span className="text-slate-300">2.5 – 3 м</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                По погоде обновляем в “Вестях”.
              </div>
            </div>

            <Link
              href="#spearfishing"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-100 hover:text-white"
            >
              Подробнее
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Tile>

        <Tile className="md:col-span-1 md:row-span-1" accent="terracotta">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-terracotta-500">
                  Для организатора
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-50">
                  Едете компанией?
                </div>
              </div>
              <Shield className="h-5 w-5 text-slate-200/80" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Пакеты “всё включено” с баней, отдыхом и логистикой.
            </p>
            <Link
              href="#pricing"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-100 hover:text-white"
            >
              К тарифам
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Tile>

        <Tile className="md:col-span-1 md:row-span-1" accent="khaki">
          <div className="flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Для трофейщика
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-50">
                  Трофеи банка
                </div>
              </div>
              <Fish className="h-5 w-5 text-khaki-500" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Ямы и перекаты рядом — работаем по точкам быстро.
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3 text-xs text-slate-400">
              Снасти / приманки — подскажем по сезону.
            </div>
          </div>
        </Tile>

        <Tile className="md:col-span-1 md:row-span-1" accent="red">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-red-500/50" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  </span>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Live-статус
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-50">
                  Вести с воды
                </div>
              </div>
              <Waves className="h-5 w-5 text-slate-200/80" />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Сегодня: Взяли жереха на 4 кг на струе.
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3 text-xs text-slate-400">
              <Target className="h-4 w-4 text-slate-300" />
              Обновление: 12:40
            </div>
          </div>
        </Tile>
      </div>
    </section>
  );
}

