"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { parseDualLanguage } from "@/lib/content-parser";

export const PhilosophySection = ({ data = {} }: { data?: Record<string, string> }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const sectionEyebrow = parseDualLanguage(data.philosophyEyebrow, language, language === 'ID' ? "Filosofi Desain" : "Design Philosophy");

  const sectionTitle = parseDualLanguage(data.philosophyTitle, language, language === 'ID' ? "Merancang Ruang untuk Kehidupan yang Sebenarnya." : "Designing Spaces, Building Homes.");

  const sectionDescription = parseDualLanguage(data.philosophyDesc, language, language === 'ID' ? "Kami percaya bahwa rumah yang baik bukan sekadar bangunan. Ini tentang bagaimana cahaya alami, material yang jujur, dan tata ruang yang cerdas menyatu untuk membuat hidup Anda lebih baik." : "We believe a great home is more than just a building. It's about how natural light, honest materials, and smart design come together to make daily life better.");

  const sectionImage = data.philosophyImage || "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=1600&q=80";

  return (
    <section 
      ref={containerRef}
      id="philosophy"
      className="relative flex items-center justify-center w-full min-h-[80vh] bg-[#0B2240] text-[#FCFAF6] overflow-hidden px-6 lg:px-20 pt-32 pb-24 md:py-32"
    >
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url('${sectionImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
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
