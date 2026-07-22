"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Droplet, Snowflake, Thermometer, Waves } from "lucide-react";

const nav = [
  { label: "Вести с воды", href: "/posts" },
  { label: "Команда", href: "/specialists" },
  { label: "Флот и Егеря", href: "#fleet" },
  { label: "Баня и Отдых", href: "#rest" },
  { label: "Подвохам", href: "#spearfishing" },
  { label: "Тарифы", href: "#pricing" }
];

interface Conditions {
  content: string;
}

function parseWeather(content: string): { temp: string; water: string } {
  let temp = "—";
  let water = "—";

  const weatherMatch = content.match(/погода[:\s–—]+(.+)/i);
  if (weatherMatch) {
    const tempMatch = weatherMatch[1].match(/([+-]?\d+)/);
    if (tempMatch) {
      temp = `${tempMatch[1]}°C`;
    } else {
      temp = weatherMatch[1].slice(0, 30);
    }
  }

  const waterMatch = content.match(/уровень воды[:\s–—]+(.+)/i);
  if (waterMatch) {
    water = waterMatch[1].trim();
  }

  return { temp, water };
}

export function Header() {
  const [weather, setWeather] = useState({ temp: "14°C", water: "Загрузка..." });

  useEffect(() => {
    fetch("/api/conditions")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Conditions | null) => {
        if (data?.content) {
          setWeather(parseWeather(data.content));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur">
      <div className="container-tactical">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-baseline gap-3 whitespace-nowrap"
            >
              <span className="font-brutal text-lg font-semibold tracking-[0.18em] text-slate-100">
                VZMORIE
              </span>
              <span className="hidden max-w-[34ch] truncate text-xs text-slate-400 sm:block">
                База-гибрид на Кулагинском банке
              </span>
            </Link>
          </div>

          <nav className="hidden items-center justify-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-slate-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-200 lg:flex">
              <div className="flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-khaki-500" />
                <span className="tabular-nums">{weather.temp}</span>
              </div>
              <span className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <Droplet className="h-4 w-4 text-slate-300" />
                <span className="text-slate-300">{weather.water}</span>
              </div>
            </div>

            <Link
              href="#dates"
              className="inline-flex items-center gap-2 rounded-2xl bg-terracotta-600 px-4 py-2 text-sm font-semibold text-white shadow-tactical shadow-black/30 ring-1 ring-terracotta-500/40 transition hover:bg-terracotta-500"
            >
              <Waves className="h-4 w-4" />
              Узнать даты
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/70 bg-slate-950/40 md:hidden">
        <div className="container-tactical flex items-center justify-between gap-2 py-2 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <Snowflake className="h-4 w-4 text-khaki-500" />
            <span className="tabular-nums">{weather.temp}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-slate-300" />
            <span className="text-slate-300">{weather.water}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
