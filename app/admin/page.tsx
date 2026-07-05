"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Stats {
  totalPosts: number;
  pendingPosts: number;
  publishedPosts: number;
  totalUsers: number;
  totalComments: number;
  totalSubscribers: number;
}

interface PendingPost {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  author: { name: string };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<PendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { credentials: "include" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/posts?status=PENDING", { credentials: "include" }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([statsData, pendingData]) => {
        setStats(statsData);
        setPending(pendingData || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Всего публикаций", value: stats?.totalPosts ?? 0, icon: FileText, color: "text-blue-500" },
    { label: "На модерации", value: stats?.pendingPosts ?? 0, icon: Clock, color: "text-yellow-500" },
    { label: "Опубликовано", value: stats?.publishedPosts ?? 0, icon: CheckCircle, color: "text-green-500" },
    { label: "Пользователей", value: stats?.totalUsers ?? 0, icon: Users, color: "text-purple-500" },
    { label: "Комментариев", value: stats?.totalComments ?? 0, icon: MessageSquare, color: "text-orange-500" },
    { label: "Подписчиков", value: stats?.totalSubscribers ?? 0, icon: TrendingUp, color: "text-cyan-500" },
  ];

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PUBLISHED" }),
    });
    if (res.ok) {
      setPending((p) => p.filter((post) => post.id !== id));
      setStats((s) => s ? { ...s, pendingPosts: s.pendingPosts - 1, publishedPosts: s.publishedPosts + 1 } : s);
    }
  };

  const handleReject = async (id: string) => {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DRAFT" }),
    });
    if (res.ok) {
      setPending((p) => p.filter((post) => post.id !== id));
      setStats((s) => s ? { ...s, pendingPosts: s.pendingPosts - 1 } : s);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-slate-100">Дашборд</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{card.label}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-100">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Ожидают модерации</h2>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50">
          {pending.length === 0 ? (
            <p className="p-6 text-slate-400">Нет публикаций на модерации</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {pending.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4">
                  <div>
                    <Link href={`/admin/posts?edit=${post.id}`} className="font-medium text-slate-100 hover:text-white">
                      {post.title}
                    </Link>
                    <p className="text-sm text-slate-400">
                      {post.author.name} &middot; {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="rounded-lg bg-green-900/30 px-3 py-1.5 text-sm text-green-400 hover:bg-green-900/50"
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleReject(post.id)}
                      className="rounded-lg bg-red-900/30 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/50"
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
