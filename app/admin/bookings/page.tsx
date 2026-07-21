"use client";

import { useEffect, useState } from "react";
import { Phone, User, MessageSquare, Clock } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  phone: string;
  service: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: "Новая", color: "text-yellow-400 bg-yellow-900/30" },
  PROCESSING: { label: "В обработке", color: "text-blue-400 bg-blue-900/30" },
  DONE: { label: "Выполнена", color: "text-green-400 bg-green-900/30" },
  CANCELLED: { label: "Отменена", color: "text-red-400 bg-red-900/30" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bookings", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBookings(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
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
      <h1 className="mb-8 text-2xl font-bold text-slate-100">Заявки на запись</h1>

      {bookings.length === 0 ? (
        <p className="text-slate-400">Нет заявок</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-100">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{booking.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${STATUS_LABELS[booking.status]?.color || "text-slate-400"}`}
                    >
                      {STATUS_LABELS[booking.status]?.label || booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Phone className="h-3.5 w-3.5" />
                    <a href={`tel:${booking.phone}`} className="hover:text-white">
                      {booking.phone}
                    </a>
                  </div>
                  {booking.service && (
                    <div className="text-sm text-slate-400">
                      Услуга: {booking.service}
                    </div>
                  )}
                  {booking.message && (
                    <div className="flex items-start gap-2 text-sm text-slate-400">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{booking.message}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {new Date(booking.createdAt).toLocaleString("ru-RU")}
                  </div>
                </div>

                <div className="flex gap-2">
                  {booking.status === "NEW" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking.id, "PROCESSING")}
                        className="rounded-lg bg-blue-900/30 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-900/50"
                      >
                        В обработку
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                        className="rounded-lg bg-red-900/30 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/50"
                      >
                        Отменить
                      </button>
                    </>
                  )}
                  {booking.status === "PROCESSING" && (
                    <button
                      onClick={() => handleStatusChange(booking.id, "DONE")}
                      className="rounded-lg bg-green-900/30 px-3 py-1.5 text-sm text-green-400 hover:bg-green-900/50"
                    >
                      Выполнена
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
