"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Mail, Settings } from "lucide-react";

const sidebar = [
  { label: "Дашборд", href: "/admin", icon: LayoutDashboard },
  { label: "Публикации", href: "/admin/posts", icon: FileText },
  { label: "Пользователи", href: "/admin/users", icon: Users },
  { label: "Рассылки", href: "/admin/subscribers", icon: Mail },
  { label: "Настройки", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
          <span className="font-brutal text-lg font-semibold text-slate-100">
            VZMORIE
          </span>
          <span className="text-xs text-slate-400">Admin</span>
        </div>
        <nav className="space-y-1 p-4">
          {sidebar.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
