"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Stats {
  totalPosts: number;
  pendingPosts: number;
  publishedPosts: number;
  totalUsers: number;
  totalComments: number;
  totalSubscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Fetch stats from API
    // This is a placeholder - implement with tRPC
    setStats({
      totalPosts: 0,
      pendingPosts: 0,
      publishedPosts: 0,
      totalUsers: 0,
      totalComments: 0,
      totalSubscribers: 0,
    });
  }, []);

  const cards = [
    {
      label: "Всего публикаций",
      value: stats?.totalPosts ?? 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "На модерации",
      value: stats?.pendingPosts ?? 0,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Опубликовано",
      value: stats?.publishedPosts ?? 0,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Пользователей",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-purple-500",
    },
    {
      label: "Комментариев",
      value: stats?.totalComments ?? 0,
      icon: MessageSquare,
      color: "text-orange-500",
    },
    {
      label: "Подписчиков",
      value: stats?.totalSubscribers ?? 0,
      icon: TrendingUp,
      color: "text-cyan-500",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-slate-100">Дашборд</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{card.label}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-100">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Pending posts */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">
          Ожидают модерации
        </h2>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-slate-400">Нет публикаций на модерации</p>
        </div>
      </div>
    </div>
  );
}
