import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultDates = {
  dates: [
    {
      id: "aug-15",
      date: "2026-08-15",
      spots: 4,
      status: "available",
      title: "Выход 1",
    },
    {
      id: "aug-22",
      date: "2026-08-22",
      spots: 2,
      status: "available",
      title: "Выход 2",
    },
    {
      id: "aug-29",
      date: "2026-08-29",
      spots: 0,
      status: "booked",
      title: "Выход 3",
    },
    {
      id: "sep-05",
      date: "2026-09-05",
      spots: 3,
      status: "available",
      title: "Выход 4",
    },
    {
      id: "sep-12",
      date: "2026-09-12",
      spots: 1,
      status: "limited",
      title: "Выход 5",
    },
  ],
  visible: true,
};

async function main() {
  console.log("Restoring dates data for vzmorie...");

  const existing = await prisma.siteSetting.findUnique({ where: { key: "dates" } });

  if (existing) {
    const value = existing.value as any;
    if (value?.dates && value.dates.length > 0) {
      console.log("Dates data already exists, skipping.");
      return;
    }
  }

  await prisma.siteSetting.upsert({
    where: { key: "dates" },
    update: { value: defaultDates },
    create: { key: "dates", value: defaultDates },
  });

  console.log("Dates data restored successfully!");
  console.log(`  - ${defaultDates.dates.length} dates created`);
  console.log(`  - Visible: ${defaultDates.visible}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
