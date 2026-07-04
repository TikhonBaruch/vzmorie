import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  const body = await req.json();

  // Handle callback queries (approve/reject buttons)
  if (body.callback_query) {
    const { data, message } = body.callback_query;
    const [action, postId] = data.split(":");

    if (action === "approve") {
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      await sendTelegramMessage({
        chatId: message.chat.id,
        text: `✅ Публикация "${postId}" одобрена и опубликована.`,
      });
    }

    if (action === "reject") {
      await prisma.post.update({
        where: { id: postId },
        data: { status: "DRAFT" },
      });

      await sendTelegramMessage({
        chatId: message.chat.id,
        text: `❌ Публикация "${postId}" отклонена.`,
      });
    }

    return NextResponse.json({ ok: true });
  }

  // Handle regular messages (Telegram Mini App sends data here)
  if (body.message) {
    const { chat, text, photo } = body.message;

    // If message contains photo + text, it's a post submission
    if (photo && text) {
      // Create post from Telegram message
      const latestPhoto = photo[photo.length - 1];
      const photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${latestPhoto.file_path}`;

      const post = await prisma.post.create({
        data: {
          title: text.split("\n")[0] || "Новый пост",
          slug: `post-${Date.now()}`,
          content: text,
          coverImage: photoUrl,
          type: "CATCH",
          status: "PENDING",
          authorId: chat.id.toString(),
        },
      });

      // Notify admin
      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (adminChatId) {
        await sendTelegramMessage({
          chatId: adminChatId,
          text: `📝 Новая публикация от пользователя ${chat.id}:\n\n${text}`,
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
