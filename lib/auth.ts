import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { checkRateLimit, recordFailedAttempt, clearRateLimit } from "@/lib/rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only-change-in-production-12345",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Rate limit key: keyed by email to prevent per-account brute force
        const rateLimitKey = `login:${(credentials.email as string).toLowerCase()}`;
        const { limited, resetInMs } = checkRateLimit(rateLimitKey);

        if (limited) {
          const minutesLeft = Math.ceil(resetInMs / 60000);
          throw new Error(`TOO_MANY_ATTEMPTS:${minutesLeft}`);
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          recordFailedAttempt(rateLimitKey);
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (passwordsMatch) {
          // Clear rate limit on successful login
          clearRateLimit(rateLimitKey);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
          };
        }

        // Record failed attempt
        recordFailedAttempt(rateLimitKey);
        const afterCheck = checkRateLimit(rateLimitKey);
        if (afterCheck.remaining === 0) {
          throw new Error(`TOO_MANY_ATTEMPTS:${Math.ceil(afterCheck.resetInMs / 60000)}`);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.mustChangePassword = user.mustChangePassword;
      }
      // Untuk mengupdate token session saat password diganti
      if (trigger === "update" && session?.mustChangePassword === false) {
        token.mustChangePassword = false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },
});
