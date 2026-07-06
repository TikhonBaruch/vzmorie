"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, MessageCircle } from "lucide-react";

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

const tariffs = [
  {
    name: "Стандарт",
    price: "7 100",
    description: "Комфортные условия для рыбалки",
    features: ["Проживание", "3-разовое питание", "Лодка + Егерь", "Баня"],
  },
  {
    name: "I категория",
    price: "7 400",
    description: "Улучшенные номера и сервис",
    features: ["Проживание", "3-разовое питание", "Лодка + Егерь", "Баня", "Кондиционер"],
    popular: true,
  },
  {
    name: "Люкс",
    price: "9 100",
    description: "Максимальный комфорт на воде",
    features: ["Проживание", "3-разовое питание", "Лодка + Егерь", "Баня", "Кондиционер", "Отдельная территория"],
  },
];

export function TariffsBento() {
  return (
    <section id="pricing" className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl md:text-d-3xl">
          Соберите команду. Остальное — наша забота.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base md:text-d-base">
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
            key={tariff.name}
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
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 md:text-d-xs">
                {tariff.name}
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-50 md:text-d-2xl">
                {tariff.price} <span className="text-sm font-normal text-slate-400 md:text-d-sm">руб / сутки</span>
              </div>
              <p className="mt-1 text-xs text-slate-400 md:text-d-xs">{tariff.description}</p>

              <ul className="mt-4 space-y-2">
                {tariff.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-200 md:text-d-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-khaki-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://wa.me/79093720573?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%B1%D1%80%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D1%82%D0%B0%D1%80%D0%B8%D1%84%20%C2%AB{tariff.name}%C2%BB"
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
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 md:text-d-xs">
          Что включено во все тарифы
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {included.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-slate-200 md:text-d-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-khaki-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
