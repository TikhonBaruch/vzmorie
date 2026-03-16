"use client";

import { motion } from "framer-motion";
import { Anchor, Snowflake, Waves, Wind } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }as const
};

const cards = [
  {
    title: "Заморозка",
    icon: Snowflake,
    iconClass: "text-sky-400",
    text: "Лари на 500+ литров. Хватит места для каждого сома. Вакууматор на базе."
  },
  {
    title: "Сушильная комната",
    icon: Wind,
    iconClass: "text-khaki-500",
    text: "Промышленная сушилка. Ваш неопрен 9мм и вейдерсы будут сухими к утренней зорьке."
  },
  {
    title: "Свинец на базе",
    icon: Anchor,
    iconClass: "text-slate-300",
    text: "Не платите за перевес в самолете. Груза и пояса для подвохов сдаем в аренду."
  },
  {
    title: "Обработка",
    icon: Waves,
    iconClass: "text-sky-400",
    text: "Удобная зона чистки с проточной водой. Услуга ощипа дичи и филирования от базы."
  }
];

export function InfrastructureBento() {
  return (
    <section className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Готовы к тоннам рыбы и мокрой снаряге.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          Железобетонные аргументы для подводных охотников и трофейщиков.
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-tactical shadow-black/30 transition-colors hover:border-slate-700"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/80 ring-1 ring-slate-700">
                <card.icon className={`h-5 w-5 ${card.iconClass}`} />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  {card.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {card.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

