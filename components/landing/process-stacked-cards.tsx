"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image";

const processStages = [
  {
    id: "01",
    titleID: "Sketsa Desain",
    titleEN: "Sketch Design",
    descID: "Kami memulai dengan kunjungan lokasi dan konsultasi kreatif untuk menentukan visi, gaya, dan kebutuhan fungsional Anda. Berdasarkan ini, kami membuat serangkaian sketsa desain tangan untuk memberikan konsep visual awal yang mencerminkan brief Anda.",
    descEN: "We start with a site visit and creative consultation to determine your vision, style, and functional needs. Based on this, we create a series of hand-drawn sketches to provide an initial visual concept reflecting your brief.",
    src: "https://images.unsplash.com/photo-1600607687930-cebc5a73e513?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "02",
    titleID: "Pengembangan Desain",
    titleEN: "Design Development",
    descID: "Di sini kami mengembangkan sketsa awal dengan semua detail — termasuk pemilihan material bangunan, denah lantai, layout, desain joinery indikatif, dan alur ruang. Tim kami akan membuat gambar 2D digital terperinci dan model 3D.",
    descEN: "Here we develop the initial sketches with all the details — including building material selection, floor plans, layouts, indicative joinery design, and spatial flow. Our team will create detailed digital 2D drawings and 3D models.",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "03",
    titleID: "Aplikasi Pengembangan",
    titleEN: "Development Application",
    descID: "Tidak semua proyek memerlukan aplikasi pengembangan ke pemerintah daerah. Jika proyek Anda memerlukannya, kami akan mengkoordinasikan seluruh proses — termasuk pengumpulan dokumentasi, penyiapan dan pengajuan aplikasi.",
    descEN: "Not all projects require a development application to the local council. If yours does, we will coordinate the entire process — including documentation gathering, preparation, and submission of the application.",
    src: "https://images.unsplash.com/photo-1600607687931-18e38e8cb504?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "04",
    titleID: "Desain Interior",
    titleEN: "Interior Design",
    descID: "Kami merancang konsep desain interior yang menciptakan alur, kontras, dan keseimbangan dengan desain arsitektur dan visi keseluruhan rumah Anda — termasuk joinery, kabinet, penyimpanan, finishes, dan perlengkapan.",
    descEN: "We design interior concepts that create flow, contrast, and balance with the architectural design and overall vision of your home — including joinery, cabinetry, storage, finishes, and fixtures.",
    src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "05",
    titleID: "Persetujuan Bangunan",
    titleEN: "Building Approval Plans",
    descID: "Semua proyek arsitektur memerlukan Persetujuan Bangunan sebelum konstruksi dapat dimulai. Tim kami akan menasihati, memandu, mengkoordinasikan, dan mengelola semua rencana serta aplikasi persetujuan bangunan Anda.",
    descEN: "All architectural projects require Building Approval before construction can commence. Our team will advise, guide, coordinate, and manage all your building approval plans and applications.",
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "06",
    titleID: "Rencana Konstruksi",
    titleEN: "Construction Plans",
    descID: "Dengan semua detail desain selesai dan persetujuan bangunan beres, kami beralih ke pembuatan rencana, gambar, dan dokumen konstruksi yang akan memandu builder dan tenaga ahli dalam mewujudkan desain yang dimaksudkan.",
    descEN: "With all design details finalized and building approvals in place, we move to creating construction plans, drawings, and documents that will guide the builder and trades in realizing the intended design.",
    src: "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?q=80&w=800&auto=format&fit=crop",
  },
];

const ProcessCard = ({
  i,
  stage,
  progress,
  range,
  targetScale,
  language,
}: {
  i: number;
  stage: any;
  progress: any;
  range: [number, number];
  targetScale: number;
  language: "ID" | "EN";
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center min-h-screen pb-[10vh]"
    >
      <motion.div
        style={{
          scale,
          top: `calc(10vh + ${i * 25}px)`,
          zIndex: i * 10,
        }}
        className="relative flex flex-col lg:flex-row w-full bg-[#FCFAF6] border-y border-[#0B2240]/10 shadow-[0_20px_40px_rgba(10,6,8,0.06)] origin-top overflow-hidden rounded-none"
      >
        {/* Content Side */}
        <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#0B2240]/10 bg-[#FCFAF6]">
          <span className="font-mono text-[10px] md:text-[12px] text-[#0B2240]/40 mb-6 block">
            ({stage.id})
          </span>
          <h3
            className="text-[28px] md:text-[36px] text-[#0B2240] leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-cinzel, serif)" }}
          >
            {language === "ID" ? stage.titleID : stage.titleEN}
          </h3>
          <p className="text-[14px] md:text-[15px] leading-[1.8] text-[#0B2240]/70">
            {language === "ID" ? stage.descID : stage.descEN}
          </p>
        </div>

        {/* Image Side */}
        <div className="w-full lg:w-[55%] h-[300px] lg:h-[550px] relative overflow-hidden bg-[#0B2240]/5">
          <Image
            src={stage.src}
            alt={language === "ID" ? stage.titleID : stage.titleEN}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>
      </motion.div>
    </div>
  );
};

export const ProcessStackedCards = ({ data }: { data?: Record<string, string> }) => {
  const { language } = useLanguage();
  const container = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const dynamicStages = processStages.map((stage, i) => {
    const idx = i + 1;
    const titleKey = `process${idx}Title`;
    const descKey = `process${idx}Desc`;
    const imgKey = `process${idx}Image`;
    
    return {
      id: stage.id,
      titleID: parseDualLanguage(data?.[titleKey], 'ID', stage.titleID),
      titleEN: parseDualLanguage(data?.[titleKey], 'EN', stage.titleEN),
      descID: parseDualLanguage(data?.[descKey], 'ID', stage.descID),
      descEN: parseDualLanguage(data?.[descKey], 'EN', stage.descEN),
      src: data?.[imgKey] || stage.src,
    };
  });

  return (
    <div
      ref={container}
      className="relative flex w-full flex-col items-center justify-center pt-12 pb-[10vh]"
    >
      {dynamicStages.map((stage, i) => {
        const targetScale = Math.max(0.9, 1 - (dynamicStages.length - i - 1) * 0.02);
        return (
          <ProcessCard
            key={stage.id}
            i={i}
            stage={stage}
            progress={scrollYProgress}
            range={[i * 0.15, 1]}
            targetScale={targetScale}
            language={language}
          />
        );
      })}
    </div>
  );
};
