"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  type: string;
  author: { name: string };
  createdAt: string;
  publishedAt: string | null;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch posts from API
    // This is a placeholder - implement with tRPC
    setPosts([]);
  }, [filter]);

  const filteredPosts = posts.filter((post) => {
    if (search) {
      return post.title.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const statusColors: Record<string, string> = {
    DRAFT: "bg-slate-700 text-slate-200",
    PENDING: "bg-yellow-900/50 text-yellow-300",
    PUBLISHED: "bg-green-900/50 text-green-300",
    ARCHIVED: "bg-slate-800 text-slate-400",
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Публикации</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-500"
        >
          <Plus className="h-4 w-4" />
          Новая публикация
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск..."
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
          <option value="all">Все статусы</option>
          <option value="DRAFT">Черновик</option>
          <option value="PENDING">На модерации</option>
          <option value="PUBLISHED">Опубликовано</option>
          <option value="ARCHIVED">В архиве</option>
        </select>
      </div>

      {/* Posts table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 text-left text-xs uppercase text-slate-400">
              <th className="p-4">Название</th>
              <th className="p-4">Автор</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Дата</th>
              <th className="p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Нет публикаций
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30"
                >
                  <td className="p-4">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="font-medium text-slate-100 hover:text-white"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    {post.author.name}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColors[post.status]}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      {post.status === "PENDING" && (
                        <>
                          <button className="rounded-lg p-1.5 text-green-400 hover:bg-green-900/30">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-1.5 text-red-400 hover:bg-red-900/30">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400">
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
