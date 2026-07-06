"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

interface SiteImage {
  id: string;
  key: string;
  url: string;
  alt: string | null;
  sort: number;
}

const PRESET_KEYS = [
  { key: "hero", label: "Фон главного экрана (HeroBento)" },
  { key: "gallery_1", label: "Галерея — фото 1" },
  { key: "gallery_2", label: "Галерея — фото 2" },
  { key: "gallery_3", label: "Галерея — фото 3" },
  { key: "gallery_4", label: "Галерея — фото 4" },
  { key: "gallery_5", label: "Галерея — фото 5" },
  { key: "gallery_6", label: "Галерея — фото 6" },
  { key: "gallery_7", label: "Галерея — фото 7" },
  { key: "gallery_8", label: "Галерея — фото 8" },
];

export default function SiteImagesPage() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");

  const fetchImages = useCallback(() => {
    fetch("/api/admin/site-images", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleAdd = async () => {
    if (!newKey || !newUrl) return;
    setSaving(true);
    await fetch("/api/admin/site-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ key: newKey, url: newUrl, alt: newAlt, sort: images.length }),
    });
    setNewKey("");
    setNewUrl("");
    setNewAlt("");
    fetchImages();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить фото?")) return;
    await fetch(`/api/admin/site-images/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchImages();
  };

  const handleUpdate = async (id: string, field: string, value: string | number) => {
    await fetch(`/api/admin/site-images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ [field]: value }),
    });
    fetchImages();
  };

  const usedKeys = new Set(images.map((i) => i.key));
  const availablePresets = PRESET_KEYS.filter((p) => !usedKeys.has(p.key));

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Фото сайта</h1>
        <p className="mt-2 text-sm text-slate-400">
          Управление изображениями для HeroBento и галереи.
        </p>
      </div>

      {/* Current images */}
      <div className="mb-8 space-y-4">
        {images.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
            Нет загруженных фото. Добавьте первое ниже.
          </div>
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex-shrink-0">
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.alt || img.key}
                    className="h-20 w-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-slate-800">
                    <ImageIcon className="h-6 w-6 text-slate-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300">
                    {img.key}
                  </span>
                  <span className="text-xs text-slate-500">Порядок: {img.sort}</span>
                </div>
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => handleUpdate(img.id, "url", e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
                <input
                  type="text"
                  value={img.alt || ""}
                  onChange={(e) => handleUpdate(img.id, "alt", e.target.value)}
                  className={inputClass}
                  placeholder="Описание (alt)"
                />
              </div>

              <button
                onClick={() => handleDelete(img.id)}
                className="flex-shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add new image */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Добавить фото</h2>

        <div className="mb-4">
          <label className={labelClass}>Ключ (key)</label>
          <select
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className={inputClass}
          >
            <option value="">Выберите...</option>
            {availablePresets.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
            <option value="custom">Свой ключ...</option>
          </select>
          {newKey === "custom" && (
            <input
              type="text"
              value=""
              onChange={(e) => setNewKey(e.target.value)}
              className={`mt-2 ${inputClass}`}
              placeholder="my_custom_key"
            />
          )}
        </div>

        {/* Input mode toggle */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${
              inputMode === "upload"
                ? "bg-terracotta-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Загрузить файл
          </button>
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${
              inputMode === "url"
                ? "bg-terracotta-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            Вставить ссылку
          </button>
        </div>

        {inputMode === "upload" ? (
          <FileUpload
            onUpload={(url) => setNewUrl(url)}
            folder="site"
            className="mb-4"
          />
        ) : (
          <div className="mb-4">
            <label className={labelClass}>URL изображения *</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className={inputClass}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        )}

        <div className="mb-4">
          <label className={labelClass}>Описание (alt)</label>
          <input
            type="text"
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            className={inputClass}
            placeholder="Описание изображения"
          />
        </div>

        {newUrl && (
          <div className="mb-4">
            <label className={labelClass}>Предпросмотр</label>
            <img
              src={newUrl}
              alt={newAlt || "Предпросмотр"}
              className="mt-1 h-32 w-full rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={!newKey || !newUrl || saving}
          className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-500 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {saving ? "Сохранение..." : "Добавить"}
        </button>
      </div>
    </div>
  );
}
