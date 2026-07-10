import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function generatePassword(length = 8): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any)?.role;
  const userId = (session.user as any)?.id;
  const { id } = await params;
  const { password, role, resetPassword } = await request.json();

  // Only SUPER_ADMIN can change roles and other users' passwords
  // Users can change their own password
  if (userRole !== "SUPER_ADMIN" && userId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Only SUPER_ADMIN can change roles or reset passwords
  if ((role || resetPassword) && userRole !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Only SUPER_ADMIN can do this" }, { status: 403 });
  }

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Can't change SUPER_ADMIN's role
  if (role && targetUser.role === "SUPER_ADMIN" && userRole !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Cannot change SUPER_ADMIN role" }, { status: 403 });
  }

  const updateData: Record<string, unknown> = {};

  // Password reset — generate random password
  if (resetPassword) {
    const newPassword = generatePassword();
    updateData.password = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: updateData });
    return NextResponse.json({
      ok: true,
      newPassword,
      warning: "Скопируйте пароль и передайте пользователю. Он больше не будет показан.",
    });
  }

  if (password) {
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    updateData.password = await bcrypt.hash(password, 10);
  }

  if (role && userRole === "SUPER_ADMIN") {
    updateData.role = role;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only SUPER_ADMIN can delete users
  if ((session.user as any)?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Can't delete yourself
  if ((session.user as any)?.id === id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  // Can't delete other SUPER_ADMINs
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (targetUser.role === "SUPER_ADMIN") {
    return NextResponse.json({ error: "Cannot delete SUPER_ADMIN" }, { status: 400 });
  }

  // Delete user's posts and user
  await prisma.post.deleteMany({ where: { authorId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
