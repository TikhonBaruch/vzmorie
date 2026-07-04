import { PrismaClient, PostType, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create tags
  const tags = [
    { name: "Жерех", slug: "zherekh" },
    { name: "Сом", slug: "som" },
    { name: "Щука", slug: "shchuka" },
    { name: "Окунь", slug: "okun" },
    { name: "Лещ", slug: "leshch" },
    { name: "Налим", slug: "nalim" },
    { name: "Подводная охота", slug: "podvodnaya-ohota" },
    { name: "Спиннинг", slug: "spinning" },
    { name: "Поплавок", slug: "poplavok" },
    { name: "Кулагинский банк", slug: "kulaginskiy-bank" },
    { name: "Погода", slug: "pogoda" },
    { name: "Уровень воды", slug: "uroven-vody" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      create: tag,
      update: {},
    });
  }

  console.log("Tags seeded:", tags.length);

  // Create sample admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@vzmorie.ru" },
    create: {
      email: "admin@vzmorie.ru",
      name: "Администратор",
      role: "ADMIN",
      emailVerified: new Date(),
    },
    update: {},
  });

  console.log("Admin user created:", adminUser.email);

  // Create sample posts
  const samplePosts = [
    {
      title: "Жерех на 4 кг на струе",
      slug: "zherekh-4kg-na-strue",
      content:
        "Сегодня утром взяли жереха на 4 кг на струе у правого берега. Работали на воблер 11см, проводка рывками. Погода была пасмурная, ветер юго-западный 3-5 м/с. Уровень воды стабильный.",
      type: PostType.CATCH,
      status: PostStatus.PUBLISHED,
      authorId: adminUser.id,
      location: "Кулагинский банк, правый берег",
      fishType: "Жерех",
      weight: 4.0,
      publishedAt: new Date(),
    },
    {
      title: "Прогноз на выходные",
      slug: "prognoz-na-vyhodnye",
      content:
        "На выходные обещают потепление до +18°C, ветер слабый. Уровень воды продолжает падать. Идеальные условия для рыбалки!",
      type: PostType.WEATHER,
      status: PostStatus.PUBLISHED,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
    {
      title: "Сезон подводной охоты открыт",
      slug: "sezon-podvodnoy-ohoty-otkryt",
      content:
        "Официально открыт сезон подводной охоты! Видимость на банке 2.5-3 метра. Прозраки уже начали мигрировать. Ждём охотников!",
      type: PostType.NEWS,
      status: PostStatus.PUBLISHED,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  ];

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      create: post,
      update: {},
    });
  }

  console.log("Sample posts created:", samplePosts.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
