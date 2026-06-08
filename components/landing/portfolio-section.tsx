"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export type PortfolioItem = {
  id: string;
  title: string;
  projectType: string | null;
  imageUrl: string;
  description: string | null;
};

const FALLBACK_ITEMS: PortfolioItem[] = [
  {
    id: "1",
    title: "Vila Modern Bali",
    projectType: "Full Kontraktor",
    imageUrl: "https://images.unsplash.com/photo-1600607687930-cebc5a73e513?w=800&q=80",
    description: "Hunian tropis modern dengan ruang terbuka lebar yang menyatu dengan lanskap alami.",
  },
  {
    id: "2",
    title: "Residensial Serpong",
    projectType: "Pengawasan",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    description: "Kesederhanaan volume geometris yang berpadu dengan cahaya natural.",
  },
  {
    id: "3",
    title: "Ruang Komersial Jakarta",
    projectType: "Perencanaan",
    imageUrl: "https://images.unsplash.com/photo-1600607687931-18e38e8cb504?w=800&q=80",
    description: "Pemilihan material taktil yang memberikan kedalaman karakter pada ruang publik.",
  },
];

type Props = {
  data?: Record<string, string>;
  items?: PortfolioItem[];
};

export function PortfolioSection({ items, data = {} }: Props) {
  const portfolioItems = items && items.length > 0 ? items : FALLBACK_ITEMS;

  const sectionTitle = data.sectionTitle || "Karya Pilihan";
  const sectionDescription =
    data.sectionDescription ||
    "Setiap karya adalah representasi dari komitmen kami terhadap kualitas, fungsi, dan keindahan.";

  return (
    <section
      id="portofolio"
      className="py-32"
      style={{ backgroundColor: "#FCFAF6", borderTop: "1px solid rgba(10,6,8,0.06)" }}
    >
      <div className="max-w-[1200px] mx-auto px-8 md:px-14">
        {/* Header */}
        <div className="mb-24 text-center flex flex-col items-center">
          <p
            className="uppercase font-semibold mb-6"
            style={{
              fontSize: "10px",
              letterSpacing: "0.35em",
              fontFamily: "var(--font-montserrat, sans-serif)",
              color: "#A4855C",
            }}
          >
            {sectionTitle}
          </p>
          <h2
            className="font-bold max-w-2xl"
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-cinzel, serif)",
              color: "#0B2240",
            }}
          >
            {sectionDescription}
          </h2>
        </div>

        {/* Vertical Asymmetrical Gallery */}
        <div className="flex flex-col gap-28 md:gap-40">
          {portfolioItems.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={item.id}
                className={`flex flex-col gap-8 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } items-center`}
              >
                {/* Image with hover reveal */}
                <div className="w-full md:w-2/3 overflow-hidden group relative" style={{ borderRadius: "0px" }}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full aspect-video cursor-pointer relative"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                    {/* Hover Overlay — dark editorial glass */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                      style={{
                        backgroundColor: "rgba(10,6,8,0.55)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <span
                        className="text-[11px] font-bold tracking-[0.18em] uppercase"
                        style={{
                          padding: "12px 28px",
                          borderRadius: "0px",
                          border: "1.5px solid rgba(197,168,128,0.6)",
                          color: "#A4855C",
                          backgroundColor: "rgba(10,6,8,0.4)",
                          letterSpacing: "0.18em",
                          fontFamily: "var(--font-montserrat, sans-serif)",
                        }}
                      >
                        Lihat Proyek
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Meta */}
                <div
                  className={`w-full md:w-1/3 flex flex-col ${
                    isEven ? "md:pl-10" : "md:pr-10"
                  }`}
                >
                  {item.projectType && (
                    <div className="mb-5">
                      <span
                        className="inline-block font-semibold uppercase"
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.3em",
                          padding: "5px 12px",
                          borderRadius: "0px",
                          border: "1px solid rgba(197,168,128,0.35)",
                          color: "#A4855C",
                          fontFamily: "var(--font-montserrat, sans-serif)",
                          backgroundColor: "rgba(197,168,128,0.06)",
                        }}
                      >
                        {item.projectType}
                      </span>
                    </div>
                  )}
                  <h3
                    className="font-bold mb-4"
                    style={{
                      fontSize: "clamp(22px, 2.5vw, 28px)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      fontFamily: "var(--font-cinzel, serif)",
                      color: "#0B2240",
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className="leading-relaxed"
                      style={{
                        fontSize: "15px",
                        fontFamily: "var(--font-montserrat, sans-serif)",
                        color: "rgba(10,6,8,0.55)",
                        lineHeight: 1.75,
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                  {/* Subtle index number */}
                  <p
                    className="font-mono font-bold mt-6 select-none"
                    style={{
                      fontSize: "clamp(28px, 4vw, 40px)",
                      letterSpacing: "-0.04em",
                      color: "rgba(10,6,8,0.06)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
