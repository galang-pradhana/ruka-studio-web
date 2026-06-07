"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Compass } from "lucide-react";

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
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541888086225-ee5b565a9568?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524815410118-cb15e982187b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop",
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

  const displayTitle = lang === 'EN' 
    ? (data.sectionTitleEN || t.title) 
    : (data.sectionTitleID || data.sectionTitle || t.title);

  const displaySubtitle = lang === 'EN'
    ? (data.sectionDescriptionEN || t.subtitle)
    : (data.sectionDescriptionID || data.sectionDescription || t.subtitle);

  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 3.75]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 5.05]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 3.0]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 4.75]);

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
      <div className="w-full flex flex-col items-center justify-center gap-6 text-center pt-32 pb-20 px-4 relative z-10">
        <span className="text-[11px] font-mono tracking-[0.2em] text-[#A4855C] uppercase flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#A4855C]" /> {displayTitle}
        </span>
        <h2 className="font-serif text-[18px] md:text-[24px] leading-[1.6] text-[#0B2240] uppercase tracking-wide max-w-3xl mx-auto text-balance">
          {displaySubtitle}
        </h2>
      </div>

      <div
        ref={gallery}
        className="relative box-border flex h-[350vh] w-full gap-[2vw] overflow-hidden bg-[#FCFAF6] p-[2vw]"
      >
        <Column images={displayImages.slice(0, 6)} y={y} />
        <Column images={displayImages.slice(6, 12)} y={y2} />
        <Column images={displayImages.slice(12, 18)} y={y3} />
        <Column images={displayImages.slice(18, 24)} y={y4} />
      </div>
      
      {/* Simple spacer instead of "Gulir ke bawah" text */}
      <div className="relative flex h-[15vh] w-full items-center justify-center pointer-events-none" />
    </div>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative flex h-full w-1/4 min-w-[40vw] md:min-w-[25vw] lg:min-w-[250px] flex-col gap-[2vw] top-[-78vh] [&:nth-child(2)]:top-[-166vh] [&:nth-child(3)]:top-[-78vh] [&:nth-child(4)]:top-[-131vh]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden rounded-[24px] bg-[#EFECE6] shadow-[0_12px_28px_rgba(11,34,64,0.06)] group">
          <img
            src={`${src}`}
            alt="Portfolio View"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="pointer-events-none object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { ParallaxPortfolio };
