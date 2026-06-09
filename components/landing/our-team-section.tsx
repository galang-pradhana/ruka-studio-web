"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { parseDualLanguage } from "@/lib/content-parser";

interface OurTeamProps {
  data?: Record<string, string>;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bioEN: string;
  bioID: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
  visible: boolean;
}

export function OurTeamSection({ data }: OurTeamProps) {
  const { language } = useLanguage();
  
  const title = parseDualLanguage(data?.title, language, language === 'ID' ? "TIM KAMI" : "MEET THE TEAM");
  const description = parseDualLanguage(data?.description, language, language === 'ID' ? "Kenali tim profesional di balik setiap perencanaan presisi Ruka Studio." : "Meet the professional minds bringing our architectural visions to life.");

  // Build team member list with premium descriptions and social links
  const allMembers: TeamMember[] = [
    {
      name: parseDualLanguage(data?.member1Name, language, "Raka Pratama"),
      role: parseDualLanguage(data?.member1Role, language, "Principal Architect"),
      image: data?.member1Image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
      bioEN: parseDualLanguage(data?.member1Bio, 'EN', "Pioneering sustainable and context-aware tropical architectural designs with structural integrity."),
      bioID: parseDualLanguage(data?.member1Bio, 'ID', "Mempelopori desain arsitektur tropis yang berkelanjutan dan peka konteks dengan kekuatan struktural."),
      instagram: data?.member1Instagram || "https://instagram.com",
      linkedin: data?.member1Linkedin || "https://linkedin.com",
      email: data?.member1Email || "raka@rukastudio.com",
      visible: data?.member1Visible !== "false",
    },
    {
      name: parseDualLanguage(data?.member2Name, language, "Sari Dewi"),
      role: parseDualLanguage(data?.member2Role, language, "Interior Architect"),
      image: data?.member2Image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
      bioEN: parseDualLanguage(data?.member2Bio, 'EN', "Focusing on material authenticity, tactile rich textures, and seamless indoor-outdoor transition."),
      bioID: parseDualLanguage(data?.member2Bio, 'ID', "Berfokus pada keaslian material, kekayaan tekstur, dan transisi ruang dalam-luar yang mulus."),
      instagram: data?.member2Instagram || "https://instagram.com",
      linkedin: data?.member2Linkedin || "https://linkedin.com",
      email: data?.member2Email || "sari@rukastudio.com",
      visible: data?.member2Visible !== "false",
    },
    {
      name: parseDualLanguage(data?.member3Name, language, "Budi Wicaksono"),
      role: parseDualLanguage(data?.member3Role, language, "Project Manager"),
      image: data?.member3Image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
      bioEN: parseDualLanguage(data?.member3Bio, 'EN', "Bridging architectural vision with physical execution, timeline optimization, and site safety."),
      bioID: parseDualLanguage(data?.member3Bio, 'ID', "Menghubungkan visi arsitektur dengan eksekusi fisik, optimalisasi waktu, dan keamanan lapangan."),
      instagram: data?.member3Instagram || "https://instagram.com",
      linkedin: data?.member3Linkedin || "https://linkedin.com",
      email: data?.member3Email || "budi@rukastudio.com",
      visible: data?.member3Visible !== "false",
    },
    {
      name: parseDualLanguage(data?.member4Name, language, "Anisa Putri"),
      role: parseDualLanguage(data?.member4Role, language, "3D Visualizer"),
      image: data?.member4Image || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
      bioEN: parseDualLanguage(data?.member4Bio, 'EN', "Translating schematic models into high-fidelity photorealistic renders for spatial clarity."),
      bioID: parseDualLanguage(data?.member4Bio, 'ID', "Menerjemahkan model skematik menjadi rendering fotorealistik resolusi tinggi untuk kejelasan ruang."),
      instagram: data?.member4Instagram || "https://instagram.com",
      linkedin: data?.member4Linkedin || "https://linkedin.com",
      email: data?.member4Email || "anisa@rukastudio.com",
      visible: data?.member4Visible !== "false",
    },
  ];

  const visibleMembers = allMembers.filter((m) => m.visible);
  if (visibleMembers.length === 0) return null;

  // Stepper order classes for mobile (1 col), tablet (2 cols), and desktop (4 cols) to achieve perfect checkerboard
  const orderClasses = [
    {
      photo: "order-1 md:order-1 lg:order-1",
      info: "order-2 md:order-2 lg:order-2"
    },
    {
      photo: "order-3 md:order-4 lg:order-3",
      info: "order-4 md:order-3 lg:order-4"
    },
    {
      photo: "order-5 md:order-5 lg:order-6",
      info: "order-6 md:order-6 lg:order-5"
    },
    {
      photo: "order-7 md:order-8 lg:order-8",
      info: "order-8 md:order-7 lg:order-7"
    }
  ];

  return (
    <section id="our-team" className="py-[120px] bg-[#FCFAF6] scroll-mt-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-14">
        
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <p
            className="uppercase font-semibold mb-6"
            style={{
              fontSize: "10px",
              letterSpacing: "0.35em",
              fontFamily: "var(--font-montserrat, sans-serif)",
              color: "#A4855C",
            }}
          >
            {language === 'EN' ? "THE ARCHITECTS" : "TIM ARSITEK"}
          </p>
          <h2
            className="font-bold mb-4"
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-cinzel, serif)",
              color: "#0B2240",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              fontWeight: 400,
              fontFamily: "var(--font-montserrat, sans-serif)",
              color: "rgba(10,6,8,0.55)",
            }}
            className="max-w-2xl"
          >
            {description}
          </p>
        </div>

        {/* Checkerboard Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#0B2240]/10 overflow-hidden rounded-none shadow-[0_12px_40px_rgba(11,34,64,0.03)]">
          {visibleMembers.map((member, idx) => {
            const classes = orderClasses[idx % 4];
            return (
              <div key={member.name} className="contents">
                
                {/* Photo Block */}
                <div 
                  className={`aspect-square relative overflow-hidden group bg-[#0B2240]/10 border border-[#0B2240]/5 ${classes.photo}`}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-[#0B2240]/10 opacity-60 group-hover:opacity-0 transition-opacity duration-500" />
                </div>

                {/* Info Block */}
                <div 
                  className={`aspect-square bg-white flex flex-col justify-center items-center p-6 text-center border border-[#0B2240]/5 ${classes.info}`}
                >
                  <div className="max-w-[260px] flex flex-col items-center">
                    
                    {/* Name */}
                    <h3
                      className="font-bold mb-1.5 transition-colors duration-300 text-[#0B2240]"
                      style={{
                        fontSize: "clamp(18px, 2.2vw, 21px)",
                        fontFamily: "var(--font-cinzel, serif)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {member.name}
                    </h3>

                    {/* Role */}
                    <p
                      className="uppercase font-semibold mb-4"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.2em",
                        fontFamily: "var(--font-montserrat, sans-serif)",
                        color: "#A4855C",
                      }}
                    >
                      {member.role}
                    </p>

                    {/* Short Bio */}
                    <p
                      style={{
                        fontSize: "12px",
                        lineHeight: 1.6,
                        fontFamily: "var(--font-montserrat, sans-serif)",
                        color: "rgba(10,6,8,0.6)",
                      }}
                      className="mb-5 line-clamp-3"
                    >
                      {language === 'EN' ? member.bioEN : member.bioID}
                    </p>

                    {/* Social/Contact Icons using Inline SVGs */}
                    <div className="flex gap-4 text-[#0B2240]/40">
                      {member.instagram && (
                        <a 
                          href={member.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-[#A4855C] transition-colors duration-300"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </a>
                      )}
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-[#A4855C] transition-colors duration-300"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                        </a>
                      )}
                      {member.email && (
                        <a 
                          href={`mailto:${member.email}`}
                          className="hover:text-[#A4855C] transition-colors duration-300"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </a>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
