"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Droplets, Eye, Fish, Thermometer } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" } as const
};

interface Conditions {
  title: string;
  content: string;
  publishedAt: string;
}

function parseConditions(content: string) {
  const lines = content.split("\n").filter(Boolean);
  const items: { icon: React.ReactNode; label: string; value: string }[] = [];

  for (const line of lines) {
    const clean = line.replace(/[🌤🐟🌊👁]/g, "").trim();
    const match = clean.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const [, label, value] = match;
      const lowerLabel = label.toLowerCase();

      let icon = <Thermometer className="h-4 w-4 text-khaki-500" />;
      if (lowerLabel.includes("клюёт") || lowerLabel.includes("рыба")) {
        icon = <Fish className="h-4 w-4 text-terracotta-500" />;
      } else if (lowerLabel.includes("уровень") || lowerLabel.includes("вода")) {
        icon = <Droplets className="h-4 w-4 text-sky-400" />;
      } else if (lowerLabel.includes("чистота") || lowerLabel.includes("видимость")) {
        icon = <Eye className="h-4 w-4 text-emerald-400" />;
      } else if (lowerLabel.includes("погода")) {
        icon = <Cloud className="h-4 w-4 text-slate-300" />;
      }

      items.push({ icon, label: label.trim(), value: value.trim() });
    }
  }

  return items;
}

export function ConditionsBlock() {
  const [conditions, setConditions] = useState<Conditions | null>(null);

  useEffect(() => {
    fetch("/api/conditions")
      .then((r) => (r.ok ? r.json() : null))
      .then(setConditions)
      .catch(() => {});
  }, []);

  if (!conditions) return null;

  const items = parseConditions(conditions.content);
  const time = new Date(conditions.publishedAt).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.section
      {...fadeIn}
      className="mb-8 rounded-2xl border border-sky-400/30 bg-sky-950/30 p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-sky-400/50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
        </span>
        <h3 className="font-brutal text-lg font-semibold text-slate-100">
          Условия сегодня
        </h3>
        <span className="text-xs text-slate-400 ml-auto">
          Обновлено: {time}
        </span>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2"
            >
              {item.icon}
              <div>
                <div className="text-xs text-slate-400">{item.label}</div>
                <div className="text-sm font-medium text-slate-100">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{conditions.content}</p>
      )}
    </motion.section>
  );
}
