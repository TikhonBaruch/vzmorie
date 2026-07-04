"use client";

import { useEffect } from "react";
import { PostForm } from "@/components/telegram/PostForm";

export default function MiniAppPage() {
  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-100">
            Новая публикация
          </h1>
          <button
            onClick={() => {
              if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
                (window as any).Telegram.WebApp.close();
              }
            }}
            className="rounded-xl bg-slate-800 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
          >
            Закрыть
          </button>
        </div>

        {/* Post form */}
        <PostForm />
      </div>
    </div>
  );
}
