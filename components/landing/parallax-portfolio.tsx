"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Compass } from "lucide-react";
import Image from "next/image";
import { parseDualLanguage } from "@/lib/content-parser";

const content = {
  EN: {
    title: "PORTFOLIO",
    subtitle: "SELECT MONOLITHS",
    scroll: "SCROLL DOWN TO EXPLORE"
  },
  ID: {
    title: "PORTOFOLIO",
    subtitle: "MAHAKARYA TERPILIH",
    scroll: "GULIR KE BAWAH"
  }
};

const defaultImages = [
  "https://images.unsplash.com/photo-1600607687930-cebc5a73e513?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687931-18e38e8cb504?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154166-d8897c8f7419?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566752229-250de48545e8?q=80&w=600&auto=format&fit=crop",
];

export type PortfolioItem = {
  imageUrl: string;
};

type Props = {
  items?: PortfolioItem[];
  data?: Record<string, string>;
};

const ParallaxPortfolio = ({ items, data = {} }: Props) => {
  const { language: lang } = useLanguage();
  const t = content[lang];

  const displayTitle = parseDualLanguage(data.sectionTitle, lang, t.title);
  const displaySubtitle = parseDualLanguage(data.sectionDescription, lang, t.subtitle);

  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2.0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 2.5]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.8]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 2.2]);

  // Looping logic for 24 images (doubled to support 2x scrolling height)
  const validItems = items?.filter(item => item.imageUrl && !item.imageUrl.includes('/images/lummi')) || [];
  const baseImages = validItems.length > 0 ? validItems.map(item => item.imageUrl) : defaultImages;
  const displayImages = [];
  for (let i = 0; i < 24; i++) {
    displayImages.push(baseImages[i % baseImages.length]);
  }

  useEffect(() => {
    const lenis = new Lenis();
    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div id="projects" className="w-full bg-[#FCFAF6] text-[#0B2240] flex flex-col items-center scroll-mt-24">
      {/* Spacer & Intro Header */}
      <div className="w-full flex flex-col items-center justify-center gap-6 text-center pt-32 md:pt-40 pb-20 px-4 relative z-10">
        <span className="text-[11px] font-mono tracking-[0.2em] text-[#A4855C] uppercase flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#A4855C]" /> {displayTitle}
        </span>
        <h2 className="font-serif text-[18px] md:text-[24px] leading-[1.6] text-[#0B2240] uppercase tracking-wide max-w-3xl mx-auto text-balance">
          {displaySubtitle}
        </h2>
      </div>

      <div
        ref={gallery}
        className="relative box-border flex h-[150vh] md:h-[250vh] w-full gap-2 md:gap-4 overflow-hidden bg-[#FCFAF6] p-0"
      >
        <Column images={displayImages.slice(0, 6)} y={y} className="flex" />
        <Column images={displayImages.slice(6, 12)} y={y2} className="flex" />
        <Column images={displayImages.slice(12, 18)} y={y3} className="hidden md:flex" />
        <Column images={displayImages.slice(18, 24)} y={y4} className="hidden md:flex" />
      </div>
      
      {/* Simple spacer instead of "Gulir ke bawah" text */}
      <div className="relative flex h-[15vh] w-full items-center justify-center pointer-events-none" />
    </div>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
  className?: string;
};

const Column = ({ images, y, className = "" }: ColumnProps) => {
  return (
    <motion.div
      className={`relative h-full w-1/2 md:w-1/4 flex-col gap-2 md:gap-4 top-[-30vh] md:top-[-78vh] [&:nth-child(2)]:top-[-60vh] md:[&:nth-child(2)]:top-[-166vh] md:[&:nth-child(3)]:top-[-78vh] md:[&:nth-child(4)]:top-[-131vh] ${className}`}
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden rounded-none bg-[#EFECE6] group cursor-pointer">
          <Image
            src={`${src}`}
            alt="Portfolio View"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { ParallaxPortfolio };
