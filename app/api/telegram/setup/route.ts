import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_BOT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!token || !secret || !siteUrl) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  const webhookUrl = `${siteUrl}/api/telegram/webhook`;

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["message", "callback_query"],
    }),
  });

  const result = await response.json();

  // Also check current status
  const infoResponse = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const info = await infoResponse.json();

  return NextResponse.json({
    setWebhook: result,
    webhookInfo: info.result,
  });
}
