import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        // Check if user has a password set
        if (!user.password) {
          // Fallback: check env vars for legacy admin
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (
            credentials.email === adminEmail &&
            credentials.password === adminPassword &&
            (user.role === "ADMIN" || user.role === "SUPER_ADMIN")
          ) {
            // Auto-set password for legacy admin
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: hashedPassword },
            });
            return {
              id: user.id,
              email: user.email!,
              name: user.name || "Admin",
              role: user.role,
            };
          }
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        // Only EDITOR, ADMIN, SUPER_ADMIN, SPECIALIST can log in via web
        if (!["EDITOR", "ADMIN", "SUPER_ADMIN", "SPECIALIST"].includes(user.role)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name || "Admin",
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};
