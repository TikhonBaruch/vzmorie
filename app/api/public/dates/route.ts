import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "dates" } });

    if (!setting) {
      return NextResponse.json({ visible: false, dates: [] });
    }

    return NextResponse.json(setting.value);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
