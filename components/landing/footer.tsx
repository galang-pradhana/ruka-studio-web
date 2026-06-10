"use client";
import React from 'react';
import { useLanguage } from "@/contexts/language-context";
import { parseDualLanguage } from "@/lib/content-parser";

import Image from "next/image";

export function LandingFooter({ data = {} }: { data?: Record<string, string> }) {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  const emailVal = parseDualLanguage(data.email, language, "hello@rukastudio.com");
  const instagramVal = parseDualLanguage(data.instagram, language, "https://instagram.com/rukastudio");
  const linkedinVal = parseDualLanguage(data.linkedin, language, "https://linkedin.com/company/rukastudio");
  const whatsappNumberVal = parseDualLanguage(data.whatsappNumber, language, "6281234567890");
  const whatsappMessageVal = parseDualLanguage(data.whatsappMessage, language, "Halo Ruka Studio, saya ingin diskusi proyek.");

  const footerLinksMap = {
    EN: [
      { name: "Home", href: "#hero-section" },
      { name: "Work", href: "#projects" },
      { name: "Studio", href: "#philosophy" },
      { name: "Process", href: "#services" },
      { name: "Gallery", href: "#hero-section" },
    ],
    ID: [
      { name: "Beranda", href: "#hero-section" },
      { name: "Karya", href: "#projects" },
      { name: "Studio", href: "#philosophy" },
      { name: "Proses", href: "#services" },
      { name: "Galeri", href: "#hero-section" },
    ]
  };

  const footerLinks = footerLinksMap[language];

  return (
    <footer
      id="reverie-footer"
      className="w-full relative z-50 bg-[#FCFAF6] text-[#0B2240] py-20 px-6 md:px-12 lg:px-20 overflow-hidden border-t border-[#0B2240]/10 flex flex-col justify-between"
    >
      {/* Rich, high-precision technical vector architectural blueprint backdrop */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden opacity-[0.32] md:opacity-[0.38]" aria-hidden="true">
        <div className="absolute bottom-0 right-[-5%] md:right-0 w-[120%] md:w-[75%] h-[80%] md:h-[95%]">
          <Image src={data.footerImage || "/cad-footer-bg.png"} alt="CAD Background" fill className="object-cover md:object-contain object-left-bottom md:object-right-bottom opacity-[0.5] mix-blend-multiply" />
        </div>
      </div>

      {/* Outer Layout wrapper to align structure perfectly and matching other sections */}
      <div className="max-w-6xl mx-auto w-full z-10 relative flex-1 flex flex-col justify-between h-full gap-16 md:gap-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT AREA: High-end sentence case heading following screenshot exactly */}
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-8 md:gap-10">
            <h2 className="font-serif text-[40px] md:text-[56px] leading-[1.08] text-[#0B2240] tracking-tight selection:bg-[#A4855C]/20 text-left">
              {parseDualLanguage(
                data.footerTitle,
                language,
                language === "ID" ? "Wujudkan visi Anda sekarang." : "Bring your vision to life now."
              ).split('.').map((part, index, arr) => 
                index === arr.length - 1 ? (
                  <span key={index}>{part}</span>
                ) : (
                  <React.Fragment key={index}>
                    {part}<span className="text-[#FF633E] font-serif font-medium ml-1">.</span>
                  </React.Fragment>
                )
              )}
            </h2>

            <p className="font-sans text-[13px] text-[#0B2240]/70 max-w-sm mt-[-1rem] leading-relaxed">
              {parseDualLanguage(
                data.footerDesc,
                language,
                language === "ID" 
                  ? "Kami siap mendengarkan. Diskusikan ide awal Anda bersama tim arsitek kami." 
                  : "We are ready to listen. Discuss your initial ideas with our architectural team."
              )}
            </p>

            {/* Highly finished button: follows RUKA's standard dark pill style with accent colors */}
            <a
              href={`https://wa.me/${whatsappNumberVal}?text=${encodeURIComponent(whatsappMessageVal)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 bg-black hover:bg-[#A4855C] text-white px-7 py-3 rounded-none transition-all duration-300 transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(11,34,64,0.12)] border border-[#0B2240]/10"
            >
              <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
                {parseDualLanguage(
                  data.footerButton,
                  language,
                  language === "ID" ? "Diskusikan Bersama Kami" : "Discuss With Us"
                )}
              </span>
              <span className="text-xs font-sans font-normal border-l border-white/20 pl-3.5 group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </a>
          </div>

          {/* RIGHT AREA: Vertical clean menu navigation hierarchy beautifully aligned with Ruka styles */}
          <div className="lg:col-span-5 flex flex-col lg:items-end w-full lg:text-right gap-4 lg:self-end">
            <div className="text-[#A4855C] font-mono text-[9px] tracking-[0.25em] uppercase border-b border-[#0B2240]/10 pb-2.5 w-full lg:max-w-[180px] mb-2 font-semibold">
              INDEX
            </div>
            <ul className="flex flex-col gap-3.5 uppercase font-mono text-[10.5px] font-bold tracking-[0.22em] text-[#0B2240]/75">
              {footerLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-[#A4855C] transition-colors duration-300 select-none pb-0.5 border-b border-transparent hover:border-[#A4855C]/30"
                  >
                    // {item.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-[#A4855C] transition-colors duration-300 select-none pb-0.5 border-b border-transparent hover:border-[#A4855C]/30 uppercase text-left"
                >
                  // BACK TO TOP
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* LOWER ALIGNED STRIP: Aligned perfectly with other pages */}
        <div className="border-t border-[#0B2240]/10 pt-10 mt-6 w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-end">
          
          {/* Left: Social & Email info */}
          <div className="flex flex-col items-center md:items-start gap-3 font-mono text-[9px] text-[#0B2240]/60 tracking-[0.18em] uppercase text-center md:text-left">
            <a 
              href={instagramVal} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#A4855C] transition-colors duration-300 font-bold"
            >
              INSTAGRAM
            </a>
            <a 
              href={linkedinVal} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#A4855C] transition-colors duration-300 font-bold"
            >
              LINKEDIN
            </a>
            <div className="mt-1 flex flex-col md:flex-row items-center gap-1 font-mono text-[9px] text-[#0B2240]/60 uppercase">
              <span>EMAIL :</span>
              <a 
                href={`mailto:${emailVal}`} 
                className="text-[#A4855C] font-bold hover:text-[#0B2240] transition-colors duration-300 normal-case tracking-[0.1em]"
              >
                {emailVal}
              </a>
            </div>
          </div>

          {/* Right: Copyright stamp */}
          <div className="font-mono text-[9px] text-[#0B2240]/40 tracking-wider text-center md:text-right select-none leading-relaxed flex flex-col items-center md:items-end gap-1.5">
            <span>© {currentYear} RUKA STUDIO. ALL RIGHTS RESERVED.</span>
            <span className="text-[#A4855C]/75 font-semibold">DIGITAL ARCHITECTURAL CAD PLAN S-04 // ID72a9</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
