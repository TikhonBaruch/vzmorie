"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";

interface HeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  infoLeft: string;
  infoRight: string;
  tileDivingTitle: string;
  tileDivingSubtitle: string;
  tileOrganizerTitle: string;
  tileOrganizerSubtitle: string;
  tileOrganizerText: string;
  tileTrophyTitle: string;
  tileTrophySubtitle: string;
  tileTrophyText: string;
  tileLiveTitle: string;
  tileLiveSubtitle: string;
}

const defaults: HeroConfig = {
  badge: "Кулагинский банк / Астраханская область",
  title: "ЖИВИ НА ВОДЕ. ОТДЫХАЙ НА ЗЕМЛЕ.",
  subtitle: "Трофейная рыбалка и подводная охота в 5 минутах от базы. 90 км от Астрахани.",
  ctaPrimary: "Узнать даты и места",
  ctaSecondary: "Смотреть тарифы",
  infoLeft: "Кулагинский банк",
  infoRight: "5 минут до воды",
  tileDivingTitle: "Сезон ПО открыт",
  tileDivingSubtitle: "Для подвохов",
  tileOrganizerTitle: "Едете компанией?",
  tileOrganizerSubtitle: "Для организатора",
  tileOrganizerText: "Пакеты «всё включено» с баней, отдыхом и логистикой.",
  tileTrophyTitle: "Трофеи банка",
  tileTrophySubtitle: "Для трофейщика",
  tileTrophyText: "Ямы и перекаты рядом — работаем по точкам быстро.",
  tileLiveTitle: "Вести с воды",
  tileLiveSubtitle: "Live-статус",
};

export default function HeroAdminPage() {
  const [config, setConfig] = useState<HeroConfig>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/public/hero")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setConfig(data);
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
        body: JSON.stringify({ key: "hero", value: config }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof HeroConfig, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none";
  const labelClass = "block mb-1 text-sm text-slate-400";
  const sectionClass = "rounded-2xl border border-slate-800 bg-slate-900/50 p-5";

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
          <h1 className="text-2xl font-bold text-slate-100">Hero блок</h1>
          <p className="mt-2 text-sm text-slate-400">
            Редактирование текстов главного экрана
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-500 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-950/30 px-4 py-3 text-sm text-green-400">
          Тексты сохранены!
        </div>
      )}

      <div className="space-y-6">
        {/* Основной блок */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Основной блок</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Бейдж (местоположение)</label>
              <input
                type="text"
                value={config.badge}
                onChange={(e) => update("badge", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Заголовок (крупный текст)</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => update("title", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Подзаголовок</label>
              <textarea
                value={config.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Кнопки</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Основная кнопка (CTA)</label>
              <input
                type="text"
                value={config.ctaPrimary}
                onChange={(e) => update("ctaPrimary", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Вторичная кнопка</label>
              <input
                type="text"
                value={config.ctaSecondary}
                onChange={(e) => update("ctaSecondary", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Инфо-плашки */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Инфо-плашки</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Левая плашка</label>
              <input
                type="text"
                value={config.infoLeft}
                onChange={(e) => update("infoLeft", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Правая плашка</label>
              <input
                type="text"
                value={config.infoRight}
                onChange={(e) => update("infoRight", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Плитка: Для подвохов */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Плитка: Для подвохов</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Подзаголовок</label>
              <input
                type="text"
                value={config.tileDivingSubtitle}
                onChange={(e) => update("tileDivingSubtitle", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Заголовок</label>
              <input
                type="text"
                value={config.tileDivingTitle}
                onChange={(e) => update("tileDivingTitle", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Плитка: Для организатора */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Плитка: Для организатора</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Подзаголовок</label>
                <input
                  type="text"
                  value={config.tileOrganizerSubtitle}
                  onChange={(e) => update("tileOrganizerSubtitle", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Заголовок</label>
                <input
                  type="text"
                  value={config.tileOrganizerTitle}
                  onChange={(e) => update("tileOrganizerTitle", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Текст</label>
              <input
                type="text"
                value={config.tileOrganizerText}
                onChange={(e) => update("tileOrganizerText", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Плитка: Для трофейщика */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Плитка: Для трофейщика</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Подзаголовок</label>
                <input
                  type="text"
                  value={config.tileTrophySubtitle}
                  onChange={(e) => update("tileTrophySubtitle", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Заголовок</label>
                <input
                  type="text"
                  value={config.tileTrophyTitle}
                  onChange={(e) => update("tileTrophyTitle", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Текст</label>
              <input
                type="text"
                value={config.tileTrophyText}
                onChange={(e) => update("tileTrophyText", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Плитка: Live-статус */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Плитка: Live-статус</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Подзаголовок</label>
              <input
                type="text"
                value={config.tileLiveSubtitle}
                onChange={(e) => update("tileLiveSubtitle", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Заголовок</label>
              <input
                type="text"
                value={config.tileLiveTitle}
                onChange={(e) => update("tileLiveTitle", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
