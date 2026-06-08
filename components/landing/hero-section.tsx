"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroSection({ data = {} }: { data?: Record<string, string> }) {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Simple parallax for the image
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Data bindings with fallbacks based on Editorial Minimalist style
  let headline = data.headline || "RUKA STUDIO";
  if (headline === "INTEGRITAS") {
    headline = "RUKA STUDIO"; // Remove "INTEGRITAS" fallback
  }

  const topLabelCenter = "FEATURED ARCHITECTURE & DESIGN STUDIO";

  const rightTitle = data.rightTitle || "KAMI MEMADUKAN ALAM & KENYAMANAN HUNIAN";
  const rightSubtitle = data.rightSubtitle || "Setiap ruang dirancang dengan presisi untuk harmoni sejati. Menciptakan pendekatan minimalis untuk membangun kepercayaan klien.";
  
  return (
    <div className="flex flex-col w-full">
      {/* Full Screen Image Hero */}
      <section
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden selection:bg-white selection:text-black flex flex-col"
      >
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0 z-0"
        >
          <motion.div style={{ y: imgY }} className="absolute inset-0 w-full h-[120%] origin-top -mt-[10%]">
            <Image
              src={data.heroImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"}
              alt="Ruka Studio Project"
              fill
              priority
              className="object-cover object-center brightness-[0.85]"
            />
          </motion.div>
          {/* Top vignette for Nav contrast */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10" />
          {/* Bottom vignette for Text contrast */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
        </motion.div>

        {/* Content overlaid on image (Thursday Studio Brighton College style) */}
        <div className="absolute bottom-16 md:bottom-20 inset-x-0 z-20 flex flex-col items-center justify-end w-full text-center px-4">
          
          {/* Top Label */}
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-[10px] md:text-xs font-light tracking-[0.4em] text-white/80 uppercase mb-3 md:mb-5"
          >
            {topLabelCenter}
          </motion.span>

          {/* Huge Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[7.8vw] font-extrabold leading-none tracking-tight text-white uppercase select-none font-sans"
          >
            {headline}
          </motion.h1>

          {/* Bottom Tagline */}
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-[10px] md:text-xs font-semibold tracking-[0.35em] text-white uppercase mt-4 md:mt-6 flex items-center justify-center gap-2"
          >
            DESIGN <span className="opacity-50">·</span> BUILD <span className="opacity-50">·</span> INTERIOR
          </motion.span>

        </div>
      </section>

      {/* Bottom Content / Introduction */}
      <section className="w-full bg-background px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24"
          >
            {/* Left Column */}
            <div className="flex flex-col md:flex-row gap-8">
              <span className="text-xs font-semibold text-primary">01 /</span>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-6">Pengantar</h3>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-light">
                  Pendekatan minimalis yang terukur, material pilihan, dan bentuk arsitektur esensial — semua ini adalah filosofi dasar yang melekat pada Ruka Studio. Kami berdedikasi menciptakan ruang yang menginspirasi dan fungsional.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col md:flex-row gap-8 md:justify-end">
              <span className="text-xs font-semibold text-primary md:hidden">02 /</span>
              <div className="md:max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-foreground">Tugas Utama</h3>
                  <span className="hidden md:inline-block text-xs font-bold text-accent uppercase tracking-widest text-right">About the Project</span>
                </div>
                <h4 className="text-md font-bold text-primary mb-3 uppercase tracking-wider">{rightTitle}</h4>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-light">
                  {rightSubtitle}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
