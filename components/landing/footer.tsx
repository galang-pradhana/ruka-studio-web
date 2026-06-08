"use client";
import React from 'react';
import { useLanguage } from "@/contexts/language-context";

import Image from "next/image";

export function LandingFooter({ data = {} }: { data?: Record<string, string> }) {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

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
          <Image src="/cad-footer-bg.png" alt="CAD Background" fill className="object-cover md:object-contain object-left-bottom md:object-right-bottom opacity-[0.5] mix-blend-multiply" />
        </div>
      </div>

      {/* Outer Layout wrapper to align structure perfectly and matching other sections */}
      <div className="max-w-6xl mx-auto w-full z-10 relative flex-1 flex flex-col justify-between h-full gap-16 md:gap-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT AREA: High-end sentence case heading following screenshot exactly */}
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-8 md:gap-10">
            <h2 className="font-serif text-[40px] md:text-[56px] leading-[1.08] text-[#0B2240] tracking-tight selection:bg-[#A4855C]/20 text-left">
              {language === "ID" ? (
                <>
                  Wujudkan <span className="italic font-normal text-[#0B2240]">visi Anda</span>
                  <br />
                  sekarang
                </>
              ) : (
                <>
                  Bring your <span className="italic font-normal text-[#0B2240]">vision to life</span>
                  <br />
                  now
                </>
              )}
              <span className="text-[#FF633E] font-serif font-medium ml-1">.</span>
            </h2>

            <p className="font-sans text-[13px] text-[#0B2240]/70 max-w-sm mt-[-1rem] leading-relaxed">
              {language === "ID" 
                ? "Kami siap mendengarkan. Diskusikan ide awal Anda bersama tim arsitek kami." 
                : "We are ready to listen. Discuss your initial ideas with our architectural team."}
            </p>

            {/* Highly finished button: follows RUKA's standard dark pill style with accent colors */}
            <a
              href="https://wa.me/6281234567890?text=Halo%20Ruka%20Studio,%20saya%20ingin%20diskusi%20proyek."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 bg-black hover:bg-[#A4855C] text-white px-7 py-3 rounded-none transition-all duration-300 transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(11,34,64,0.12)] border border-[#0B2240]/10"
            >
              <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
                {language === "ID" ? "Diskusikan Bersama Kami" : "Discuss With Us"}
              </span>
              <span className="text-xs font-sans font-normal border-l border-white/20 pl-3.5 group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </a>
          </div>

          {/* RIGHT AREA: Vertical clean menu navigation hierarchy beautifully aligned with Ruka styles */}
          <div className="lg:col-span-5 flex flex-col lg:items-end w-full lg:text-right gap-4">
            <div className="text-[#A4855C] font-mono text-[9px] tracking-[0.25em] uppercase border-b border-[#0B2240]/10 pb-2.5 w-full lg:max-w-[180px] mb-2 font-semibold">
              INDEX / 索引
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
        <div className="border-t border-[#0B2240]/10 pt-10 mt-6 w-full flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social linkages in high-end design */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-7 font-mono text-[9px] text-[#0B2240]/55 tracking-[0.2em] uppercase">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A4855C] transition-colors duration-300">
              INSTAGRAM
            </a>
            <span className="text-[#0B2240]/15 select-none">/</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A4855C] transition-colors duration-300">
              LINKEDIN
            </a>
            <span className="text-[#0B2240]/15 select-none">/</span>
            <a href="https://archdaily.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A4855C] transition-colors duration-300">
              ARCHDAILY
            </a>
            <span className="text-[#0B2240]/15 select-none">/</span>
            <a href="https://wa.me/6281234567890?text=Halo%20Ruka%20Studio" target="_blank" rel="noopener noreferrer" className="hover:text-[#A4855C] transition-colors duration-300">
              PATRONS OFFICE
            </a>
          </div>

          {/* Copyright stamp */}
          <div className="font-mono text-[9px] text-[#0B2240]/40 tracking-wider text-center md:text-right select-none md:max-w-xs leading-relaxed flex flex-col items-center md:items-end gap-1.5">
            <span>© {currentYear} RUKA STUDIO. ALL RIGHTS RESERVED.</span>
            <span className="text-[#A4855C]/75 font-semibold">DIGITAL ARCHITECTURAL CAD PLAN S-04 // ID72a9</span>
            <a href="/login" className="text-[#0B2240]/30 hover:text-[#A4855C] transition-colors mt-2">ADMIN AREA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
