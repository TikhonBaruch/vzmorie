"use client";

import { motion } from "framer-motion";
import { Eye, Fish, Shield, Waves } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const features = [
  {
    icon: Eye,
    title: "Прозрак",
    description: "Основной объект охоты. Миграция с апреля по октябрь. Размер 40-80 см.",
    season: "Апрель — Октябрь",
  },
  {
    icon: Fish,
    title: "Чехонь",
    description: "Серебристая стая на глубине 3-5 метров. Хорошо берет на подводную.",
    season: "Июнь — Сентябрь",
  },
  {
    icon: Shield,
    title: "Сом",
    description: "Трофейные экземпляры в зимовальных ямах. Глубина 12-15 метров.",
    season: "Круглый год",
  },
];

const rules = [
  "ПаспортRequired — погранзона, данные за 3 дня до заезда",
  "Лицензия на подводную охоту обязательна",
  "Гид сопровождает на всех выходах",
  "Видимость на банке 2.5-3 метра (обновляем ежедневно)",
];

export function SpearfishingSection() {
  return (
    <section id="spearfishing" className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Подводная охота
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          Кулагинский банк — один из лучших мест для подводной охоты на Каспии.
        </p>
      </motion.div>

      {/* Visibility status */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-950/30 p-5"
      >
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-emerald-400/50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-100">Видимость на банке</div>
            <div className="text-xs text-slate-400">Обновляется ежедневно в утренней сводке</div>
          </div>
        </div>
      </motion.div>

      {/* Fish species */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.1 } as const}
        className="mt-8 grid gap-4 md:grid-cols-3"
      >
        {features.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-tactical shadow-black/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-900/30 ring-1 ring-emerald-500/50">
                <item.icon className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">{item.title}</div>
                <div className="text-xs text-emerald-400">{item.season}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{item.description}</p>
          </div>
        ))}
      </motion.div>

      {/* Rules */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.15 } as const}
        className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-terracotta-500" />
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Важно для подвохов
          </div>
        </div>
        <div className="space-y-2">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <Waves className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-terracotta-500" />
              {rule}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
