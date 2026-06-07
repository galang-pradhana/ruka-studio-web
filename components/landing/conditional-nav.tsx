"use client";

import { usePathname } from "next/navigation";
import { LandingNav } from "@/components/landing/nav";

/**
 * Renders LandingNav only on non-homepage routes.
 * Homepage (/) uses its own full-featured Navbar.tsx with language toggle.
 */
export function ConditionalNav({ data = {} }: { data?: Record<string, string> }) {
  const pathname = usePathname();
  // Skip rendering on homepage and process page — they have their own Navbar component
  if (pathname === "/" || pathname === "/process") return null;
  return <LandingNav data={data} />;
}
