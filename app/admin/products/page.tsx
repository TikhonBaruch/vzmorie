"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Edit, Trash2, Save, ArrowLeft, Package, Star, Eye, EyeOff } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  category: string;
  image: string | null;
  inStock: boolean;
  featured: boolean;
  sort: number;
  createdAt: string;
}

const CATEGORIES = [
  "Снасти",
  "Приманки",
  "Экипировка",
  "Питание",
  "Сувениры",
  "Аренда",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchProducts = useCallback(() => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("category", filter);
    if (search) params.set("search", search);
    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then(setProducts);
  }, [filter, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить товар?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((item) => item.id !== id));
  };

  const handleToggle = async (id: string, field: "inStock" | "featured") => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !product[field] }),
    });
    fetchProducts();
  };

  if (creating || editing) {
    return (
      <ProductForm
        product={editing}
        onDone={() => {
          setCreating(false);
          setEditing(null);
          fetchProducts();
        }}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Товары</h1>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-500"
        >
          <Plus className="h-4 w-4" />
          Новый товар
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 focus:border-terracotta-500 focus:outline-none"
        >
          <option value="all">Все категории</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 text-left text-xs uppercase text-slate-400">
              <th className="p-4">Товар</th>
              <th className="p-4">Категория</th>
              <th className="p-4">Цена</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Нет товаров
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                          <Package className="h-5 w-5 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-100">{product.name}</div>
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                            <Star className="h-3 w-3" fill="currentColor" />
                            Витрина
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{product.category}</td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-100">
                      {product.price.toLocaleString("ru-RU")} ₽
                    </div>
                    {product.oldPrice && (
                      <div className="text-xs text-slate-500 line-through">
                        {product.oldPrice.toLocaleString("ru-RU")} ₽
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(product.id, "inStock")}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          product.inStock
                            ? "bg-green-900/50 text-green-300"
                            : "bg-red-900/50 text-red-300"
                        }`}
                      >
                        {product.inStock ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {product.inStock ? "В наличии" : "Нет в наличии"}
                      </button>
                      <button
                        onClick={() => handleToggle(product.id, "featured")}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          product.featured
                            ? "bg-yellow-900/50 text-yellow-300"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Star className="h-3 w-3" />
                        {product.featured ? "Витрина" : "Обычный"}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditing(product)}
                        title="Редактировать"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        title="Удалить"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onDone,
  onCancel,
}: {
  product: Product | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [oldPrice, setOldPrice] = useState(product?.oldPrice?.toString() || "");
  const [category, setCategory] = useState(product?.category || CATEGORIES[0]);
  const [image, setImage] = useState(product?.image || "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [sort, setSort] = useState(product?.sort?.toString() || "0");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      name,
      description,
      price,
      oldPrice: oldPrice || undefined,
      category,
      image,
      inStock,
      featured,
      sort,
    };

    if (product) {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    onDone();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-terracotta-500 focus:outline-none";
  const labelClass = "block mb-1 text-sm text-slate-400";

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-100">
          {product ? "Редактирование товара" : "Новый товар"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div>
          <label className={labelClass}>Название *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
            placeholder="Название товара"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Цена (₽) *</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass}>Старая цена (₽)</label>
            <input
              type="number"
              step="0.01"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className={inputClass}
              placeholder="Для скидки"
            />
          </div>
          <div>
            <label className={labelClass}>Категория *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={inputClass}
            placeholder="Описание товара"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>URL изображения</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelClass}>Порядок сортировки</label>
            <input
              type="number"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-terracotta-500 focus:ring-terracotta-500"
            />
            В наличии
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-terracotta-500 focus:ring-terracotta-500"
            />
            На витрину
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
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
