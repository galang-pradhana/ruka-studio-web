"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { parseDualLanguage } from "@/lib/content-parser";

interface AboutHeroProps {
  data?: Record<string, string>;
  title?: string;
  eyebrow?: string;
}

export function AboutHeroSection({
  data = {},
  title: overrideTitle,
  eyebrow: overrideEyebrow,
}: AboutHeroProps) {
  const { language } = useLanguage();
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position state with spring smoothing for premium feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate cursor position relative to viewport, offset by image half-width/height
      // image container size: 280px width, 180px height
      mouseX.set(e.clientX - rect.left - 140);
      mouseY.set(e.clientY - rect.top - 200); // offset slightly above the cursor
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Headers
  const heroEyebrow = overrideEyebrow || parseDualLanguage(data.heroEyebrow, language, language === 'ID' ? "Studio Kami" : "Our Studio");
  const heroTitle = overrideTitle || parseDualLanguage(data.heroTitle, language, language === 'ID' ? "Tentang Ruka Studio." : "About Ruka Studio.");

  // Main text containing markdown style trigger words: e.g. [kolektif arsitek]
  const defaultText = language === 'ID'
    ? "Kami adalah [kolektif arsitek] dan desainer yang percaya bahwa setiap karya arsitektur harus dimulai dengan intensi sederhana: menciptakan [ruang yang presisi], menghormati [material alami], dan merumuskan [desain berkelanjutan] demi kerangka kehidupan yang lebih baik."
    : "We are a [collective of architects] and designers who believe that every architectural work should begin with a simple intention: to create [precise space], honor [natural materials], and formulate [sustainable design] for a better framework of life.";

  let rawText = parseDualLanguage(data.heroSubtitle, language, defaultText);

  // Catatan: Efek hover gambar hanya aktif jika teks mengandung [kata].
  // Jika tidak ada bracket, teks tetap ditampilkan biasa dari CMS tanpa hover effect.

  // Hover images loaded dynamically from CMS
  const hoverImages = [
    data.aboutHeroImage1 || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    data.aboutHeroImage2 || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    data.aboutHeroImage3 || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
    data.aboutHeroImage4 || "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&q=80"
  ];

  // Hover subtitles for premium look
  const hoverAspects = language === 'ID' 
    ? [
        "Suasana Kerja Studio",
        "Simetri & Detail Arsitektur",
        "Taktilitas Material & Maket",
        "Kolaborasi & Sketsa Desain"
      ]
    : [
        "Studio Workspace & Atmosphere",
        "Architectural Symmetry & Detail",
        "Material Tactility & Mockups",
        "Collaborative Ideation & Sketches"
      ];

  // Parser helper to dynamically turn [...] into hoverable trigger words
  const parseManifestoText = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    let triggerCount = 0;

    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const cleanWord = part.slice(1, -1);
        const currentTriggerIndex = triggerCount;
        triggerCount++;

        return (
          <span
            key={index}
            onMouseEnter={() => setActiveWordIndex(currentTriggerIndex)}
            onMouseLeave={() => setActiveWordIndex(null)}
            className="font-serif italic font-medium border-b border-[#0B2240]/40 text-[#0B2240] hover:text-[#A4855C] hover:border-[#A4855C] cursor-pointer transition-colors duration-300"
          >
            {cleanWord}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative pt-40 pb-36 overflow-hidden"
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

      <div className="relative max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center">
        {/* Eyebrow */}
        <p className="uppercase font-mono text-[11px] font-semibold tracking-[0.3em] text-[#A4855C] mb-12 flex items-center gap-4 select-none">
          <span className="w-8 h-[1px] bg-[#A4855C]/40" />
          {heroEyebrow}
          <span className="w-8 h-[1px] bg-[#A4855C]/40" />
        </p>

        {/* Big editorial statement text — Serif */}
        <div
          className="font-serif text-[#0B2240] text-center mb-16 text-balance relative leading-[1.6]"
          style={{
            fontSize: "clamp(24px, 3.2vw, 38px)",
            letterSpacing: "-0.01em",
          }}
        >
          <p className="inline">
            "{parseManifestoText(rawText)}"
          </p>
        </div>

        {/* Signature / Footer of manifesto */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-[1px] h-12 bg-[#0B2240]/15" />
          <h2 className="uppercase tracking-[0.2em] font-mono font-medium text-[12px] text-[#0B2240]/70">
            {heroTitle}
          </h2>
          <p className="font-mono text-[9px] text-[#0B2240]/30 tracking-widest mt-1 select-none">EST. 2024</p>
        </div>

        {/* Floating Image Reveal Element (Rendered inside the parent relative container) */}
        <AnimatePresence>
          {activeWordIndex !== null && hoverImages[activeWordIndex] && (
            <motion.div
              style={{
                position: "absolute",
                left: springX,
                top: springY,
                pointerEvents: "none",
                zIndex: 50,
              }}
              initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 1 }}
              exit={{ opacity: 0, scale: 0.85, rotate: -2 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-[280px] bg-[#FCFAF6] border border-[#0B2240]/10 p-2 shadow-2xl rounded-none"
            >
              <div className="relative w-full h-[180px] bg-neutral-100 overflow-hidden">
                <img
                  src={hoverImages[activeWordIndex]}
                  alt="Studio Detail"
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
              <div className="mt-2 px-1 pb-1 flex flex-col">
                <span className="font-mono text-[9px] tracking-[0.1em] text-[#A4855C] uppercase">
                  {hoverAspects[activeWordIndex] || "Studio Detail"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
