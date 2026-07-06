import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage, sendMorningTemplate, notifyModeration } from "@/lib/telegram";

function parseMorningSummary(text: string): {
  isSummary: boolean;
  weather?: string;
  biting?: string;
  waterLevel?: string;
  waterClarity?: string;
  title?: string;
  content?: string;
} {
  const lower = text.toLowerCase();

  // Check if it's a morning summary (contains key markers)
  const hasWeather = lower.includes("погода:") || lower.includes("погода —");
  const hasBiting = lower.includes("клюёт:") || lower.includes("клюёт —") || lower.includes("что клюет:");
  const hasWater = lower.includes("уровень воды:") || lower.includes("уровень воды —");

  if (!hasWeather && !hasBiting && !hasWater) {
    return { isSummary: false };
  }

  // Parse fields
  const extract = (label: string): string | undefined => {
    const regex = new RegExp(`${label}[:\\s–—]+([^\\n]+)`, "i");
    const match = text.match(regex);
    return match?.[1]?.trim();
  };

  const weather = extract("погода");
  const biting = extract("клюёт") || extract("что клюет");
  const waterLevel = extract("уровень воды");
  const waterClarity = extract("чистота воды") || extract("видимость");

  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  const title = `Сводка на ${today}`;
  const content = [
    weather && `🌤 Погода: ${weather}`,
    biting && `🐟 Что клюёт: ${biting}`,
    waterLevel && `🌊 Уровень воды: ${waterLevel}`,
    waterClarity && `👁 Чистота воды: ${waterClarity}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    isSummary: true,
    weather,
    biting,
    waterLevel,
    waterClarity,
    title,
    content,
  };
}

export async function POST(req: Request) {
  const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");
  if (secretHeader !== process.env.TELEGRAM_BOT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Handle callback queries (approve/reject buttons)
  if (body.callback_query) {
    const { data, message } = body.callback_query;
    const colonIndex = data.indexOf(":");
    const action = colonIndex === -1 ? data : data.slice(0, colonIndex);
    const postTitle = colonIndex === -1 ? "" : data.slice(colonIndex + 1);

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
    const telegramId = chat.id.toString();

    // Ensure user exists
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

    // Command: /сводка — send morning template
    if (text && (text.startsWith("/сводка") || text.startsWith("/svodka"))) {
      await sendMorningTemplate(chat.id);
      return NextResponse.json({ ok: true });
    }

    // Photo + text = CATCH (trophy)
    if (photo && text) {
      const latestPhoto = photo[photo.length - 1];
      const photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${latestPhoto.file_path}`;

      const title = text.split("\n")[0].slice(0, 200) || "Новый улов";

      // Try to extract fish type and weight from text
      const fishMatch = text.match(/(жерех|сом|щука|окунь|лещ|налим|сазан|осётр|сиг|карп|карась)/i);
      const weightMatch = text.match(/(\d+[\.,]?\d*)\s*(кг|кг\.)/i);

      const post = await prisma.post.create({
        data: {
          title,
          slug: `catch-${Date.now()}`,
          content: text,
          coverImage: photoUrl,
          type: "CATCH",
          status: "PENDING",
          authorId: user.id,
          fishType: fishMatch?.[1] || null,
          weight: weightMatch ? parseFloat(weightMatch[1].replace(",", ".")) : null,
        },
      });

      // Notify admin with approve/reject buttons
      await notifyModeration({
        title: post.title,
        authorName: user.name || "Егерь",
      });

      // Confirm to sender
      await sendTelegramMessage({
        chatId: chat.id,
        text: `📸 Улов принят!\n\n<b>${title}</b>\nОжидает модерации.`,
      });

      return NextResponse.json({ ok: true });
    }

    // Text only — check if it's a morning summary
    if (text && !photo) {
      const summary = parseMorningSummary(text);

      if (summary.isSummary && summary.title && summary.content) {
        // Create WEATHER post (auto-publish for morning summaries)
        const post = await prisma.post.create({
          data: {
            title: summary.title,
            slug: `weather-${Date.now()}`,
            content: summary.content,
            type: "WEATHER",
            status: "PUBLISHED",
            publishedAt: new Date(),
            authorId: user.id,
          },
        });

        // Confirm to sender
        await sendTelegramMessage({
          chatId: chat.id,
          text: `✅ Сводка опубликована!\n\n<b>${summary.title}</b>`,
        });

        return NextResponse.json({ ok: true });
      }

      // Regular text message — create as NEWS with PENDING status
      if (text.length > 10) {
        const title = text.split("\n")[0].slice(0, 200) || "Новая запись";

        await prisma.post.create({
          data: {
            title,
            slug: `post-${Date.now()}`,
            content: text,
            type: "NEWS",
            status: "PENDING",
            authorId: user.id,
          },
        });

        await notifyModeration({
          title,
          authorName: user.name || "Егерь",
        });

        await sendTelegramMessage({
          chatId: chat.id,
          text: `📝 Принято! Ожидает модерации.`,
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
