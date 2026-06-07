"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

export const PhilosophySection = ({ data = {} }: { data?: Record<string, string> }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const sectionEyebrow = language === 'EN'
    ? (data.philosophyEyebrowEN || "Design Philosophy")
    : (data.philosophyEyebrowID || data.philosophyEyebrow || "Filosofi Desain");

  const sectionTitle = language === 'EN'
    ? (data.philosophyTitleEN || "Shaping Space, Connecting Souls.")
    : (data.philosophyTitleID || data.philosophyTitle || "Membentuk Ruang, Menghubungkan Jiwa.");

  const sectionDescription = language === 'EN'
    ? (data.philosophyDescEN || "Every project is a dialogue between material, light, and the life dwelling within. We believe architecture is not just building structures, but weaving timeless experiences.")
    : (data.philosophyDescID || data.philosophyDesc || "Setiap proyek adalah dialog antara material, cahaya, dan kehidupan yang berdiam di dalamnya. Kami percaya arsitektur bukan sekadar membangun struktur, melainkan merangkai pengalaman yang tak lekang oleh waktu.");

  return (
    <section 
      ref={containerRef}
      id="philosophy"
      className="relative flex items-center justify-center w-full min-h-[80vh] bg-[#0B2240] text-[#FCFAF6] overflow-hidden px-6 lg:px-20 py-32"
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A4855C]/30 to-transparent" />
      <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A4855C]/30 to-transparent" />

      <motion.div 
        style={{ y, opacity }}
        className="flex flex-col items-center max-w-4xl mx-auto text-center z-10"
      >
        <span className="font-mono text-[11px] tracking-[0.25em] text-[#A4855C] uppercase mb-8 flex items-center gap-4">
          <span className="w-8 h-[1px] bg-[#A4855C]" />
          {sectionEyebrow}
          <span className="w-8 h-[1px] bg-[#A4855C]" />
        </span>
        
        <h2 
          className="text-[32px] md:text-[56px] leading-[1.1] mb-8 text-balance"
          style={{ fontFamily: "var(--font-cinzel, serif)" }}
        >
          {sectionTitle}
        </h2>
        
        <p className="text-[16px] md:text-[18px] leading-[1.8] text-white/70 max-w-2xl font-light">
          {sectionDescription}
        </p>
      </motion.div>
    </section>
  );
};
