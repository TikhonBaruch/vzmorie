import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalPosts, pendingPosts, publishedPosts, totalUsers, totalComments, totalSubscribers, totalReviews, totalBookings, pendingBookings] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PENDING" } }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count(),
      prisma.comment.count(),
      prisma.subscriber.count({ where: { active: true } }),
      prisma.review.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "NEW" } }),
    ]);

  return NextResponse.json({
    totalPosts,
    pendingPosts,
    publishedPosts,
    totalUsers,
    totalComments,
    totalSubscribers,
    totalReviews,
    totalBookings,
    pendingBookings,
  });
}
