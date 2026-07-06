import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "hero" } });

    if (!setting) {
      return NextResponse.json(getDefaults());
    }

    return NextResponse.json(setting.value);
  } catch (error) {
    return NextResponse.json(getDefaults());
  }
}

function getDefaults() {
  return {
    badge: "Кулагинский банк / Астраханская область",
    title: "ЖИВИ НА ВОДЕ. ОТДЫХАЙ НА ЗЕМЛЕ.",
    subtitle: "Трофейная рыбалка и подводная охота в 5 минутах от базы. 90 км от Астрахани.",
    ctaPrimary: "Узнать даты и места",
    ctaSecondary: "Смотреть тарифы",
    infoLeft: "Кулагинский банк",
    infoRight: "5 минут до воды",
    tileDivingTitle: "Сезон ПО открыт",
    tileDivingSubtitle: "Для подвохов",
    tileOrganizerTitle: "Едете компанией?",
    tileOrganizerSubtitle: "Для организатора",
    tileOrganizerText: "Пакеты «всё включено» с баней, отдыхом и логистикой.",
    tileTrophyTitle: "Трофеи банка",
    tileTrophySubtitle: "Для трофейщика",
    tileTrophyText: "Ямы и перекаты рядом — работаем по точкам быстро.",
    tileLiveTitle: "Вести с воды",
    tileLiveSubtitle: "Live-статус",
  };
}
