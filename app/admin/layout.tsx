"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, FileText, Package, Image, Cloud, DollarSign, Calendar, Type, Users, MessageSquare, LogOut, Menu, X, Star, Bot, Shield, Settings, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

const allSidebar = [
  { label: "Дашборд", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Чат", href: "/admin/chat", icon: MessageSquare },
  { label: "Hero блок", href: "/admin/hero", icon: Type, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Публикации", href: "/admin/posts", icon: FileText, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Отзывы", href: "/admin/reviews", icon: Star, roles: ["ADMIN", "EDITOR", "SUPER_ADMIN"] },
  { label: "Заявки", href: "/admin/bookings", icon: Calendar, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Условия", href: "/admin/conditions", icon: Cloud, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Тарифы", href: "/admin/tariffs", icon: DollarSign, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Даты заезда", href: "/admin/dates", icon: Calendar, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Номера", href: "/admin/products", icon: Package, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Фото сайта", href: "/admin/images", icon: Image, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Галерея", href: "/admin/gallery", icon: ImageIcon, roles: ["ADMIN", "EDITOR", "SUPER_ADMIN"] },
  { label: "Настройки главной", href: "/admin/settings", icon: Settings, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Telegram", href: "/admin/telegram", icon: Bot, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Пользователи", href: "/admin/users", icon: Users, roles: ["SUPER_ADMIN"] },
  { label: "Аудит", href: "/admin/audit", icon: Shield, roles: ["SUPER_ADMIN"] },
];

// Pages that SPECIALIST is allowed to access
const SPECIALIST_ALLOWED = ["/admin/chat"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [restrictedMode, setRestrictedMode] = useState(false);

  const userRole = (session?.user as any)?.role;
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isSpecialist = userRole === "SPECIALIST";
  const isRestricted = restrictedMode && userRole !== "SUPER_ADMIN";
  const sidebar = isRestricted
    ? allSidebar.filter((item) => item.href === "/admin/chat" || item.href === "/admin")
    : allSidebar.filter((item) => !item.roles || item.roles.includes(userRole));

  useEffect(() => {
    fetch("/api/admin/settings/restricted-mode?t=" + Date.now())
      .then((r) => r.json())
      .then((d) => setRestrictedMode(d.enabled))
      .catch(() => {});
  }, []);

  // Redirect away from restricted pages
  useEffect(() => {
    const blocked = isSpecialist || isRestricted;
    if (blocked && !["/admin", "/admin/chat", "/admin/login"].includes(pathname)) {
      router.replace("/admin/chat");
    }
  }, [isSpecialist, isRestricted, pathname, router]);

  // Specialist/restricted: horizontal top bar layout (mobile-optimized)
  if (isSpecialist || isRestricted) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950">
        {/* Top bar */}
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/admin/chat" className="font-brutal text-lg font-semibold text-slate-100">
              VZMORIE
            </Link>

            {/* Desktop nav — only Chat visible */}
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/admin/chat"
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-50"
              >
                <MessageSquare className="h-4 w-4" />
                Чат
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-slate-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile dropdown nav */}
          {mobileMenuOpen && (
            <nav className="border-t border-slate-800 bg-slate-900 px-4 py-2 md:hidden">
              <Link
                href="/admin/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2.5 text-sm text-slate-50"
              >
                <MessageSquare className="h-4 w-4" />
                Чат
              </Link>
              <div className="mt-2 border-t border-slate-800 pt-2">
                <div className="px-3 py-1 text-xs text-slate-500">
                  {session?.user?.email}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </div>
            </nav>
          )}
        </header>

        {/* Critical error notification for restricted mode */}
        {isRestricted && (
          <div className="bg-red-900/50 border-b border-red-800 px-4 py-3 text-center">
            <p className="text-sm font-medium text-red-200">Критическая ошибка. Обратитесь к разработчику.</p>
          </div>
        )}

        {/* Main content — full width, no sidebar offset */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    );
  }

  // Admin/Editor/SuperAdmin: original sidebar layout
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
          <span className="font-brutal text-lg font-semibold text-slate-100">
            VZMORIE
          </span>
          <span className="text-xs text-slate-400">Admin</span>
          {isSuperAdmin && (
            <span className="ml-auto rounded bg-amber-900/50 px-1.5 py-0.5 text-xs text-amber-300">SUPER</span>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-4">
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
        {session?.user && (
          <div className="border-t border-slate-800 p-4">
            <div className="mb-3 text-sm text-slate-400">
              {session.user.email}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
