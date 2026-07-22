"use client";

import { useEffect, useState } from "react";
import {
  GripVertical,
  Eye,
  EyeOff,
  Save,
  ArrowUp,
  ArrowDown,
  Settings,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";

interface Section {
  id: string;
  page: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  settings: string | null;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero (Главный экран)",
  conditions: "Условия (Погода)",
  tariffs: "Тарифы",
  dates: "Даты заезда",
  gallery: "Галерея",
  contacts: "Контакты",
  features: "Особенности",
  fleet: "Флот и гиды",
  rest: "Отдых и баня",
  spearfishing: "Ныряние с гарпуном",
  infrastructure: "Инфраструктура",
  map: "Карта",
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  hero: "Заголовок, подзаголовок, фоновое изображение, CTA",
  conditions: "Текущая погода, клёв, уровень воды",
  tariffs: "Тарифные планы с ценами",
  dates: "Даты заезда с количеством мест",
  gallery: "Фотогалерея базы",
  contacts: "Телефон, email, адрес, соцсети",
  features: "Ключевые особенности базы",
  fleet: "Флот и гиды",
  rest: "Отдых и баня",
  spearfishing: "Ныряние с гарпуном",
  infrastructure: "Инфраструктура базы",
  map: "Карта с местоположением",
};

const INPUT_CLASS = "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none";
const LABEL_CLASS = "block mb-1 text-sm text-slate-400";

interface SeoRecord {
  pageKey: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

const SEO_PAGES = [
  { key: "home", label: "Главная страница" },
  { key: "posts", label: "Публикации" },
  { key: "portfolio", label: "Портфолио" },
];

export default function SettingsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [newSectionType, setNewSectionType] = useState("");
  const [seoData, setSeoData] = useState<Record<string, SeoRecord>>({});
  const [seoEditing, setSeoEditing] = useState<string | null>(null);
  const [seoSaving, setSeoSaving] = useState(false);
  const [restrictedMode, setRestrictedMode] = useState(false);
  const [restrictedLoading, setRestrictedLoading] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchSeo();
    fetchRestrictedMode();
  }, []);

  const fetchRestrictedMode = async () => {
    try {
      const res = await fetch("/api/admin/settings/restricted-mode");
      if (res.ok) {
        const data = await res.json();
        setRestrictedMode(data.enabled);
      }
    } catch {}
  };

  const toggleRestrictedMode = async () => {
    setRestrictedLoading(true);
    try {
      const res = await fetch("/api/admin/settings/restricted-mode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !restrictedMode }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {}
    setRestrictedLoading(false);
  };

  const fetchSections = async () => {
    const res = await fetch("/api/admin/sections?page=landing", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setSections(data);
    }
    setLoading(false);
  };

  const fetchSeo = async () => {
    try {
      const res = await fetch("/api/admin/seo", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, SeoRecord> = {};
        for (const item of data) {
          map[item.pageKey] = item;
        }
        setSeoData(map);
      }
    } catch {}
  };

  const handleSeoSave = async (pageKey: string) => {
    setSeoSaving(true);
    const record = seoData[pageKey] || { pageKey, metaTitle: "", metaDescription: "", ogImage: "" };
    await fetch("/api/admin/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(record),
    });
    setSeoEditing(null);
    setSeoSaving(false);
    fetchSeo();
  };

  const updateSeo = (pageKey: string, field: string, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      [pageKey]: {
        ...(prev[pageKey] || { pageKey, metaTitle: "", metaDescription: "", ogImage: "" }),
        [field]: value,
      },
    }));
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/admin/sections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    });
    if (res.ok) {
      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isActive } : s)));
    }
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;

    const newSections = [...sections];
    const tempOrder = newSections[idx].sortOrder;
    newSections[idx].sortOrder = newSections[swapIdx].sortOrder;
    newSections[swapIdx].sortOrder = tempOrder;
    [newSections[idx], newSections[swapIdx]] = [newSections[swapIdx], newSections[idx]];
    setSections(newSections);

    const items = newSections.map((s, i) => ({ id: s.id, sortOrder: i }));
    await fetch("/api/admin/sections/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ items }),
    });
  };

  const handleCreateSection = async () => {
    if (!newSectionType) return;
    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        page: "landing",
        type: newSectionType,
        title: SECTION_LABELS[newSectionType] || newSectionType,
        content: "{}",
        sortOrder: sections.length,
      }),
    });
    setNewSectionType("");
    fetchSections();
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Удалить секцию?")) return;
    await fetch(`/api/admin/sections/${id}`, { method: "DELETE", credentials: "include" });
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (editing === id) {
      setEditing(null);
      setEditForm({});
    }
  };

  const handleEdit = (section: Section) => {
    setEditing(section.id);
    let contentObj: any = {};
    try {
      contentObj = section.content ? JSON.parse(section.content) : {};
    } catch {}
    setEditForm({
      ...section,
      contentParsed: contentObj,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    const body: any = {
      title: editForm.title,
      subtitle: editForm.subtitle,
      image: editForm.image,
      sortOrder: editForm.sortOrder,
      isActive: editForm.isActive,
    };

    if (editForm.contentParsed) {
      body.content = JSON.stringify(editForm.contentParsed);
    }

    const res = await fetch(`/api/admin/sections/${editing}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (res.ok) {
      await fetchSections();
      setEditing(null);
      setEditForm({});
    }
    setSaving(false);
  };

  const updateField = (field: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateContent = (key: string, value: any) => {
    setEditForm((prev: any) => ({
      ...prev,
      contentParsed: { ...(prev.contentParsed || {}), [key]: value },
    }));
  };

  const renderContentEditor = (type: string) => {
    switch (type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLASS}>Заголовок</label>
              <input type="text" value={editForm.contentParsed?.title || ""} onChange={(e) => updateContent("title", e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Подзаголовок</label>
              <input type="text" value={editForm.contentParsed?.subtitle || ""} onChange={(e) => updateContent("subtitle", e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>CTA текст</label>
              <input type="text" value={editForm.contentParsed?.ctaText || ""} onChange={(e) => updateContent("ctaText", e.target.value)} className={INPUT_CLASS} placeholder="Забронировать" />
            </div>
          </div>
        );
      case "contacts":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Телефон</label>
                <input type="text" value={editForm.contentParsed?.phone || ""} onChange={(e) => updateContent("phone", e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>Email</label>
                <input type="text" value={editForm.contentParsed?.email || ""} onChange={(e) => updateContent("email", e.target.value)} className={INPUT_CLASS} />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASS}>Адрес</label>
              <input type="text" value={editForm.contentParsed?.address || ""} onChange={(e) => updateContent("address", e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Часы работы</label>
              <input type="text" value={editForm.contentParsed?.workHours || ""} onChange={(e) => updateContent("workHours", e.target.value)} className={INPUT_CLASS} />
            </div>
          </div>
        );
      case "tariffs":
        return (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLASS}>Описание</label>
              <textarea value={editForm.contentParsed?.description || ""} onChange={(e) => updateContent("description", e.target.value)} rows={3} className={INPUT_CLASS} />
            </div>
            <p className="text-xs text-slate-500">Тарифы управляются через раздел "Тарифы" в админке.</p>
          </div>
        );
      case "dates":
        return (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLASS}>Описание</label>
              <textarea value={editForm.contentParsed?.description || ""} onChange={(e) => updateContent("description", e.target.value)} rows={3} className={INPUT_CLASS} />
            </div>
            <p className="text-xs text-slate-500">Даты заезда управляются через раздел "Даты заезда" в админке.</p>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLASS}>Содержимое (JSON)</label>
              <textarea
                value={JSON.stringify(editForm.contentParsed || {}, null, 2)}
                onChange={(e) => {
                  try {
                    setEditForm((prev: any) => ({ ...prev, contentParsed: JSON.parse(e.target.value) }));
                  } catch {}
                }}
                rows={8}
                className={`${INPUT_CLASS} font-mono text-xs`}
                placeholder='{"key": "value"}'
              />
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="text-slate-400">Загрузка...</div></div>;
  }

  const availableTypes = Object.keys(SECTION_LABELS).filter(
    (t) => !sections.some((s) => s.type === t)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Настройки главной</h1>
        <p className="text-sm text-slate-400 mt-1">Управление секциями лендинга — порядок, видимость, контент</p>
      </div>

      {/* Создание новой секции */}
      {availableTypes.length > 0 && (
        <div className="mb-6 flex gap-3">
          <select
            value={newSectionType}
            onChange={(e) => setNewSectionType(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none"
          >
            <option value="">Добавить секцию...</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>{SECTION_LABELS[t]}</option>
            ))}
          </select>
          <button
            onClick={handleCreateSection}
            disabled={!newSectionType}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Создать
          </button>
        </div>
      )}

      {/* Список секций */}
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div key={section.id} className={`rounded-2xl border bg-slate-900/50 transition ${section.isActive ? "border-slate-800" : "border-slate-800/50 opacity-60"}`}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
              <GripVertical className="h-5 w-5 text-slate-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-100">{SECTION_LABELS[section.type] || section.type}</span>
                  {!section.isActive && <span className="text-xs text-yellow-500 bg-yellow-900/30 px-2 py-0.5 rounded">Скрыто</span>}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{SECTION_DESCRIPTIONS[section.type] || ""}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleMove(section.id, "up")} disabled={idx === 0} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30" title="Вверх"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => handleMove(section.id, "down")} disabled={idx === sections.length - 1} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30" title="Вниз"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => handleToggle(section.id, !section.isActive)} className={`p-1.5 rounded-lg transition ${section.isActive ? "text-green-400 hover:bg-green-900/30" : "text-slate-500 hover:bg-slate-800"}`} title={section.isActive ? "Скрыть" : "Показать"}>
                  {section.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => editing === section.id ? (setEditing(null), setEditForm({})) : handleEdit(section)} className={`p-1.5 rounded-lg transition ${editing === section.id ? "bg-blue-900/30 text-blue-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`} title="Редактировать">
                  <Settings className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteSection(section.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400" title="Удалить">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Edit form */}
            {editing === section.id && (
              <div className="border-t border-slate-800 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Заголовок</label>
                    <input type="text" value={editForm.title || ""} onChange={(e) => updateField("title", e.target.value)} className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Подзаголовок</label>
                    <input type="text" value={editForm.subtitle || ""} onChange={(e) => updateField("subtitle", e.target.value)} className={INPUT_CLASS} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLASS}>Изображение</label>
                    <input type="text" value={editForm.image || ""} onChange={(e) => updateField("image", e.target.value)} className={INPUT_CLASS} placeholder="/images/photo.jpg" />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Контент секции</h4>
                  {renderContentEditor(section.type)}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Сохранение..." : "Сохранить"}
                  </button>
                  <button onClick={() => { setEditing(null); setEditForm({}); }} className="rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-400 hover:text-slate-100">Отмена</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sections.length === 0 && <div className="text-center py-12 text-slate-500">Нет секций. Используйте форму выше для создания.</div>}

      {/* SEO секция */}
      <div className="mt-12 border-t border-slate-800 pt-8">
        <h2 className="text-xl font-bold text-slate-100 mb-2">SEO-настройки страниц</h2>
        <p className="text-sm text-slate-400 mb-6">Meta-теги для статических страниц (title, description, og:image)</p>

        <div className="space-y-3">
          {SEO_PAGES.map(({ key, label }) => (
            <div key={key} className="rounded-2xl border border-slate-800 bg-slate-900/50">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setSeoEditing(seoEditing === key ? null : key)}
              >
                <div>
                  <span className="font-medium text-slate-100">{label}</span>
                  {seoData[key]?.metaTitle && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                      {seoData[key].metaTitle} — {seoData[key].metaDescription?.slice(0, 60)}...
                    </p>
                  )}
                </div>
                <Settings className="h-4 w-4 text-slate-500" />
              </div>

              {seoEditing === key && (
                <div className="border-t border-slate-800 p-4 space-y-4">
                  <div>
                    <label className={LABEL_CLASS}>Meta Title</label>
                    <input
                      type="text"
                      value={seoData[key]?.metaTitle || ""}
                      onChange={(e) => updateSeo(key, "metaTitle", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="Заголовок для поисковика (до 60 символов)"
                      maxLength={60}
                    />
                    <p className="text-xs text-slate-500 mt-1">{(seoData[key]?.metaTitle || "").length}/60</p>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Meta Description</label>
                    <textarea
                      value={seoData[key]?.metaDescription || ""}
                      onChange={(e) => updateSeo(key, "metaDescription", e.target.value)}
                      rows={3}
                      className={INPUT_CLASS}
                      placeholder="Описание для поисковика (до 160 символов)"
                      maxLength={160}
                    />
                    <p className="text-xs text-slate-500 mt-1">{(seoData[key]?.metaDescription || "").length}/160</p>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>OG Image URL</label>
                    <input
                      type="text"
                      value={seoData[key]?.ogImage || ""}
                      onChange={(e) => updateSeo(key, "ogImage", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="https://... (изображение для соцсетей)"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleSeoSave(key)}
                      disabled={seoSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      {seoSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {seoSaving ? "Сохранение..." : "Сохранить"}
                    </button>
                    <button
                      onClick={() => setSeoEditing(null)}
                      className="rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-400 hover:text-slate-100"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Restricted Mode */}
      <div className="mt-12 border-t border-slate-800 pt-8">
        <h2 className="text-xl font-bold text-slate-100 mb-2">Ограничение доступа</h2>
        <p className="text-sm text-slate-400 mb-4">При включении все пользователи (кроме Супер-админа) будут иметь доступ только к чату.</p>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-slate-100">Режим ограничения</span>
            <p className="text-xs text-slate-500 mt-0.5">
              {restrictedMode ? "Включён — Админ, Редактор, Специалист видят только чат" : "Выключен — полный доступ"}
            </p>
          </div>
          <button
            onClick={toggleRestrictedMode}
            disabled={restrictedLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              restrictedMode ? "bg-red-600" : "bg-slate-700"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              restrictedMode ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>
        {restrictedMode && (
          <p className="mt-2 text-xs text-red-400">Режим ограничения активен. Специалисты, Редакторы и Админы могут использовать только чат.</p>
        )}
      </div>
    </div>
  );
}
