"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

export function LandingNav({ data = {} }: { data?: Record<string, string> }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waNumber = data.whatsappNumber || "6281234567890";
  const waMessage = data.whatsappMessage || (language === "ID" ? "Halo Ruka Studio, saya ingin konsultasi proyek." : "Hello Ruka Studio, I'd like to consult about a project.");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const navLinksMap = {
    EN: [
      { name: "Work", href: "/work" },
      { name: "Studio", href: "/studio" },
      { name: "Process", href: "/process" },
      { name: "Gallery", href: "/gallery" },
    ],
    ID: [
      { name: "Karya", href: "/work" },
      { name: "Studio", href: "/studio" },
      { name: "Proses", href: "/process" },
      { name: "Galeri", href: "/gallery" },
    ]
  };

  const navLinks = navLinksMap[language];

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "h-[72px] shadow-[0_1px_0_rgba(10,6,8,0.08)]"
          : "h-[88px]"
      )}
      style={{
        backgroundColor: isScrolled
          ? "rgba(252,250,246,0.97)"
          : "rgba(252,250,246,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: isScrolled ? "1px solid rgba(10,6,8,0.07)" : "1px solid transparent",
      }}
    >
      <nav className="w-full h-full max-w-[1440px] mx-auto px-8 md:px-14 flex items-center justify-between">
        {/* Logo — clean editorial wordmark */}
        <Link
          href="/"
          className={cn(
            "group flex flex-col items-start leading-none select-none transition-all duration-500",
            isScrolled ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
          )}
          style={{ fontFamily: "var(--font-cinzel, serif)" }}
        >
          <span
            className="font-bold tracking-[0.18em] uppercase text-[#0B2240] transition-opacity duration-300 group-hover:opacity-60"
            style={{ fontSize: "15px", letterSpacing: "0.22em" }}
          >
            RUKA
          </span>
          <span
            className="font-light tracking-[0.38em] uppercase text-[#0B2240]/50 transition-opacity duration-300 group-hover:opacity-60"
            style={{ fontSize: "9px", letterSpacing: "0.45em", marginTop: "1px" }}
          >
            STUDIO
          </span>
        </Link>

        {/* Nav links — desktop */}
        <div className={cn(
          "hidden md:flex items-center gap-9 transition-all duration-500",
          isScrolled ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        )}>
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative group text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
                pathname === item.href
                  ? "text-[#0B2240]"
                  : "text-[#0B2240]/45 hover:text-[#0B2240]"
              )}
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {item.name}
              {/* Gold underline accent */}
              <span
                className={cn(
                  "absolute -bottom-1.5 left-0 h-[1.5px] transition-all duration-400 group-hover:w-full",
                  pathname === item.href ? "w-full" : "w-0"
                )}
                style={{ backgroundColor: "#A4855C" }}
              />
            </Link>
          ))}
        </div>

        {/* CTA + Language Toggle + Mobile Toggle */}
        <div className="flex items-center gap-6">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300"
            style={{
              fontFamily: "var(--font-montserrat, sans-serif)",
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              backgroundColor: "rgba(10,6,8,0.06)",
              color: "#0B2240",
            }}
            aria-label="Toggle Language"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(10,6,8,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(10,6,8,0.06)";
            }}
          >
            {language}
          </button>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer"
            style={{
              fontFamily: "var(--font-montserrat, sans-serif)",
              padding: "10px 24px",
              borderRadius: "999px",
              backgroundColor: "#0a0608",
              color: "#FCFAF6",
              border: "1.5px solid #0a0608",
              transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "#A4855C";
              el.style.borderColor = "#A4855C";
              el.style.color = "#0a0608";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "#0a0608";
              el.style.borderColor = "#0a0608";
              el.style.color = "#FCFAF6";
            }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {language === "ID" ? "Konsultasi" : "Consultation"}
          </a>

          <button
            className="md:hidden p-2 text-[#0a0608] -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute left-0 right-0 py-6 px-8 flex flex-col gap-5 shadow-lg"
          style={{
            top: isScrolled ? "72px" : "88px",
            backgroundColor: "rgba(252,250,246,0.98)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(10,6,8,0.07)",
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-[13px] font-semibold uppercase tracking-[0.12em] py-1 transition-colors duration-300",
                pathname === item.href
                  ? "text-[#0a0608]"
                  : "text-[#0a0608]/45 hover:text-[#0a0608]"
              )}
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] mt-2 py-3.5"
            style={{
              fontFamily: "var(--font-montserrat, sans-serif)",
              borderRadius: "999px",
              backgroundColor: "#0a0608",
              color: "#FCFAF6",
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <MessageCircle className="w-4 h-4" />
            {language === "ID" ? "Konsultasi Gratis" : "Free Consultation"}
          </a>
        </div>
      )}
    </header>
  );
}
