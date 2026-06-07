"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { useLanguage } from "@/contexts/language-context";

const processStages = [
  {
    id: "01",
    titleID: "Sketsa Desain",
    titleEN: "Sketch Design",
    descID: "Kami memulai dengan kunjungan lokasi dan konsultasi kreatif untuk menentukan visi, gaya, dan kebutuhan fungsional Anda. Berdasarkan ini, kami membuat serangkaian sketsa desain tangan untuk memberikan konsep visual awal yang mencerminkan brief Anda.",
    descEN: "We start with a site visit and creative consultation to determine your vision, style, and functional needs. Based on this, we create a series of hand-drawn sketches to provide an initial visual concept reflecting your brief.",
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "02",
    titleID: "Pengembangan Desain",
    titleEN: "Design Development",
    descID: "Di sini kami mengembangkan sketsa awal dengan semua detail — termasuk pemilihan material bangunan, denah lantai, layout, desain joinery indikatif, dan alur ruang. Tim kami akan membuat gambar 2D digital terperinci dan model 3D.",
    descEN: "Here we develop the initial sketches with all the details — including building material selection, floor plans, layouts, indicative joinery design, and spatial flow. Our team will create detailed digital 2D drawings and 3D models.",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "03",
    titleID: "Aplikasi Pengembangan",
    titleEN: "Development Application",
    descID: "Tidak semua proyek memerlukan aplikasi pengembangan ke pemerintah daerah. Jika proyek Anda memerlukannya, kami akan mengkoordinasikan seluruh proses — termasuk pengumpulan dokumentasi, penyiapan dan pengajuan aplikasi.",
    descEN: "Not all projects require a development application to the local council. If yours does, we will coordinate the entire process — including documentation gathering, preparation, and submission of the application.",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "04",
    titleID: "Desain Interior",
    titleEN: "Interior Design",
    descID: "Kami merancang konsep desain interior yang menciptakan alur, kontras, dan keseimbangan dengan desain arsitektur dan visi keseluruhan rumah Anda — termasuk joinery, kabinet, penyimpanan, finishes, dan perlengkapan.",
    descEN: "We design interior concepts that create flow, contrast, and balance with the architectural design and overall vision of your home — including joinery, cabinetry, storage, finishes, and fixtures.",
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "05",
    titleID: "Persetujuan Bangunan",
    titleEN: "Building Approval Plans",
    descID: "Semua proyek arsitektur memerlukan Persetujuan Bangunan sebelum konstruksi dapat dimulai. Tim kami akan menasihati, memandu, mengkoordinasikan, dan mengelola semua rencana serta aplikasi persetujuan bangunan Anda.",
    descEN: "All architectural projects require Building Approval before construction can commence. Our team will advise, guide, coordinate, and manage all your building approval plans and applications.",
    src: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "06",
    titleID: "Rencana Konstruksi",
    titleEN: "Construction Plans",
    descID: "Dengan semua detail desain selesai dan persetujuan bangunan beres, kami beralih ke pembuatan rencana, gambar, dan dokumen konstruksi yang akan memandu builder dan tenaga ahli dalam mewujudkan desain yang dimaksudkan.",
    descEN: "With all design details finalized and building approvals in place, we move to creating construction plans, drawings, and documents that will guide the builder and trades in realizing the intended design.",
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
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
        }}
        className="relative flex flex-col lg:flex-row w-[90vw] lg:w-[1000px] xl:w-[1100px] bg-[#FCFAF6] border border-[#0B2240]/15 shadow-[0_20px_40px_rgba(10,6,8,0.06)] origin-top overflow-hidden rounded-[24px]"
      >
        {/* Content Side */}
        <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#0B2240]/10 bg-[#FCFAF6]">
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
        <div className="w-full lg:w-[55%] h-[300px] lg:h-[500px] relative overflow-hidden bg-[#0B2240]/5">
          <img
            src={stage.src}
            alt={language === "ID" ? stage.titleID : stage.titleEN}
            className="w-full h-full object-cover"
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

  return (
    <div
      ref={container}
      className="relative flex w-full flex-col items-center justify-center pt-12 pb-[10vh]"
    >
      {processStages.map((stage, i) => {
        const targetScale = Math.max(0.9, 1 - (processStages.length - i - 1) * 0.02);
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
