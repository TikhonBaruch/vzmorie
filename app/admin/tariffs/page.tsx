"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";

interface Tariff {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string[];
  popular: boolean;
  sort: number;
}

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Tariff | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchTariffs = useCallback(() => {
    fetch("/api/admin/products?category=tariff", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          features: p.description ? p.description.split("\n").filter(Boolean) : [],
          popular: p.featured,
          sort: p.sort,
        }));
        setTariffs(mapped.sort((a: Tariff, b: Tariff) => a.sort - b.sort));
      })
      .catch(() => setTariffs([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTariffs();
  }, [fetchTariffs]);

  const handleSave = async (tariff: Tariff) => {
    setSaving(true);
    try {
      const body = {
        name: tariff.name,
        price: tariff.price,
        description: tariff.features.join("\n"),
        category: "tariff",
        featured: tariff.popular,
        sort: tariff.sort,
        inStock: true,
        slug: tariff.name.toLowerCase().replace(/\s+/g, "-"),
      };

      if (tariff.id) {
        await fetch(`/api/admin/products/${tariff.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
      }
      fetchTariffs();
      setEditing(null);
      setCreating(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить тариф?")) return;
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchTariffs();
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

  if (creating || editing) {
    return (
      <TariffForm
        tariff={editing}
        saving={saving}
        onSave={handleSave}
        onCancel={() => { setEditing(null); setCreating(false); }}
      />
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Тарифы</h1>
          <p className="mt-2 text-sm text-slate-400">
            Управление тарифными планами для отображения на сайте
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-500"
        >
          <Plus className="h-4 w-4" />
          Новый тариф
        </button>
      </div>

      {tariffs.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">Нет тарифов. Добавьте первый.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tariffs.map((tariff) => (
            <div
              key={tariff.id}
              className={`rounded-2xl border p-5 ${
                tariff.popular
                  ? "border-terracotta-500/60 bg-slate-900/80"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-100">{tariff.name}</h3>
                    {tariff.popular && (
                      <span className="rounded-full bg-terracotta-600 px-2 py-0.5 text-xs font-medium text-white">
                        Популярный
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-50">
                    {tariff.price.toLocaleString("ru-RU")} <span className="text-sm font-normal text-slate-400">руб / сутки</span>
                  </div>
                  {tariff.features.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {tariff.features.map((f, i) => (
                        <li key={i} className="text-sm text-slate-300">• {f}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(tariff)}
                    className="rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(tariff.id)}
                    className="rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:bg-red-900/30 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TariffForm({
  tariff,
  saving,
  onSave,
  onCancel,
}: {
  tariff: Tariff | null;
  saving: boolean;
  onSave: (tariff: Tariff) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(tariff?.name || "");
  const [price, setPrice] = useState(tariff?.price?.toString() || "");
  const [features, setFeatures] = useState(tariff?.features?.join("\n") || "");
  const [popular, setPopular] = useState(tariff?.popular || false);
  const [sort, setSort] = useState(tariff?.sort?.toString() || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: tariff?.id || "",
      name,
      price: parseFloat(price) || 0,
      description: null,
      features: features.split("\n").filter(Boolean),
      popular,
      sort: parseInt(sort) || 0,
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none";
  const labelClass = "block mb-1 text-sm text-slate-400";

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-100">
          ✕
        </button>
        <h1 className="text-2xl font-bold text-slate-100">
          {tariff ? "Редактирование тарифа" : "Новый тариф"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Название *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
              placeholder="Стандарт"
            />
          </div>
          <div>
            <label className={labelClass}>Цена (руб/сутки) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className={inputClass}
              placeholder="7100"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Что включено (по строке)</label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            rows={5}
            className={inputClass}
            placeholder={"Проживание\n3-разовое питание\nЛодка + Егерь\nБаня"}
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={popular}
              onChange={(e) => setPopular(e.target.checked)}
              className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-terracotta-500"
            />
            Популярный
          </label>
          <div>
            <label className={labelClass}>Порядок</label>
            <input
              type="number"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-20 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-terracotta-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving || !name || !price}
            className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-500 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-800 px-6 py-2.5 text-sm text-slate-400 hover:text-slate-100"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
