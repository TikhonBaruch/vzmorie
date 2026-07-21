"use client";

import { useEffect, useState } from "react";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  Settings,
  LogIn,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  details: string | null;
  createdAt: string;
}

const ACTION_ICONS: Record<string, any> = {
  LOGIN: LogIn,
  LOGOUT: LogIn,
  CREATE: Plus,
  UPDATE: Settings,
  DELETE: Trash2,
  PAGE_VIEW: Eye,
  UPLOAD: Upload,
};

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "text-green-400 bg-green-900/30",
  LOGOUT: "text-slate-400 bg-slate-800",
  CREATE: "text-blue-400 bg-blue-900/30",
  UPDATE: "text-amber-400 bg-amber-900/30",
  DELETE: "text-red-400 bg-red-900/30",
  PAGE_VIEW: "text-slate-400 bg-slate-800",
  UPLOAD: "text-purple-400 bg-purple-900/30",
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const perPage = 20;

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page, filterAction, filterEntity]);

  const fetchLogs = async () => {
    const params = new URLSearchParams();
    params.set("limit", String(perPage));
    params.set("offset", String((page - 1) * perPage));
    if (filterAction) params.set("action", filterAction);
    if (filterEntity) params.set("entity", filterEntity);

    const res = await fetch(`/api/admin/audit?${params}`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const res = await fetch("/api/admin/audit/stats", { credentials: "include" });
    if (res.ok) {
      setStats(await res.json());
    }
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Аудит действий</h1>
        <p className="text-sm text-slate-400 mt-1">Журнал всех действий пользователей</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Сегодня</div>
            <div className="text-2xl font-bold text-slate-100">{stats.totalToday}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">За неделю</div>
            <div className="text-2xl font-bold text-slate-100">{stats.totalWeek}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Всего</div>
            <div className="text-2xl font-bold text-slate-100">{total}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Типов действий</div>
            <div className="text-2xl font-bold text-slate-100">{stats.byAction?.length || 0}</div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <select
          value={filterAction}
          onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none"
        >
          <option value="">Все действия</option>
          <option value="LOGIN">Вход</option>
          <option value="CREATE">Создание</option>
          <option value="UPDATE">Обновление</option>
          <option value="DELETE">Удаление</option>
          <option value="UPLOAD">Загрузка</option>
        </select>
        <select
          value={filterEntity}
          onChange={(e) => { setFilterEntity(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none"
        >
          <option value="">Все сущности</option>
          <option value="auth">Авторизация</option>
          <option value="post">Публикации</option>
          <option value="review">Отзывы</option>
          <option value="booking">Заявки</option>
          <option value="user">Пользователи</option>
          <option value="file">Файлы</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Загрузка...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-slate-500">Нет записей</div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const Icon = ACTION_ICONS[log.action] || FileText;
            const colorClass = ACTION_COLORS[log.action] || "text-slate-400 bg-slate-800";
            return (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-100 text-sm">{log.action}</span>
                    <span className="text-xs text-slate-500">{log.entity}</span>
                  </div>
                  {log.details && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{log.details}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400">{log.userName || log.userId || "—"}</div>
                  <div className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString("ru-RU")}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-sm text-slate-400">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
