"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const included = [
  "Проживание + Трехразовое питание (мужские порции).",
  "Лодка + Егерь + Топливо (до 20л/день).",
  "Баня на дровах (2 часа ежедневно).",
  "Заморозка и вакуумация трофеев.",
];

interface Tariff {
  id: string;
  name: string;
  price: string;
  description: string | null;
  features: string[];
  popular: boolean;
}

const fallbackTariffs: Tariff[] = [
  {
    id: "fallback-1",
    name: "Стандарт",
    price: "7 100",
    description: "Комфортные условия для рыбалки",
    features: ["Проживание", "3-разовое питание", "Лодка + Егерь", "Баня"],
    popular: false,
  },
  {
    id: "fallback-2",
    name: "I категория",
    price: "7 400",
    description: "Улучшенные номера и сервис",
    features: ["Проживание", "3-разовое питание", "Лодка + Егерь", "Баня", "Кондиционер"],
    popular: true,
  },
  {
    id: "fallback-3",
    name: "Люкс",
    price: "9 100",
    description: "Максимальный комфорт на воде",
    features: ["Проживание", "3-разовое питание", "Лодка + Егерь", "Баня", "Кондиционер", "Отдельная территория"],
    popular: false,
  },
];

export function TariffsBento() {
  const [tariffs, setTariffs] = useState<Tariff[]>(fallbackTariffs);

  useEffect(() => {
    fetch("/api/public/tariffs")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (data && data.length > 0) {
          setTariffs(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="pricing" className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          Соберите команду. Остальное — наша забота.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
          Прозрачные пакеты «Всё включено» без скрытых доплат за бензин.
          Цена — за человека в сутки.
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-10 grid gap-4 md:grid-cols-3"
      >
        {tariffs.map((tariff) => (
          <div
            key={tariff.id}
            className={`relative flex flex-col justify-between rounded-2xl border p-5 ${
              tariff.popular
                ? "border-terracotta-500/60 bg-slate-950/70 shadow-[0_0_40px_rgba(234,88,12,0.25)] ring-1 ring-terracotta-600/40"
                : "border-slate-800 bg-slate-950/60"
            }`}
          >
            {tariff.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-terracotta-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Популярный
                </span>
              </div>
            )}

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {tariff.name}
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-50">
                {tariff.price} <span className="text-sm font-normal text-slate-400">руб / сутки</span>
              </div>
              {tariff.description && (
                <p className="mt-1 text-xs text-slate-400">{tariff.description}</p>
              )}

              <ul className="mt-4 space-y-2">
                {tariff.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-khaki-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`https://wa.me/79093720573?text=${encodeURIComponent(`Здравствуйте! Хочу забронировать тариф «${tariff.name}»`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                tariff.popular
                  ? "bg-terracotta-600 text-white shadow-tactical shadow-black/40 ring-1 ring-terracotta-500/50 hover:bg-terracotta-500"
                  : "border border-slate-800 bg-slate-900/40 text-slate-100 hover:bg-slate-900"
              }`}
            >
              Забронировать
              <MessageCircle className="h-4 w-4 opacity-80" />
            </a>
          </div>
        ))}
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.1 } as const}
        className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
      >
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Что включено во все тарифы
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {included.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-slate-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-khaki-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
