"use client";

import { useEffect, useState } from "react";
import { Cloud, Droplets, Eye, Fish, Thermometer, Save, Loader2 } from "lucide-react";

interface Conditions {
  id: string | null;
  title: string;
  content: string;
  publishedAt: string | null;
}

interface ConditionFields {
  weather: string;
  biting: string;
  waterLevel: string;
  waterClarity: string;
}

function parseContent(content: string): ConditionFields {
  const fields: ConditionFields = {
    weather: "",
    biting: "",
    waterLevel: "",
    waterClarity: "",
  };

  const lines = content.split("\n").filter(Boolean);
  for (const line of lines) {
    const clean = line.replace(/[🌤🐟🌊👁]/g, "").trim();
    const match = clean.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const [, label, value] = match;
      const lowerLabel = label.toLowerCase();

      if (lowerLabel.includes("погода")) {
        fields.weather = value.trim();
      } else if (lowerLabel.includes("клюёт") || lowerLabel.includes("рыба")) {
        fields.biting = value.trim();
      } else if (lowerLabel.includes("уровень") || lowerLabel.includes("вода")) {
        fields.waterLevel = value.trim();
      } else if (lowerLabel.includes("чистота") || lowerLabel.includes("видимость")) {
        fields.waterClarity = value.trim();
      }
    }
  }

  return fields;
}

function buildContent(fields: ConditionFields): string {
  const lines: string[] = [];
  if (fields.weather) lines.push(`🌤 Погода: ${fields.weather}`);
  if (fields.biting) lines.push(`🐟 Что клюёт: ${fields.biting}`);
  if (fields.waterLevel) lines.push(`🌊 Уровень воды: ${fields.waterLevel}`);
  if (fields.waterClarity) lines.push(`👁 Чистота воды: ${fields.waterClarity}`);
  return lines.join("\n\n");
}

export default function ConditionsPage() {
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [fields, setFields] = useState<ConditionFields>({
    weather: "",
    biting: "",
    waterLevel: "",
    waterClarity: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/conditions", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setConditions(data);
          setFields(parseContent(data.content || ""));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const content = buildContent(fields);

    try {
      const res = await fetch("/api/admin/conditions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: conditions?.id,
          title: conditions?.title || `Сводка на ${new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}`,
          content,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConditions(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none";
  const labelClass = "flex items-center gap-2 mb-2 text-sm text-slate-400";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  const time = conditions?.publishedAt
    ? new Date(conditions.publishedAt).toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Нет данных";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Условия сегодня</h1>
          <p className="mt-2 text-sm text-slate-400">
            Последнее обновление: {time}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-500 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-950/30 px-4 py-3 text-sm text-green-400">
          Условия обновлены!
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Погода */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <label className={labelClass}>
            <Thermometer className="h-4 w-4 text-khaki-500" />
            Погода
          </label>
          <input
            type="text"
            value={fields.weather}
            onChange={(e) => setFields({ ...fields, weather: e.target.value })}
            className={inputClass}
            placeholder="Например: +28°C, солнечно, ветер 3 м/с"
          />
        </div>

        {/* Что клюёт */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <label className={labelClass}>
            <Fish className="h-4 w-4 text-terracotta-500" />
            Что клюёт
          </label>
          <input
            type="text"
            value={fields.biting}
            onChange={(e) => setFields({ ...fields, biting: e.target.value })}
            className={inputClass}
            placeholder="Например: жерех, окунь, чехонь"
          />
        </div>

        {/* Уровень воды */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <label className={labelClass}>
            <Droplets className="h-4 w-4 text-sky-400" />
            Уровень воды
          </label>
          <input
            type="text"
            value={fields.waterLevel}
            onChange={(e) => setFields({ ...fields, waterLevel: e.target.value })}
            className={inputClass}
            placeholder="Например: стабильный, -20 см от нормы"
          />
        </div>

        {/* Чистота воды */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <label className={labelClass}>
            <Eye className="h-4 w-4 text-emerald-400" />
            Чистота воды
          </label>
          <input
            type="text"
            value={fields.waterClarity}
            onChange={(e) => setFields({ ...fields, waterClarity: e.target.value })}
            className={inputClass}
            placeholder="Например: видимость 3 м, прозрачная"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 rounded-2xl border border-sky-400/30 bg-sky-950/30 p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-sky-400/50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
          </span>
          <h3 className="font-brutal text-lg font-semibold text-slate-100">
            Предпросмотр
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fields.weather && (
            <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
              <Thermometer className="mt-0.5 h-4 w-4 text-khaki-500" />
              <div>
                <div className="text-xs text-slate-400">Погода</div>
                <div className="text-sm font-medium text-slate-100">{fields.weather}</div>
              </div>
            </div>
          )}
          {fields.biting && (
            <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
              <Fish className="mt-0.5 h-4 w-4 text-terracotta-500" />
              <div>
                <div className="text-xs text-slate-400">Что клюёт</div>
                <div className="text-sm font-medium text-slate-100">{fields.biting}</div>
              </div>
            </div>
          )}
          {fields.waterLevel && (
            <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
              <Droplets className="mt-0.5 h-4 w-4 text-sky-400" />
              <div>
                <div className="text-xs text-slate-400">Уровень воды</div>
                <div className="text-sm font-medium text-slate-100">{fields.waterLevel}</div>
              </div>
            </div>
          )}
          {fields.waterClarity && (
            <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
              <Eye className="mt-0.5 h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">Чистота воды</div>
                <div className="text-sm font-medium text-slate-100">{fields.waterClarity}</div>
              </div>
            </div>
          )}
        </div>

        {!fields.weather && !fields.biting && !fields.waterLevel && !fields.waterClarity && (
          <p className="text-sm text-slate-500">Заполните поля выше для предпросмотра</p>
        )}
      </div>
    </div>
  );
}
