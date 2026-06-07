"use client";

import { useLanguage } from "@/contexts/language-context";

interface AboutHeroProps {
  data?: Record<string, string>;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}

export function AboutHeroSection({
  data = {},
  title,
  subtitle,
  eyebrow,
}: AboutHeroProps) {
  const { language } = useLanguage();

  // Resolution logic: check if explicitly passed prop exists, else check DB data based on language, else static fallback
  const heroTitle = language === 'EN'
    ? (data.heroTitleEN || "About Ruka Studio.")
    : (data.heroTitleID || data.heroTitle || "Tentang Ruka Studio.");

  const heroSubtitle = language === 'EN'
    ? (subtitle || data.heroSubtitleEN || "A construction consultancy believing that buildings are not just structures — they are the framework for life.")
    : (subtitle || data.heroSubtitleID || data.heroSubtitle || "Konsultan konstruksi yang percaya bahwa bangunan bukan sekadar struktur — ia adalah kerangka bagi kehidupan.");

  const heroEyebrow = language === 'EN'
    ? (eyebrow || data.heroEyebrowEN || "Our Philosophy")
    : (eyebrow || data.heroEyebrowID || data.heroEyebrow || "Filosofi Kami");

  return (
    <section
      className="relative pt-40 pb-32 overflow-hidden"
      style={{ backgroundColor: "#FCFAF6" }}
    >
      {/* Subtle diagonal grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #0a0608 0px,
            #0a0608 1px,
            transparent 1px,
            transparent 8px
          )`,
        }}
      />

      {/* Decorative vertical lines on sides to anchor the center content */}
      <div className="absolute top-0 left-8 md:left-16 w-[1px] h-full bg-gradient-to-b from-transparent via-black/5 to-transparent pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-8 md:right-16 w-[1px] h-full bg-gradient-to-b from-transparent via-black/5 to-transparent pointer-events-none hidden md:block" />

      <div className="relative max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <p className="uppercase font-mono text-[11px] font-semibold tracking-[0.3em] text-[#A4855C] mb-12 flex items-center gap-4">
          <span className="w-8 h-[1px] bg-[#A4855C]/40" />
          {heroEyebrow}
          <span className="w-8 h-[1px] bg-[#A4855C]/40" />
        </p>

        {/* Big editorial statement quote — Serif */}
        <p
          className="font-serif text-[#0B2240] mb-14 text-balance"
          style={{
            fontSize: "clamp(26px, 3.5vw, 42px)",
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
          }}
        >
          "{heroSubtitle}"
        </p>

        {/* Signature / Footer of manifesto */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-[1px] h-12 bg-[#0B2240]/15" />
          <h2 className="uppercase tracking-[0.2em] font-mono font-medium text-[12px] text-[#0B2240]/70">
            {heroTitle}
          </h2>
          <p className="font-mono text-[9px] text-[#0B2240]/30 tracking-widest mt-1">EST. 2024</p>
        </div>
      </div>
    </section>
  );
}
