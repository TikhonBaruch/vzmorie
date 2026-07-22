import { PrismaClient, PostType, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

const SITE_IMAGES = [
  "https://picsum.photos/seed/vzmorie1/1200/630",
  "https://picsum.photos/seed/vzmorie2/1200/630",
  "https://picsum.photos/seed/vzmorie3/1200/630",
  "https://picsum.photos/seed/vzmorie4/1200/630",
  "https://picsum.photos/seed/vzmorie5/1200/630",
];

const testPosts = [
  {
    title: "Трофейный сом — 12 кг на Кулагинской отмели",
    slug: "trofejnyj-som-12kg",
    content: "Сегодня утром на Кулагинской отмели пойман трофейный сом весом 12 кг. Клюёт на live-рыбку с глубины 3 метра. Вода прогрелась до +22, клёв отличный. Рекомендуем попробовать жерлицы — сом активен до обеда.",
    excerpt: "Трофейный сом 12 кг на Кулагинской отмели. Отличный клёв на live-рыбку.",
    type: PostType.CATCH,
    fishType: "Сом",
    weight: 12,
    location: "Кулагинская отмель",
    coverImage: SITE_IMAGES[0],
    metaTitle: "Трофейный сом 12 кг — рыбалка на Кулагинской отмели Каспия",
    metaDescription: "Пойман трофейный сом весом 12 кг на Кулагинской отмели. Активный клёв на live-рыбку. Фото и подробности.",
  },
  {
    title: "Погода на tuần: +28 днём, штиль, вода +22",
    slug: "pogoda-tyazhden-28",
    content: "Прогноз на неделю: температура воздуха +25..+28, ветер слабый 1-2 м/с, штиль. Вода прогрелась до +22 градусов. Клёв рыбы ожидается отличный. Рекомендуем рыбалку на заре и в сумерках.",
    excerpt: "Погода на неделю: тепло, штиль, вода прогрелась. Отличные условия для рыбалки.",
    type: PostType.WEATHER,
    coverImage: SITE_IMAGES[1],
    metaTitle: "Погода на Кулагинской отмели — прогноз на неделю",
    metaDescription: "Температура воздуха +28, вода +22, штиль. Идеальные условия для трофейной рыбалки на Каспии.",
  },
  {
    title: "Новые тарифы на сезон 2026",
    slug: "novye-tarify-2026",
    content: "Обновлённые тарифы на сезон 2026:\n\n• «Рыбалка дня» — 5 000 ₽ (снасти + гид + обед)\n• «Трофейный выход» — 8 000 ₽ (полная экипировка + гид + фотоотчёт)\n• «Группа до 6 чел.» — 35 000 ₽ (включает трансфер от Астрахани)\n\nБронирование по телефону или через Telegram-бот.",
    excerpt: "Обновлённые тарифы на сезон 2026. Скидки для групп и раннего бронирования.",
    type: PostType.PROMO,
    coverImage: SITE_IMAGES[2],
    metaTitle: "Тарифы рыбалки 2026 — Взморье, Кулагинская отмель",
    metaDescription: "Тарифы на трофейную рыбалку на Каспии от 5 000 ₽. Группы, раннее бронирование, скидки.",
  },
  {
    title: "Уровень воды стабилен — 1.2 м на фарватере",
    slug: "uroven-vody-stabilen",
    content: "Уровень воды на Кулагинской отмели стабилен — 1.2 метра на фарватере. Прозрачность воды 0.8 м. Рыба активна в придонном горизонте. Рекомендуем донные снасти и жерлицы.",
    excerpt: "Уровень воды стабилен, прозрачность хорошая. Рыба на дне.",
    type: PostType.WATER_LEVEL,
    coverImage: SITE_IMAGES[3],
    metaTitle: "Уровень воды на Кулагинской отмели — актуальные данные",
    metaDescription: "Уровень воды 1.2 м, прозрачность 0.8 м. Актуальные данные для рыбалки на Каспии.",
  },
  {
    title: "Фотоотчёт: весенняя рыбалка на судака",
    slug: "fotootchet-sudak",
    content: "Весенний фотоотчёт с рыбалки на судака. За два дня поймано 18 судаков, средний вес 1.5 кг, максимальный 3.2 кг. Использовали воблеры Deep-X на глубине 4-6 метров. Судак активен на рассвете.",
    excerpt: "Фотоотчёт: 18 судаков за два дня. Средний вес 1.5 кг.",
    type: PostType.NEWS,
    coverImage: SITE_IMAGES[4],
    metaTitle: "Фотоотчёт весенняя рыбалка на судака — Взморье",
    metaDescription: "18 судаков за два дня на Кулагинской отмели. Фото, снасти, тактика ловли.",
  },
];

async function main() {
  console.log("Seeding vzmorie test posts...");

  // Find or create admin user
  let admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: "admin@vzmorie.ru",
        name: "Admin",
        role: "ADMIN",
      },
    });
  }

  for (const postData of testPosts) {
    const existing = await prisma.post.findUnique({ where: { slug: postData.slug } });
    if (existing) {
      console.log(`  SKIP: ${postData.slug} (already exists)`);
      continue;
    }

    await prisma.post.create({
      data: {
        ...postData,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: admin.id,
      },
    });
    console.log(`  CREATED: ${postData.slug}`);
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
