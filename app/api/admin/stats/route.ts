import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalPosts, pendingPosts, publishedPosts, totalUsers, totalComments, totalSubscribers] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PENDING" } }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count(),
      prisma.comment.count(),
      prisma.subscriber.count({ where: { active: true } }),
    ]);

  return NextResponse.json({
    totalPosts,
    pendingPosts,
    publishedPosts,
    totalUsers,
    totalComments,
    totalSubscribers,
  });
}
