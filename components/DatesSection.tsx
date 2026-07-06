"use client";

import { motion } from "framer-motion";
import { Calendar, Phone, MessageCircle, Send } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

const availableDates = [
  { date: "11-13 июля", spots: 2, status: "available" },
  { date: "18-20 июля", spots: 4, status: "available" },
  { date: "25-27 июля", spots: 1, status: "limited" },
  { date: "1-3 августа", spots: 6, status: "available" },
  { date: "8-10 августа", spots: 3, status: "available" },
  { date: "15-17 августа", spots: 0, status: "booked" },
];

export function DatesSection() {
  return (
    <section id="dates" className="py-20">
      <motion.div
        {...fadeIn}
        className="max-w-3xl text-center"
      >
        <h2 className="font-brutal text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Даты заезда
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          Выберите удобные даты или свяжитесь с нами для индивидуального подбора.
        </p>
      </motion.div>

      {/* Calendar */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.05 } as const}
        className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-tactical shadow-black/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-terracotta-500" />
          <h3 className="text-lg font-semibold text-slate-100">Ближайшие выходы</h3>
        </div>

        <div className="space-y-3">
          {availableDates.map((item) => (
            <div
              key={item.date}
              className={`flex items-center justify-between rounded-xl border p-4 ${
                item.status === "booked"
                  ? "border-slate-800 bg-slate-950/40 opacity-60"
                  : item.status === "limited"
                    ? "border-yellow-500/30 bg-yellow-950/20"
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="text-sm font-semibold text-slate-100">{item.date}</div>
                <div className="text-xs text-slate-400">3 дня / 2 ночи</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  {item.status === "booked" ? (
                    <span className="text-xs text-slate-500">Мест нет</span>
                  ) : (
                    <>
                      <span className={`text-sm font-semibold ${
                        item.status === "limited" ? "text-yellow-400" : "text-emerald-400"
                      }`}>
                        {item.spots} мест
                      </span>
                      <div className="text-xs text-slate-400">
                        {item.status === "limited" ? "Почти заполнено" : "Есть места"}
                      </div>
                    </>
                  )}
                </div>
                {item.status !== "booked" && (
                  <a
                    href={`https://wa.me/79093720573?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%B1%D1%80%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BD%D0%B0%20${item.date}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-terracotta-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-terracotta-500"
                  >
                    Забронировать
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.1 } as const}
        className="mt-6 grid gap-4 sm:grid-cols-3"
      >
        <a
          href="tel:+79093720573"
          className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700"
        >
          <Phone className="h-5 w-5 text-slate-300" />
          <div>
            <div className="text-sm font-semibold text-slate-100">Позвонить</div>
            <div className="text-xs text-slate-400">+7 (909) 372-05-73</div>
          </div>
        </a>
        <a
          href="https://wa.me/79093720573"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700"
        >
          <MessageCircle className="h-5 w-5 text-emerald-400" />
          <div>
            <div className="text-sm font-semibold text-slate-100">WhatsApp</div>
            <div className="text-xs text-slate-400">Быстрый ответ</div>
          </div>
        </a>
        <a
          href="https://t.me/vzmorie_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700"
        >
          <Send className="h-5 w-5 text-sky-400" />
          <div>
            <div className="text-sm font-semibold text-slate-100">Telegram</div>
            <div className="text-xs text-slate-400">@vzmorie_bot</div>
          </div>
        </a>
      </motion.div>

      {/* FAQ */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.15 } as const}
        className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
      >
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Частые вопросы
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          <div>
            <div className="font-medium text-slate-100">Как добраться?</div>
            <div className="mt-1 text-slate-400">
              90 км от Астрахани. Трансфер через п. Кировский, далее лодкой. Координаты: 45.758469, 48.136073
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-100">Нужен ли паспорт?</div>
            <div className="mt-1 text-slate-400">
              Да, погранзона. Паспортные данные отправьте за 3 дня до заезда.
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-100">Что взять с собой?</div>
            <div className="mt-1 text-slate-400">
              Личные снасти, одежду по погоде. Всё остальное (лодки, топливо, баня, питание) включено.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
