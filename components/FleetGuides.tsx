"use client";

import { motion } from "framer-motion";
import { Radar, Ship, Users, Compass } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const boats = [
  {
    name: "Бударка 9м",
    engine: "Yamaha 60 л.с.",
    capacity: "4 человека",
    features: ["Эхолот Garmin", "Тент от солнца", "Якорная система"],
  },
  {
    name: "Бударка 9м",
    engine: "Yamaha 100 л.с.",
    capacity: "4 человека",
    features: ["Эхолот Lowrance HDS", "Тент", "Винтовая лебедка"],
  },
];

const guides = [
  {
    name: "Михалыч",
    experience: "15 лет на Каспии",
    specialization: "Трофейный спиннинг, троллинг",
    description: "Знает каждый ям и перекат на Кулагинском банке. Работает на жереха и сома.",
  },
  {
    name: "Сергей",
    experience: "10 лет",
    specialization: "Подводная охота, троллинг",
    description: "Проводит под водой больше, чем над. Знает миграцию прозрака и чехони.",
  },
];

export function FleetGuides() {
  return (
    <section id="fleet" className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Флот и Егеря
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          На чем вы пойдете за трофеем и кто будет вас вести.
        </p>
      </motion.div>

      {/* Boats */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-10"
      >
        <div className="flex items-center gap-2 mb-4">
          <Ship className="h-5 w-5 text-khaki-500" />
          <h3 className="text-lg font-semibold text-slate-100">Лодки</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {boats.map((boat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-tactical shadow-black/30"
            >
              <div className="text-sm font-semibold text-slate-100">{boat.name}</div>
              <div className="mt-1 text-xs text-slate-400">
                {boat.engine} &middot; {boat.capacity}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {boat.features.map((f) => (
                  <span key={f} className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Echolocation */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.1 } as const}
        className="mt-8 rounded-2xl border border-sky-400/30 bg-sky-950/30 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Radar className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-slate-100">Эхолокация</h3>
        </div>
        <p className="text-sm text-slate-300">
          Garmin Panoptix &amp; Lowrance HDS. Видим рыбу в корягах и на бровках.
          Наши егеря читают рельеф дна как открытую книгу.
        </p>
      </motion.div>

      {/* Guides */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.15 } as const}
        className="mt-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-terracotta-500" />
          <h3 className="text-lg font-semibold text-slate-100">Егеря</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <div
              key={guide.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-tactical shadow-black/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-600/20 ring-1 ring-terracotta-500/50">
                  <Compass className="h-5 w-5 text-terracotta-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">{guide.name}</div>
                  <div className="text-xs text-slate-400">{guide.experience}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-terracotta-400">{guide.specialization}</div>
              <p className="mt-2 text-sm text-slate-300">{guide.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
