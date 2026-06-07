"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  LayoutTemplate,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Proyek", href: "/admin/projects", icon: FolderKanban },
  { label: "Konten Web", href: "/admin/content", icon: LayoutTemplate },
];

export function AdminSidebar({ role }: { role?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isOwner = role === "OWNER";

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div
        className="flex items-center gap-3 px-5 py-6"
        style={{ borderBottom: "1px solid #E8E2DD" }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 flex-shrink-0"
          style={{ backgroundColor: "#1B3B5A", borderRadius: "0px" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 21L12 3L21 21"
              stroke="#F4EFEB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 15H18"
              stroke="#F4EFEB"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div
            className="font-bold tracking-wider uppercase"
            style={{
              fontFamily: "var(--font-cinzel, serif)",
              fontSize: "12px",
              color: "#1A1A1A",
              letterSpacing: "0.12em",
            }}
          >
            Ruka Studio
          </div>
          <div style={{ fontSize: "10px", color: "#6B6B6B", letterSpacing: "0.04em" }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-none cursor-pointer transition-colors duration-150 group"
              style={{
                backgroundColor: active ? "#E8E2DD" : "transparent",
                color: active ? "#1B3B5A" : "#6B6B6B",
                borderRadius: "0px",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon
                size={16}
                style={{ color: active ? "#1B3B5A" : "#9B9B9B", flexShrink: 0 }}
              />
              <span style={{ fontSize: "13px", letterSpacing: "0.02em" }}>
                {item.label}
              </span>
              {active && (
                <div
                  className="ml-auto w-1 h-1 rounded-none"
                  style={{ backgroundColor: "#1B3B5A" }}
                />
              )}
            </Link>
          );
        })}

        {/* Menu khusus OWNER */}
        {isOwner && (() => {
          const active = pathname.startsWith("/admin/users");
          return (
            <Link
              href="/admin/users"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-none cursor-pointer transition-colors duration-150 group"
              style={{
                backgroundColor: active ? "#E8E2DD" : "transparent",
                color: active ? "#1B3B5A" : "#6B6B6B",
                borderRadius: "0px",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Users
                size={16}
                style={{ color: active ? "#1B3B5A" : "#9B9B9B", flexShrink: 0 }}
              />
              <span style={{ fontSize: "13px", letterSpacing: "0.02em" }}>
                Pengaturan User
              </span>
              {active && (
                <div
                  className="ml-auto w-1 h-1 rounded-none"
                  style={{ backgroundColor: "#1B3B5A" }}
                />
              )}
            </Link>
          );
        })()}
      </nav>

      {/* Footer: Logout */}
      <div className="p-3" style={{ borderTop: "1px solid #E8E2DD" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-150 rounded-none"
          style={{
            backgroundColor: "transparent",
            color: "#6B6B6B",
            borderRadius: "0px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FFF0ED";
            e.currentTarget.style.color = "#b64400";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#6B6B6B";
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", letterSpacing: "0.02em" }}>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0"
        style={{
          width: "220px",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E8E2DD",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div
        className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E8E2DD",
        }}
      >
        <div
          className="font-bold tracking-wider uppercase"
          style={{
            fontFamily: "var(--font-cinzel, serif)",
            fontSize: "11px",
            color: "#1A1A1A",
            letterSpacing: "0.12em",
          }}
        >
          Ruka Studio Admin
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 cursor-pointer transition-colors duration-150"
          aria-label="Toggle menu"
          style={{ color: "#1A1A1A" }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          onClick={() => setMobileOpen(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 flex flex-col"
            style={{
              width: "240px",
              backgroundColor: "#FFFFFF",
              borderRight: "1px solid #E8E2DD",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
