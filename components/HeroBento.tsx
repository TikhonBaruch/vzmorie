"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
      transition={{ duration: 0.5, ease: "easeOut" }as const }
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

interface LatestPost {
  title: string;
  fishType: string | null;
  weight: number | null;
}

interface SiteImage {
  key: string;
  url: string;
  alt: string | null;
}

interface HeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  infoLeft: string;
  infoRight: string;
  tileDivingTitle: string;
  tileDivingSubtitle: string;
  tileOrganizerTitle: string;
  tileOrganizerSubtitle: string;
  tileOrganizerText: string;
  tileTrophyTitle: string;
  tileTrophySubtitle: string;
  tileTrophyText: string;
  tileLiveTitle: string;
  tileLiveSubtitle: string;
}

const DEFAULT_HERO = "https://picsum.photos/1400/900";

const defaultConfig: HeroConfig = {
  badge: "Кулагинский банк / Астраханская область",
  title: "ЖИВИ НА ВОДЕ. ОТДЫХАЙ НА ЗЕМЛЕ.",
  subtitle: "Трофейная рыбалка и подводная охота в 5 минутах от базы. 90 км от Астрахани.",
  ctaPrimary: "Узнать даты и места",
  ctaSecondary: "Смотреть тарифы",
  infoLeft: "Кулагинский банк",
  infoRight: "5 минут до воды",
  tileDivingTitle: "Сезон ПО открыт",
  tileDivingSubtitle: "Для подвохов",
  tileOrganizerTitle: "Едете компанией?",
  tileOrganizerSubtitle: "Для организатора",
  tileOrganizerText: "Пакеты «всё включено» с баней, отдыхом и логистикой.",
  tileTrophyTitle: "Трофеи банка",
  tileTrophySubtitle: "Для трофейщика",
  tileTrophyText: "Ямы и перекаты рядом — работаем по точкам быстро.",
  tileLiveTitle: "Вести с воды",
  tileLiveSubtitle: "Live-статус",
};

export function HeroBento() {
  const [latest, setLatest] = useState<LatestPost | null>(null);
  const [heroUrl, setHeroUrl] = useState(DEFAULT_HERO);
  const [config, setConfig] = useState<HeroConfig>(defaultConfig);

  useEffect(() => {
    Promise.all([
      fetch("/api/public/posts")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch("/api/site-images")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch("/api/public/hero")
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([posts, siteImages, heroConfig]: [any[], SiteImage[], HeroConfig | null]) => {
      const catchPost = posts.find((p: any) => p.type === "CATCH");
      if (catchPost) {
        setLatest({
          title: catchPost.title,
          fishType: catchPost.fishType,
          weight: catchPost.weight,
        });
      }
      const hero = siteImages.find((img) => img.key === "hero");
      if (hero?.url) {
        setHeroUrl(hero.url);
      }
      if (heroConfig) {
        setConfig(heroConfig);
      }
    });
  }, []);

  return (
    <section aria-label="Первый экран">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-2">
        <Tile className="md:col-span-2 md:row-span-2" accent="terracotta">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroUrl}
              alt="Кулагинский банк Каспийского моря"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.4),rgba(2,6,23,0.9))]" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
              <Shield className="h-4 w-4 text-khaki-500" />
              {config.badge}
            </div>

            <h1 className="font-brutal text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              {config.title}
            </h1>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-slate-200/90 sm:text-base">
              {config.subtitle}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#dates"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-terracotta-600 px-5 py-3 text-sm font-semibold text-white ring-1 ring-terracotta-500/40 transition hover:bg-terracotta-500 sm:w-auto"
              >
                {config.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/30 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-950/50 sm:w-auto"
              >
                {config.ctaSecondary}
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-slate-200/90 sm:max-w-md">
              <div className="rounded-xl border border-slate-800 bg-slate-950/25 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-slate-200" />
                  <span>{config.infoLeft}</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/25 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-khaki-500" />
                  <span>{config.infoRight}</span>
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
                  {config.tileDivingSubtitle}
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-50">
                  {config.tileDivingTitle}
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
                <span className="font-semibold">Видимость на раскатах</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Кристально чистая вода — фильтрация камышами.
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Обновляем ежедневно в утренней сводке.
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
                  {config.tileOrganizerSubtitle}
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-50">
                  {config.tileOrganizerTitle}
                </div>
              </div>
              <Shield className="h-5 w-5 text-slate-200/80" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {config.tileOrganizerText}
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
                  {config.tileTrophySubtitle}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-50">
                  {config.tileTrophyTitle}
                </div>
              </div>
              <Fish className="h-5 w-5 text-khaki-500" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {config.tileTrophyText}
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
                    {config.tileLiveSubtitle}
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-50">
                  {config.tileLiveTitle}
                </div>
              </div>
              <Waves className="h-5 w-5 text-slate-200/80" />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {latest
                ? `Сегодня: ${latest.title}${latest.fishType ? ` (${latest.fishType}${latest.weight ? `, ${latest.weight} кг` : ""})` : ""}`
                : "Ожидаем сводку с воды..."}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3 text-xs text-slate-400">
              <Target className="h-4 w-4 text-slate-300" />
              {latest ? "Обновление: сейчас" : "Ожидаем данные..."}
            </div>
          </div>
        </Tile>
      </div>
    </section>
  );
}
