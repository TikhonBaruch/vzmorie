import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendTelegramMessage,
  sendMorningTemplate,
  notifyModeration,
  notifyPublished,
  answerCallbackQuery,
} from "@/lib/telegram";

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

  const hasWeather = lower.includes("погода:") || lower.includes("погода —");
  const hasBiting = lower.includes("клюёт:") || lower.includes("клюёт —") || lower.includes("что клюет:");
  const hasWater = lower.includes("уровень воды:") || lower.includes("уровень воды —");

  if (!hasWeather && !hasBiting && !hasWater) {
    return { isSummary: false };
  }

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
    const { data, message, id: callbackQueryId } = body.callback_query;

    // Verify callback comes from admin chat
    if (message?.chat?.id?.toString() !== process.env.TELEGRAM_ADMIN_CHAT_ID) {
      await answerCallbackQuery(callbackQueryId, "Нет доступа");
      return NextResponse.json({ ok: true });
    }

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

        await answerCallbackQuery(callbackQueryId, "Одобрено");

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
        await notifyPublished(post.title, `${siteUrl}/posts/${post.slug}`);

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

        await answerCallbackQuery(callbackQueryId, "Отклонено");

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

    // Command: /start
    if (text && text.startsWith("/start")) {
      await sendTelegramMessage({
        chatId: chat.id,
        text: `🐟 <b>Добро пожаловать в Взморье!</b>\n\n` +
          `Отправьте текст или фото для создания публикации.\n\n` +
          `Используйте #хештеги для автоматических тегов.\n` +
          `#портфолио — добавить в портфолио.\n\n` +
          `Команды:\n` +
          `/help — справка\n` +
          `/my — мои публикации\n` +
          `/stats — статистика`,
      });
      return NextResponse.json({ ok: true });
    }

    // Command: /help
    if (text && text.startsWith("/help")) {
      await sendTelegramMessage({
        chatId: chat.id,
        text: `📖 <b>Справка</b>\n\n` +
          `Отправьте текст — создастся пост на модерацию.\n` +
          `Отправьте фото с текстом — создастся пост типа "Улов".\n\n` +
          `#хештеги — автоматические теги\n` +
          `#портфолио — добавить в портфолио\n\n` +
          `/my — ваши публикации\n` +
          `/stats — статистика\n` +
          `/delete [id] — удалить пост\n` +
          `/status [id] — статус поста`,
      });
      return NextResponse.json({ ok: true });
    }

    // Command: /my
    if (text && text.startsWith("/my")) {
      const posts = await prisma.post.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, status: true, createdAt: true },
      });

      if (posts.length === 0) {
        await sendTelegramMessage({ chatId: chat.id, text: "У вас нет публикаций." });
      } else {
        const list = posts.map((p, i) =>
          `${i + 1}. ${p.title} [${p.status}] — ${p.createdAt.toLocaleDateString("ru-RU")}`
        ).join("\n");
        await sendTelegramMessage({ chatId: chat.id, text: `📋 <b>Ваши публикации:</b>\n\n${list}` });
      }
      return NextResponse.json({ ok: true });
    }

    // Command: /stats
    if (text && text.startsWith("/stats")) {
      const [total, published, pending] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { status: "PUBLISHED" } }),
        prisma.post.count({ where: { status: "PENDING" } }),
      ]);

      await sendTelegramMessage({
        chatId: chat.id,
        text: `📊 <b>Статистика</b>\n\n` +
          `Всего постов: ${total}\n` +
          `Опубликовано: ${published}\n` +
          `На модерации: ${pending}`,
      });
      return NextResponse.json({ ok: true });
    }

    // Command: /delete [id]
    if (text && text.startsWith("/delete")) {
      const parts = text.split(" ");
      if (parts.length < 2) {
        await sendTelegramMessage({ chatId: chat.id, text: "Использование: /delete [id поста]" });
        return NextResponse.json({ ok: true });
      }

      const postId = parts[1];
      const post = await prisma.post.findFirst({
        where: { id: postId, authorId: user.id },
      });

      if (!post) {
        await sendTelegramMessage({ chatId: chat.id, text: "Пост не найден или нет доступа." });
        return NextResponse.json({ ok: true });
      }

      if (post.status === "PUBLISHED") {
        await sendTelegramMessage({ chatId: chat.id, text: "Нельзя удалить опубликованный пост." });
        return NextResponse.json({ ok: true });
      }

      await prisma.post.delete({ where: { id: postId } });
      await sendTelegramMessage({ chatId: chat.id, text: `🗑 Пост "${post.title}" удалён.` });
      return NextResponse.json({ ok: true });
    }

    // Command: /status [id]
    if (text && text.startsWith("/status")) {
      const parts = text.split(" ");
      if (parts.length < 2) {
        await sendTelegramMessage({ chatId: chat.id, text: "Использование: /status [id поста]" });
        return NextResponse.json({ ok: true });
      }

      const postId = parts[1];
      const post = await prisma.post.findFirst({
        where: { id: postId, authorId: user.id },
        select: { id: true, title: true, status: true, publishedAt: true },
      });

      if (!post) {
        await sendTelegramMessage({ chatId: chat.id, text: "Пост не найден или нет доступа." });
        return NextResponse.json({ ok: true });
      }

      const statusText = post.status === "PUBLISHED" ? "Опубликован" :
        post.status === "PENDING" ? "На модерации" :
        post.status === "DRAFT" ? "Черновик" : post.status;

      await sendTelegramMessage({
        chatId: chat.id,
        text: `📋 <b>${post.title}</b>\nСтатус: ${statusText}` +
          (post.publishedAt ? `\nОпубликован: ${post.publishedAt.toLocaleDateString("ru-RU")}` : ""),
      });
      return NextResponse.json({ ok: true });
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

      // Extract hashtags
      const hashtags = text.match(/#\w+/g) || [];
      const isFeatured = hashtags.some((h: string) => h.toLowerCase() === "#портфолио");

      const title = text.split("\n")[0].replace(/#\w+/g, "").trim().slice(0, 200) || "Новый улов";

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

      // Create tags from hashtags
      for (const tag of hashtags) {
        const tagName = tag.slice(1);
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-");
        const existingTag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
        await prisma.post.update({
          where: { id: post.id },
          data: { tags: { connect: { id: existingTag.id } } },
        });
      }

      await notifyModeration({
        title: post.title,
        authorName: user.name || "Егерь",
      });

      await sendTelegramMessage({
        chatId: chat.id,
        text: `📸 Улов принят!\n\n<b>${title}</b>\nОжидает модерации.` +
          (isFeatured ? "\n⭐ Добавлено в портфолио" : ""),
      });

      return NextResponse.json({ ok: true });
    }

    // Text only — check if it's a morning summary
    if (text && !photo) {
      const summary = parseMorningSummary(text);

      if (summary.isSummary && summary.title && summary.content) {
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

        await sendTelegramMessage({
          chatId: chat.id,
          text: `✅ Сводка опубликована!\n\n<b>${summary.title}</b>`,
        });

        return NextResponse.json({ ok: true });
      }

      // Regular text message — create as NEWS with PENDING status
      if (text.length > 10) {
        const hashtags = text.match(/#\w+/g) || [];
        const isFeatured = hashtags.some((h: string) => h.toLowerCase() === "#портфолио");
        const title = text.split("\n")[0].replace(/#\w+/g, "").trim().slice(0, 200) || "Новая запись";

        const post = await prisma.post.create({
          data: {
            title,
            slug: `post-${Date.now()}`,
            content: text,
            type: "NEWS",
            status: "PENDING",
            authorId: user.id,
          },
        });

        // Create tags from hashtags
        for (const tag of hashtags) {
          const tagName = tag.slice(1);
          const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-");
          const existingTag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { name: tagName, slug: tagSlug },
          });
          await prisma.post.update({
            where: { id: post.id },
            data: { tags: { connect: { id: existingTag.id } } },
          });
        }

        await notifyModeration({
          title,
          authorName: user.name || "Егерь",
        });

        await sendTelegramMessage({
          chatId: chat.id,
          text: `📝 Принято! Ожидает модерации.` +
            (isFeatured ? "\n⭐ Добавлено в портфолио" : ""),
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
