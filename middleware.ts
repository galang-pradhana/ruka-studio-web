import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Middleware uses the lightweight authConfig (Edge-safe, no Prisma).
 * Full auth (with Prisma + bcryptjs) lives in lib/auth.ts for server use only.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
