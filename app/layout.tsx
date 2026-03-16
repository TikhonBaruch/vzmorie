import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Взморье — рыболовно-охотничья база",
  description: "Премиальная база-гибрид на Кулагинском банке"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="min-h-dvh bg-tactical-radial">
          <div className="min-h-dvh">{children}</div>
        </div>
      </body>
    </html>
  );
}

