"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Save,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import NextImage from "next/image";

interface GalleryItem {
  id: string;
  key: string;
  url: string;
  urlAfter: string | null;
  alt: string | null;
  title: string | null;
  desc: string | null;
  sort: number;
}

function ImageUpload({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "gallery");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      }
    } catch {}
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      {value ? (
        <div className="relative group">
          <div className="relative h-32 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <NextImage src={value} alt={label} fill className="object-cover" sizes="200px" />
          </div>
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center h-32 rounded-xl border border-dashed cursor-pointer transition ${
            dragOver ? "border-blue-500 bg-blue-900/20" : "border-slate-700 hover:border-slate-600"
          }`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-slate-500 mb-1" />
              <span className="text-xs text-slate-500">Нажмите или перетащите</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [batchUploading, setBatchUploading] = useState(false);
  const batchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    const res = await fetch("/api/admin/site-images", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      // Filter gallery items (key starts with "gallery_")
      const galleryItems = data.filter((img: GalleryItem) => img.key.startsWith("gallery_"));
      setItems(galleryItems);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Update sort order for all items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await fetch(`/api/admin/site-images/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          url: item.url,
          urlAfter: item.urlAfter,
          title: item.title,
          desc: item.desc,
          sort: i,
        }),
      });
    }
    await fetchImages();
    setSaving(false);
  };

  const addItem = async () => {
    const newKey = `gallery_${Date.now()}`;
    const res = await fetch("/api/admin/site-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        key: newKey,
        url: "",
        urlAfter: null,
        title: "",
        desc: "",
        sort: items.length,
      }),
    });
    if (res.ok) {
      const newItem = await res.json();
      setItems([...items, newItem]);
      setEditingIndex(items.length);
    }
  };

  const removeItem = async (index: number) => {
    const item = items[index];
    await fetch(`/api/admin/site-images/${item.id}`, { method: "DELETE", credentials: "include" });
    setItems(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
  };

  const updateItem = (index: number, field: keyof GalleryItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setBatchUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          const newKey = `gallery_${Date.now()}_${i}`;
          await fetch("/api/admin/site-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              key: newKey,
              url: data.url,
              title: file.name.replace(/\.[^.]+$/, ""),
              desc: "",
              sort: items.length + i,
            }),
          });
        }
      } catch {}
    }

    await fetchImages();
    setBatchUploading(false);
    if (batchInputRef.current) batchInputRef.current.value = "";
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
    if (editingIndex === index) setEditingIndex(newIndex);
    else if (editingIndex === newIndex) setEditingIndex(index);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="text-slate-400">Загрузка...</div></div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Галерея работ</h1>
          <p className="text-sm text-slate-400 mt-1">Управление фото "До/После" для лендинга</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addItem} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            <Plus className="h-4 w-4" /> Добавить фото
          </button>
          <button
            onClick={() => batchInputRef.current?.click()}
            disabled={batchUploading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {batchUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {batchUploading ? "Загрузка..." : "Загрузить несколько"}
          </button>
          <input
            ref={batchInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleBatchUpload}
            className="hidden"
          />
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-2xl">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-slate-600" />
          <p>Нет фото в галерее</p>
          <p className="text-sm mt-1">Нажмите "Добавить фото" чтобы начать</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-800/30 transition" onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}>
                <GripVertical className="h-5 w-5 text-slate-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-100">{item.title || `Фото ${idx + 1}`}</span>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.desc || "Без описания"}</p>
                </div>
                {item.url && (
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                    <NextImage src={item.url} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                )}
                {item.urlAfter && (
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                    <NextImage src={item.urlAfter} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); moveItem(idx, "up"); }} disabled={idx === 0} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveItem(idx, "down"); }} disabled={idx === items.length - 1} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); removeItem(idx); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-900/30"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Edit form */}
              {editingIndex === idx && (
                <div className="border-t border-slate-800 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Название</label>
                      <input type="text" value={item.title || ""} onChange={(e) => updateItem(idx, "title", e.target.value)} placeholder="Покраска крыла" className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Описание</label>
                      <input type="text" value={item.desc || ""} onChange={(e) => updateItem(idx, "desc", e.target.value)} placeholder="Восстановление после ДТП" className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ImageUpload value={item.url} onChange={(url) => updateItem(idx, "url", url)} label='Фото "До"' />
                    <ImageUpload value={item.urlAfter || ""} onChange={(url) => updateItem(idx, "urlAfter", url || null)} label='Фото "После" (необязательно)' />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
