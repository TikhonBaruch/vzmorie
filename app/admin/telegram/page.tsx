"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, Edit, Bot, RefreshCw, ArrowLeft, ExternalLink, CheckCircle, XCircle } from "lucide-react";

interface TelegramRecipient {
  id: string;
  name: string;
  chatId: string;
  role: string;
  isActive: boolean;
}

interface WebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
}

const ROLE_LABELS: Record<string, string> = {
  manager: "Менеджер",
  master: "Мастер",
  admin: "Администратор",
};

const ROLE_COLORS: Record<string, string> = {
  manager: "bg-blue-900/50 text-blue-300",
  master: "bg-green-900/50 text-green-300",
  admin: "bg-purple-900/50 text-purple-300",
};

export default function TelegramAdminPage() {
  const [recipients, setRecipients] = useState<TelegramRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TelegramRecipient | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Webhook state
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
  const [webhookLoading, setWebhookLoading] = useState(true);
  const [webhookSetting, setWebhookSetting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookMessage, setWebhookMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchRecipients();
    fetchWebhookInfo();
  }, []);

  const fetchRecipients = async () => {
    try {
      const res = await fetch("/api/admin/telegram/recipients", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRecipients(data);
      }
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWebhookInfo = async () => {
    try {
      const res = await fetch("/api/telegram/setup", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setWebhookInfo(data.webhookInfo);
      }
    } catch (error) {
      console.error("Failed to fetch webhook info:", error);
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleSetWebhook = async () => {
    setWebhookSetting(true);
    setWebhookMessage(null);
    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: webhookUrl || undefined }),
      });
      const data = await res.json();
      if (data.setWebhook?.ok) {
        setWebhookMessage({ type: "success", text: "Webhook успешно настроен!" });
        setWebhookInfo(data.webhookInfo);
      } else {
        setWebhookMessage({ type: "error", text: data.setWebhook?.description || "Ошибка настройки" });
      }
    } catch {
      setWebhookMessage({ type: "error", text: "Ошибка соединения" });
    }
    setWebhookSetting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить получателя?")) return;
    const res = await fetch(`/api/admin/telegram/recipients?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setRecipients((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleToggleActive = async (recipient: TelegramRecipient) => {
    const res = await fetch("/api/admin/telegram/recipients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: recipient.id, isActive: !recipient.isActive }),
    });
    if (res.ok) {
      setRecipients((prev) =>
        prev.map((r) => (r.id === recipient.id ? { ...r, isActive: !r.isActive } : r))
      );
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none";
  const labelClass = "block mb-1 text-sm text-slate-400";

  if (loading || webhookLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  if (creating || editing) {
    return (
      <RecipientForm
        recipient={editing}
        onDone={() => { setCreating(false); setEditing(null); fetchRecipients(); }}
        onCancel={() => { setCreating(false); setEditing(null); }}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Telegram</h1>
        <p className="text-sm text-slate-400 mt-1">Настройка webhook и управление получателями уведомлений</p>
      </div>

      {/* Webhook Status Section */}
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Webhook</h2>

        {webhookInfo ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {webhookInfo.url ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <span className="text-sm text-slate-300">
                {webhookInfo.url ? "Webhook активен" : "Webhook не настроен"}
              </span>
            </div>

            {webhookInfo.url && (
              <div className="text-xs text-slate-500">
                URL: {webhookInfo.url}
              </div>
            )}

            {webhookInfo.pending_update_count > 0 && (
              <div className="text-xs text-yellow-400">
                Ожидает обработки: {webhookInfo.pending_update_count} обновлений
              </div>
            )}

            {webhookInfo.last_error_message && (
              <div className="text-xs text-red-400">
                Последняя ошибка: {webhookInfo.last_error_message}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Загрузка информации о webhook...</p>
        )}

        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="URL webhook (оставьте пустым для автонастройки)"
            className={inputClass}
          />
          <button
            onClick={handleSetWebhook}
            disabled={webhookSetting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {webhookSetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {webhookSetting ? "Настройка..." : "Настроить"}
          </button>
        </div>

        {webhookMessage && (
          <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${
            webhookMessage.type === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
          }`}>
            {webhookMessage.text}
          </div>
        )}

        <div className="mt-4 text-xs text-slate-500">
          <p>Команды бота: /start, /help, /my, /stats, /delete [id], /status [id], /сводка</p>
          <p>Хештеги: #теги для автоматических тегов, #портфолио для добавления в портфолио</p>
        </div>
      </div>

      {/* Recipients Section */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Получатели уведомлений</h2>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" /> Добавить получателя
        </button>
      </div>

      {recipients.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <Bot className="mx-auto h-12 w-12 text-slate-600 mb-4" />
          <p className="text-slate-400">Нет получателей уведомлений</p>
          <p className="text-sm text-slate-500 mt-2">Добавьте получателя для получения уведомлений в Telegram</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipients.map((recipient) => (
            <div
              key={recipient.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-2 ${recipient.isActive ? "bg-green-900/30" : "bg-slate-800"}`}>
                  <Bot className={`h-5 w-5 ${recipient.isActive ? "text-green-400" : "text-slate-500"}`} />
                </div>
                <div>
                  <div className="font-medium text-slate-100">{recipient.name}</div>
                  <div className="text-sm text-slate-400">Chat ID: {recipient.chatId}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[recipient.role] || "bg-slate-700 text-slate-300"}`}>
                  {ROLE_LABELS[recipient.role] || recipient.role}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(recipient)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    recipient.isActive
                      ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {recipient.isActive ? "Активен" : "Отключен"}
                </button>
                <button
                  onClick={() => setEditing(recipient)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(recipient.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecipientForm({ recipient, onDone, onCancel }: { recipient: TelegramRecipient | null; onDone: () => void; onCancel: () => void }) {
  const [name, setName] = useState(recipient?.name || "");
  const [chatId, setChatId] = useState(recipient?.chatId || "");
  const [role, setRole] = useState(recipient?.role || "manager");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass = "w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none";
  const labelClass = "block mb-1 text-sm text-slate-400";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (recipient) {
        const res = await fetch("/api/admin/telegram/recipients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: recipient.id, name, chatId, role }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Ошибка сохранения");
          setSaving(false);
          return;
        }
      } else {
        const res = await fetch("/api/admin/telegram/recipients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, chatId, role }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Ошибка создания");
          setSaving(false);
          return;
        }
      }
      onDone();
    } catch {
      setError("Ошибка соединения");
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-100">
          {recipient ? "Редактирование получателя" : "Новый получатель"}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className={labelClass}>Имя *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
            placeholder="Имя получателя"
          />
        </div>

        <div>
          <label className={labelClass}>Chat ID *</label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            required
            className={inputClass}
            placeholder="123456789"
          />
          <p className="text-xs text-slate-500 mt-1">Узнайте Chat ID через @userinfobot в Telegram</p>
        </div>

        <div>
          <label className={labelClass}>Роль *</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
            <option value="manager">Менеджер</option>
            <option value="master">Мастер</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-800 px-6 py-2.5 text-sm text-slate-400 hover:text-slate-100">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
