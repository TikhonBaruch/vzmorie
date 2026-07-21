import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setWebhook, getWebhookInfo } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any)?.role;
  if (!["SUPER_ADMIN", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const info = await getWebhookInfo();
    return NextResponse.json({ webhookInfo: info.result || info });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get webhook info" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any)?.role;
  if (!["SUPER_ADMIN", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { url } = body;

    const result = await setWebhook(url);
    const info = await getWebhookInfo();

    return NextResponse.json({
      setWebhook: result,
      webhookInfo: info.result || info,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to set webhook" }, { status: 500 });
  }
}
