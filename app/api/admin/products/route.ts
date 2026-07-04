import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, any> = {};
  if (category && category !== "all") where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, oldPrice, category, image, inStock, featured, sort } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Name, price, category required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9а-яё-]/gi, "")
      .slice(0, 100);

    const slugUnique = `${slug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slugUnique,
        description,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        category,
        image,
        inStock: inStock !== false,
        featured: featured === true,
        sort: sort ? parseInt(sort) || 0 : 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
