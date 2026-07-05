import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  // Check webhook status
  let webhookInfo = null;
  if (token) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
      const data = await res.json();
      webhookInfo = data.result;
    } catch (e) {
      webhookInfo = { error: "Failed to fetch" };
    }
  }

  // Check recent posts
  const recentPosts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      createdAt: true,
    },
  });

  // Check users with telegramId
  const telegramUsers = await prisma.user.findMany({
    where: { telegramId: { not: null } },
    select: {
      id: true,
      name: true,
      telegramId: true,
    },
  });

  return NextResponse.json({
    webhook: webhookInfo,
    recentPosts,
    telegramUsers,
    env: {
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasSecret: !!process.env.TELEGRAM_BOT_SECRET,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });
}
