"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, Eye, EyeOff } from "lucide-react";

interface BookingDate {
  id: string;
  date: string;
  spots: number;
  status: "available" | "limited" | "booked";
}

interface DatesConfig {
  visible: boolean;
  dates: BookingDate[];
}

const defaultConfig: DatesConfig = {
  visible: true,
  dates: [
    { id: "1", date: "11-13 июля", spots: 2, status: "available" },
    { id: "2", date: "18-20 июля", spots: 4, status: "available" },
    { id: "3", date: "25-27 июля", spots: 1, status: "limited" },
    { id: "4", date: "1-3 августа", spots: 6, status: "available" },
    { id: "5", date: "8-10 августа", spots: 3, status: "available" },
    { id: "6", date: "15-17 августа", spots: 0, status: "booked" },
  ],
};

export default function DatesAdminPage() {
  const [config, setConfig] = useState<DatesConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings?key=dates", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.value) {
          setConfig(data.value as DatesConfig);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: "dates", value: config }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const addDate = () => {
    const newId = Date.now().toString();
    setConfig({
      ...config,
      dates: [...config.dates, { id: newId, date: "", spots: 4, status: "available" }],
    });
  };

  const removeDate = (id: string) => {
    setConfig({
      ...config,
      dates: config.dates.filter((d) => d.id !== id),
    });
  };

  const updateDate = (id: string, field: keyof BookingDate, value: any) => {
    setConfig({
      ...config,
      dates: config.dates.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    });
  };

  const toggleVisibility = () => {
    setConfig({ ...config, visible: !config.visible });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none";
  const labelClass = "block mb-1 text-sm text-slate-400";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Даты заезда</h1>
          <p className="mt-2 text-sm text-slate-400">
            Управление расписанием и видимостью на главной странице
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVisibility}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              config.visible
                ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {config.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {config.visible ? "Видна на сайте" : "Скрыта с сайта"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-500 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      {saved && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-950/30 px-4 py-3 text-sm text-green-400">
          Настройки сохранены!
        </div>
      )}

      <div className="space-y-4">
        {config.dates.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <div className="flex-1 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Дата</label>
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) => updateDate(item.id, "date", e.target.value)}
                  className={inputClass}
                  placeholder="11-13 июля"
                />
              </div>
              <div>
                <label className={labelClass}>Мест</label>
                <input
                  type="number"
                  value={item.spots}
                  onChange={(e) => updateDate(item.id, "spots", parseInt(e.target.value) || 0)}
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Статус</label>
                <select
                  value={item.status}
                  onChange={(e) => updateDate(item.id, "status", e.target.value)}
                  className={inputClass}
                >
                  <option value="available">Есть места</option>
                  <option value="limited">Почти заполнено</option>
                  <option value="booked">Мест нет</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => removeDate(item.id)}
              className="mt-6 rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addDate}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-400 transition hover:border-slate-600 hover:text-slate-300"
      >
        <Plus className="h-4 w-4" />
        Добавить дату
      </button>
    </div>
  );
}
