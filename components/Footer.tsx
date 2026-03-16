"use client";

import { motion } from "framer-motion";
import { FileText, MapPin, Phone, Send, MessageCircle } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-black/95">
      <motion.div
        {...fadeIn}
        className="container-tactical py-10"
      >
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="font-brutal text-lg font-semibold tracking-[0.18em] text-slate-100">
              VZMORIE
            </div>
            <p className="max-w-xs text-sm text-slate-400">
              Живи на воде — отдыхай на земле.
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Контакты
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-300" />
              <span>+7 (900) 000-00-00</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-sky-400" />
              <span>Telegram</span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Навигация
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-terracotta-500" />
              <span>Координаты стоянки: 46.0000° N, 48.0000° E</span>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 text-slate-300" />
              <span>Правила погранзоны</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© 2026 Рыболовно-охотничья база Взморье. Все права защищены.</div>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-terracotta-600 px-5 py-3 text-sm font-semibold text-white shadow-tactical shadow-black/40 ring-1 ring-terracotta-500/60 transition hover:bg-terracotta-500 md:w-auto"
          >
            Забронировать выезд
          </button>
        </div>
      </motion.div>
    </footer>
  );
}

