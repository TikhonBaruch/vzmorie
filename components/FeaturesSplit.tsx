"use client";

import { motion } from "framer-motion";
import { Flame, ShipWheel } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" }
};

export function FeaturesSplit() {
  return (
    <section className="py-20">
      <motion.div
        {...fadeIn}
        className="text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          Вода для добычи. Земля для души.
        </h2>
      </motion.div>

      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 }}
        className="mt-10 grid gap-6 md:grid-cols-2"
      >
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-tactical shadow-black/30">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/80 ring-1 ring-slate-700">
              <ShipWheel className="h-5 w-5 text-slate-100" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                ВОДА
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Дебаркадер на русле. Вы спите в 10 метрах от миграционных путей
                рыбы. Не тратьте бензин и час времени на дорогу по утрам.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-terracotta-600/40 bg-gradient-to-br from-slate-900/70 via-slate-900/70 to-terracotta-700/15 p-6 shadow-[0_0_40px_rgba(180,83,9,0.25)]">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/80 ring-1 ring-terracotta-600/60">
              <Flame className="h-5 w-5 text-terracotta-400" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                ЗЕМЛЯ
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Твердый берег. После качки и тяжелого дня — жаркая баня на
                дровах, дым коптильни и просторная беседка для ваших баек.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

