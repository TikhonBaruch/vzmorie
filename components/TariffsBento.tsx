"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, MessageCircle } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const features = [
  "Проживание + Трехразовое питание (мужские порции).",
  "Лодка + Егерь + Топливо (до 20л/день — честно и без сюрпризов).",
  "Баня на дровах (2 часа ежедневно).",
  "Заморозка и вакуумация трофеев."
];

export function TariffsBento() {
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
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <div className="flex flex-col justify-between rounded-2xl border border-terracotta-500/60 bg-slate-950/70 p-6 shadow-[0_0_40px_rgba(234,88,12,0.25)] ring-1 ring-terracotta-600/40">
          <div>
            <div className="inline-flex items-center rounded-full bg-terracotta-600/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-terracotta-400 ring-1 ring-terracotta-500/50">
              Мужской клуб
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-50">
              Мужской клуб (Всё включено)
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-slate-100">
              {features.map((item) => (
                <li
                  key={item}
                  className="flex gap-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-khaki-500" />
                  <span className="leading-relaxed text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <div className="text-sm text-slate-300">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Стоимость от
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-50">
                От 12 000 руб / чел в сутки
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Скинулись один раз и забыли о кошельках.
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-terracotta-600 px-5 py-3 text-sm font-semibold text-white shadow-tactical shadow-black/40 ring-1 ring-terracotta-500/50 transition hover:bg-terracotta-500"
            >
              <Download className="h-4 w-4" />
              Скачать PDF-презентацию базы (WhatsApp)
              <MessageCircle className="h-4 w-4 opacity-80" />
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Для организатора
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Подстроим пакет под вашу команду: сроки, формат рыбалки и
              загрузку по дням.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
            Отправим детальную PDF-презентацию, тайминг дня и пример меню в один
            клик — в ваш WhatsApp.
          </div>
        </div>
      </motion.div>
    </section>
  );
}

