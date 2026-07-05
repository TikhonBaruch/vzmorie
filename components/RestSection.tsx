"use client";

import { motion } from "framer-motion";
import { Flame, Wind, Droplets, Utensils, Bed, ShowerHead } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const amenities = [
  {
    icon: Flame,
    title: "Баня на дровах",
    description: "2 часа ежедневно. Русская печь, парная до 90°C, моечная с контрастным душем.",
    color: "text-terracotta-400",
    ring: "ring-terracotta-500/50",
  },
  {
    icon: Utensils,
    title: "Трёхразовое питание",
    description: "Завтрак, обед, ужин. Мужские порции. Рыбные блюда из свежего улова.",
    color: "text-khaki-500",
    ring: "ring-khaki-500/50",
  },
  {
    icon: Bed,
    title: "Проживание",
    description: "Комнаты на 2-4 человека. Горячая вода, постельное белье, полотенца.",
    color: "text-sky-400",
    ring: "ring-sky-400/50",
  },
  {
    icon: Wind,
    title: "Сушильная комната",
    description: "Промышленная сушилка для неопрена и вейдерсов. Сухое снаряжение к утру.",
    color: "text-slate-300",
    ring: "ring-slate-400/50",
  },
  {
    icon: Droplets,
    title: "Заморозка",
    description: "Лари на 500+ литров. Вакууматор на базе. Ваш трофей будет ждать дома.",
    color: "text-sky-400",
    ring: "ring-sky-400/50",
  },
  {
    icon: ShowerHead,
    title: "Душевые",
    description: "Горячая вода 24/7. Отдельные душевые кабины для каждого номера.",
    color: "text-emerald-400",
    ring: "ring-emerald-400/50",
  },
];

export function RestSection() {
  return (
    <section id="rest" className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Баня и Отдых
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          После тяжелого дня на воде — горячая баня и горячий ужин.
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {amenities.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-tactical shadow-black/30 transition-colors hover:border-slate-700"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/80 ring-1 ring-slate-700">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">{item.title}</div>
                <p className="mt-1 text-sm text-slate-300">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Additional info */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.1 } as const}
        className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
      >
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Дополнительно
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-khaki-500" />
            Зона барбекю с беседкой
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-khaki-500" />
            Парковка для машин
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-khaki-500" />
            Wi-Fi на территории
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-khaki-500" />
            Холодильник в номерах
          </div>
        </div>
      </motion.div>
    </section>
  );
}
