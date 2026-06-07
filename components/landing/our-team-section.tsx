"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

interface OurTeamProps {
  data?: Record<string, string>;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  visible: boolean;
}

export function OurTeamSection({ data }: OurTeamProps) {
  const { language } = useLanguage();
  
  const title = language === 'EN'
    ? (data?.titleEN || "OUR TEAM")
    : (data?.titleID || data?.title || "TIM KAMI");
  const description = language === 'EN'
    ? (data?.descriptionEN || "Behind every Ruka Studio masterpiece is a dedicated team.")
    : (data?.descriptionID || data?.description || "Di balik setiap karya Ruka Studio terdapat tim yang berdedikasi.");

  // Bangun daftar member dari data CMS
  const allMembers: TeamMember[] = [
    {
      name: data?.member1Name || "Raka Pratama",
      role: data?.member1Role || "Principal Architect",
      image: data?.member1Image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
      visible: data?.member1Visible !== "false",
    },
    {
      name: data?.member2Name || "Sari Dewi",
      role: data?.member2Role || "Interior Designer",
      image: data?.member2Image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
      visible: data?.member2Visible !== "false",
    },
    {
      name: data?.member3Name || "Budi Wicaksono",
      role: data?.member3Role || "Project Manager",
      image: data?.member3Image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
      visible: data?.member3Visible !== "false",
    },
    {
      name: data?.member4Name || "Anisa Putri",
      role: data?.member4Role || "3D Visualizer",
      image: data?.member4Image || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
      visible: data?.member4Visible === "true",  // default hidden unless explicitly enabled
    },
  ];

  // Filter hanya yang visible
  const visibleMembers = allMembers.filter((m) => m.visible);

  if (visibleMembers.length === 0) return null;

  // Layout dinamis berdasarkan jumlah member yang ditampilkan
  const gridCols =
    visibleMembers.length === 1
      ? "flex justify-center"
      : visibleMembers.length === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center"
      : visibleMembers.length === 3
      ? "grid grid-cols-1 sm:grid-cols-3 gap-10 justify-items-center"
      : "grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center";

  return (
    <section id="our-team" className="py-24 bg-white text-[#1A1A1A] scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p
            className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-4"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Tentang Kami
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-[#1B3B5A] mb-6"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {title}
          </h2>
          <p
            className="text-base text-gray-500 leading-relaxed"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {description}
          </p>
        </motion.div>
 
        <div className={gridCols}>
          {visibleMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative overflow-hidden"
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: visibleMembers.length >= 4 ? "220px" : "280px",
                  aspectRatio: "3/4",
                }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay elegan saat hover */}
                <div className="absolute inset-0 bg-[#1B3B5A]/0 group-hover:bg-[#1B3B5A]/20 transition-all duration-500" />
              </div>
              <div className="pt-5 text-center">
                <h3
                  className="text-xl font-semibold text-[#1B3B5A] mb-1"
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-xs uppercase tracking-widest text-gray-400"
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
