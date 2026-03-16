"use client";

import { motion } from "framer-motion";
import { Radar, Ship } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }
};

export function FleetGuides() {
  return (
    <section className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Технический арсенал: Флот и Эхолоты.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          На чем вы пойдете за трофеем.
        </p>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 }}
        className="mt-10 flex flex-col gap-6 md:flex-row"
      >
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-tactical shadow-black/30 transition-colors hover:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/80 ring-1 ring-khaki-600/60">
              <Ship className="h-5 w-5 text-khaki-500" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Лодки
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-100">
                Бударки 9 метров. Моторы Yamaha 60–100 л.с.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Не тратим время на долгие переходы. Просторные лодки для
                комфортного заброса.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-tactical shadow-black/30 transition-colors hover:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/80 ring-1 ring-sky-500/60">
              <Radar className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Эхолокация
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-100">
                Garmin Panoptix &amp; Lowrance HDS.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Видим рыбу в корягах и на бровках. Наши егеря читают рельеф дна
                как открытую книгу.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

