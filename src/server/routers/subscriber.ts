import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { Resend } from "resend";

let resend: Resend;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export const subscriberRouter = router({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = crypto.randomUUID();

      const subscriber = await ctx.prisma.subscriber.upsert({
        where: { email: input.email },
        create: {
          email: input.email,
          name: input.name,
          token,
        },
        update: {
          active: true,
          name: input.name,
        },
      });

      // Send welcome email
      try {
        await getResend().emails.send({
          from: "Взморье <noreply@vzmorie.ru>",
          to: input.email,
          subject: "Добро пожаловать на Взморье!",
          html: `
            <h1>Добро пожаловать!</h1>
            <p>Вы подписались на рассылку рыболовно-охотничьей базы "Взморье".</p>
            <p>Мы будем присылать вам:</p>
            <ul>
              <li>Вести с воды</li>
              <li>Прогнозы погоды</li>
              <li>Акции и события</li>
            </ul>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${token}">Отписаться</a></p>
          `,
        });
      } catch (e) {
        console.error("Email send error:", e);
      }

      return subscriber;
    }),

  unsubscribe: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.subscriber.update({
        where: { token: input.token },
        data: { active: false },
      });
      return { success: true };
    }),

  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  sendBlast: adminProcedure
    .input(
      z.object({
        subject: z.string(),
        html: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscribers = await ctx.prisma.subscriber.findMany({
        where: { active: true },
      });

      const emails = subscribers.map((s) =>
        getResend().emails.send({
          from: "Взморье <noreply@vzmorie.ru>",
          to: s.email,
          subject: input.subject,
          html: input.html,
        })
      );

      await Promise.allSettled(emails);

      return { sent: subscribers.length };
    }),
});
