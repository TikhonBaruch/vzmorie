import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tariffs = await prisma.product.findMany({
      where: { category: "tariff", inStock: true },
      orderBy: { sort: "asc" },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        featured: true,
        sort: true,
      },
    });

    const mapped = tariffs.map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price.toLocaleString("ru-RU"),
      description: t.description?.split("\n")[0] || null,
      features: t.description ? t.description.split("\n").filter(Boolean) : [],
      popular: t.featured,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
