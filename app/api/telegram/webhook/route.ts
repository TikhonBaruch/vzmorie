import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");
  if (secretHeader !== process.env.TELEGRAM_BOT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Handle callback queries (approve/reject buttons)
  if (body.callback_query) {
    const { data, message } = body.callback_query;
    const [action, postTitle] = data.split(":");

    if (action === "approve") {
      const post = await prisma.post.findFirst({ where: { title: postTitle } });
      if (post) {
        await prisma.post.update({
          where: { id: post.id },
          data: { status: "PUBLISHED", publishedAt: new Date() },
        });
        await sendTelegramMessage({
          chatId: message.chat.id,
          text: `✅ Публикация "${postTitle}" одобрена и опубликована.`,
        });
      }
    }

    if (action === "reject") {
      const post = await prisma.post.findFirst({ where: { title: postTitle } });
      if (post) {
        await prisma.post.update({
          where: { id: post.id },
          data: { status: "DRAFT" },
        });
        await sendTelegramMessage({
          chatId: message.chat.id,
          text: `❌ Публикация "${postTitle}" отклонена.`,
        });
      }
    }

    return NextResponse.json({ ok: true });
  }

  // Handle regular messages
  if (body.message) {
    const { chat, text, photo } = body.message;

    if (photo && text) {
      const latestPhoto = photo[photo.length - 1];
      const photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${latestPhoto.file_path}`;

      // Find or create user by telegramId
      const telegramId = chat.id.toString();
      let user = await prisma.user.findUnique({ where: { telegramId } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            telegramId,
            telegramName: chat.username || chat.first_name || "Telegram User",
            name: chat.first_name || "Telegram User",
            role: "USER",
          },
        });
      }

      await prisma.post.create({
        data: {
          title: text.split("\n")[0] || "Новый пост",
          slug: `post-${Date.now()}`,
          content: text,
          coverImage: photoUrl,
          type: "CATCH",
          status: "PENDING",
          authorId: user.id,
        },
      });

      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (adminChatId) {
        await sendTelegramMessage({
          chatId: adminChatId,
          text: `📝 Новая публикация от пользователя ${chat.first_name}:\n\n${text}`,
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
