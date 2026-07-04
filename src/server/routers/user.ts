import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";

export const userRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) return null;

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        telegramId: true,
        telegramName: true,
        _count: { select: { posts: true } },
      },
    });

    return user;
  }),

  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        telegramId: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum(["USER", "MODERATOR", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: { role: input.role },
      });
    }),
});
