import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";

export const tagRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    });
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.tag.findUnique({
        where: { slug: input.slug },
        include: {
          posts: {
            where: { status: "PUBLISHED" },
            include: {
              author: { select: { id: true, name: true, image: true } },
              tags: true,
              media: true,
            },
            orderBy: { publishedAt: "desc" },
            take: 20,
          },
        },
      });
    }),

  create: adminProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const slug = input.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9а-я-]/gi, "");

      return ctx.prisma.tag.create({
        data: { name: input.name, slug },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.tag.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
