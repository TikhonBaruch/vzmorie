import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PostType, PostStatus } from "@prisma/client";

export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({
        type: z.nativeEnum(PostType).optional(),
        status: z.nativeEnum(PostStatus).optional(),
        tag: z.string().optional(),
        limit: z.number().min(1).max(50).default(12),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { type, status, tag, limit, cursor } = input;

      const where: any = {
        status: status || PostStatus.PUBLISHED,
      };

      if (type) where.type = type;
      if (tag) {
        where.tags = { some: { slug: tag } };
      }

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        include: {
          author: { select: { id: true, name: true, image: true } },
          tags: true,
          media: true,
          _count: { select: { comments: true } },
        },
        orderBy: { publishedAt: "desc" },
      });

      let nextCursor: typeof cursor = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return { posts, nextCursor };
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { slug: input.slug },
        include: {
          author: { select: { id: true, name: true, image: true } },
          tags: true,
          media: true,
          comments: {
            include: {
              author: { select: { id: true, name: true, image: true } },
              replies: {
                include: {
                  author: { select: { id: true, name: true, image: true } },
                },
              },
            },
            where: { parentId: null },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      return post;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        type: z.nativeEnum(PostType).default(PostType.CATCH),
        tags: z.array(z.string()).default([]),
        location: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        fishType: z.string().optional(),
        weight: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tags, ...postData } = input;

      // Create or connect tags
      const tagRecords = await Promise.all(
        tags.map(async (tagName) => {
          const slug = tagName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9а-я-]/gi, "");
          return ctx.prisma.tag.upsert({
            where: { slug },
            create: { name: tagName, slug },
            update: {},
          });
        })
      );

      const post = await ctx.prisma.post.create({
        data: {
          ...postData,
          authorId: ctx.session.user.id,
          status: PostStatus.PENDING,
          tags: {
            connect: tagRecords.map((t) => ({ id: t.id })),
          },
        },
        include: { tags: true },
      });

      return post;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        status: z.nativeEnum(PostStatus).optional(),
        type: z.nativeEnum(PostType).optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tags, ...data } = input;

      if (tags) {
        const tagRecords = await Promise.all(
          tags.map(async (tagName) => {
            const slug = tagName
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9а-я-]/gi, "");
            return ctx.prisma.tag.upsert({
              where: { slug },
              create: { name: tagName, slug },
              update: {},
            });
          })
        );

        await ctx.prisma.post.update({
          where: { id },
          data: {
            ...data,
            tags: { set: tagRecords.map((t) => ({ id: t.id })) },
          },
        });
      } else {
        await ctx.prisma.post.update({ where: { id }, data });
      }

      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.delete({ where: { id: input.id } });
      return { success: true };
    }),

  approve: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.update({
        where: { id: input.id },
        data: {
          status: PostStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });

      // TODO: Send Telegram notification
      // TODO: Send email to subscribers

      return post;
    }),

  reject: adminProcedure
    .input(z.object({ id: z.string(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: { id: input.id },
        data: { status: PostStatus.DRAFT },
      });
    }),
});
