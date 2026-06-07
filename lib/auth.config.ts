/**
 * auth.config.ts — Lightweight config for Edge Runtime (Middleware)
 * WAJIB: TIDAK boleh ada import Prisma, pg, bcrypt, atau Node.js native modules.
 * File ini digunakan HANYA oleh middleware.ts yang berjalan di Edge Runtime.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isChangePasswordRoute = nextUrl.pathname === "/admin/change-password";
      
      if (isAdminRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.href);
        return Response.redirect(loginUrl);
      }

      // If user is logged in, but must change password
      if (isLoggedIn && (auth.user as any).mustChangePassword) {
        if (isAdminRoute && !isChangePasswordRoute) {
          return Response.redirect(new URL("/admin/change-password", nextUrl.origin));
        }
      }

      // If user is logged in, doesn't need to change password, but tries to access /admin/change-password
      if (isLoggedIn && !(auth.user as any).mustChangePassword && isChangePasswordRoute) {
        return Response.redirect(new URL("/admin", nextUrl.origin));
      }

      return true;
    },
  },
  providers: [],
};
