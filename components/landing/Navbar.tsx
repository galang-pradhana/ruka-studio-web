"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SupportedLanguages, TRANSLATIONS } from './translations';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  isMobile: boolean;
  isVisible: boolean; // Delayed fade-in on mount
  lang: SupportedLanguages;
  onLanguageChange: (lang: SupportedLanguages) => void;
  isLightBg?: boolean;
}

export default function Navbar({ isMobile, isVisible, lang, onLanguageChange, isLightBg = false }: NavbarProps) {
  const t = TRANSLATIONS[lang];
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    const targetId = hash === 'logo' ? 'reverie-app-container' : hash;
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setIsMenuOpen(false);
    handleAnchorClick(e, hash);
  };

  return (
    <>
      <nav
        id="reverie-navbar"
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          padding: isMobile ? '16px 20px' : '20px 48px',
          height: isMobile ? 'auto' : '88px',
          backgroundColor: 'transparent',
          borderBottom: 'none',
          color: isLightBg ? '#0B2240' : '#ffffff'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {!isMobile ? (
            // === DESKTOP LAYOUT ===
            <div className="w-full flex items-center justify-between h-12">
              
              {/* STATE A: Show RUKA STUDIO Brand logo (Only when isLightBg is FALSE, i.e., at Top section) */}
              <AnimatePresence mode="wait">
                {!isLightBg && (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex items-center justify-start flex-1"
                  >
                    <a href="#" id="nav-logo" onClick={(e) => handleAnchorClick(e, 'logo')} className="group cursor-pointer flex items-center">
                      <span className="font-sans text-[18px] font-bold tracking-[0.2em] uppercase transition-colors duration-300">
                        RUKA STUDIO
                      </span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STATE A: Center/Right-Center menu links (Only when isLightBg is FALSE) with nice padding spacer to give "some jarak yang lebih lebar" */}
              <AnimatePresence mode="wait">
                {!isLightBg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
                    className="flex items-center justify-center gap-6 font-sans font-medium uppercase text-[10.5px] tracking-[0.2em] ml-16"
                  >
                    <motion.a
                      id="nav-link-projects"
                      href="#projects"
                      onClick={(e) => handleAnchorClick(e, 'projects')}
                      className="select-none cursor-pointer flex items-center overflow-hidden py-1"
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                    >
                      {t.navWork.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          variants={{
                            rest: { rotateY: 0, color: 'rgba(255, 255, 255, 0.85)' },
                            hover: { 
                              rotateY: 360, 
                              color: '#A4855C',
                              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 } 
                            }
                          }}
                          style={{ transformStyle: "preserve-3d", transformOrigin: "center", display: "inline-block", whiteSpace: "pre" }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.a>
                    <span className="text-white/20 select-none">/</span>
                    <motion.a
                      id="nav-link-philosophy"
                      href="#philosophy"
                      onClick={(e) => handleAnchorClick(e, 'philosophy')}
                      className="select-none cursor-pointer flex items-center overflow-hidden py-1"
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                    >
                      {t.navStudio.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          variants={{
                            rest: { rotateY: 0, color: 'rgba(255, 255, 255, 0.85)' },
                            hover: { 
                              rotateY: 360, 
                              color: '#A4855C',
                              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 } 
                            }
                          }}
                          style={{ transformStyle: "preserve-3d", transformOrigin: "center", display: "inline-block", whiteSpace: "pre" }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.a>
                    <span className="text-white/20 select-none">/</span>
                    <motion.a
                      id="nav-link-services"
                      href="#services"
                      onClick={(e) => handleAnchorClick(e, 'services')}
                      className="select-none cursor-pointer flex items-center overflow-hidden py-1"
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                    >
                      {t.navProcess.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          variants={{
                            rest: { rotateY: 0, color: 'rgba(255, 255, 255, 0.85)' },
                            hover: { 
                              rotateY: 360, 
                              color: '#A4855C',
                              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 } 
                            }
                          }}
                          style={{ transformStyle: "preserve-3d", transformOrigin: "center", display: "inline-block", whiteSpace: "pre" }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.a>
                    <span className="text-white/20 select-none">/</span>
                    <motion.a
                      id="nav-link-hero"
                      href="#hero-section"
                      onClick={(e) => handleAnchorClick(e, 'hero-section')}
                      className="select-none cursor-pointer flex items-center overflow-hidden py-1"
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                    >
                      {t.navGallery.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          variants={{
                            rest: { rotateY: 0, color: 'rgba(255, 255, 255, 0.85)' },
                            hover: { 
                              rotateY: 360, 
                              color: '#A4855C',
                              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 } 
                            }
                          }}
                          style={{ transformStyle: "preserve-3d", transformOrigin: "center", display: "inline-block", whiteSpace: "pre" }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STATE A/B: CTA button + Trigger toggles based on light-bg scroll threshold */}
              <div className="flex items-center gap-4 justify-end flex-1 shrink-0">
                {isLightBg ? (
                  // STATE B: Only show GET IN TOUCH - MENU - LANG TOGGLE
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-4 shrink-0 whitespace-nowrap"
                  >
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20Ruka%20Studio"
                      className="rounded-none bg-black text-white hover:bg-[#A4855C] hover:text-[#0B2240] px-[22px] py-2.5 text-[9.5px] font-sans font-bold tracking-[0.18em] transition-all duration-300 uppercase flex items-center gap-2 border border-white/20 shadow-md transform hover:scale-[1.02]"
                    >
                      <span>{t.navContact}</span>
                      <span className="text-[12px] opacity-75">∘</span>
                    </a>
                    <button
                      onClick={() => setIsMenuOpen(true)}
                      className="rounded-none bg-[#EFECE6]/95 hover:bg-[#e4dfd5] border border-[#0B2240]/10 px-[24px] py-2.5 text-[9.5px] font-sans font-bold tracking-[0.18em] text-[#0B2240] transition-all duration-300 cursor-pointer uppercase shadow-sm hover:scale-[1.02]"
                    >
                      MENU
                    </button>
                    <button
                      onClick={() => onLanguageChange(lang === 'EN' ? 'ID' : 'EN')}
                      className={`rounded-none px-[16px] py-2.5 text-[9.5px] font-sans font-bold tracking-[0.18em] transition-all duration-300 cursor-pointer uppercase shadow-sm hover:scale-[1.02] flex items-center justify-center min-w-[50px] border ${
                        isLightBg 
                          ? 'bg-[#EFECE6]/95 hover:bg-[#e4dfd5] border-[#0B2240]/10 text-[#0B2240]' 
                          : 'bg-black hover:bg-[#A4855C] border-white/20 text-white hover:text-[#0B2240]'
                      }`}
                    >
                      {lang === 'EN' ? 'EN' : 'ID'}
                    </button>
                  </motion.div>
                ) : (
                  // STATE A: Only show GET IN TOUCH button + LANG TOGGLE
                  <div className="flex items-center gap-4 shrink-0 whitespace-nowrap">
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20Ruka%20Studio"
                      id="nav-get-in-touch"
                      className="rounded-none bg-black hover:bg-[#A4855C] hover:text-[#0B2240] px-[22px] py-2.5 text-[9.5px] font-sans font-bold tracking-[0.18em] transition-all duration-300 uppercase flex items-center gap-2 border border-white/20 select-none cursor-pointer shadow-md transform hover:scale-[1.02]"
                    >
                      <span>{t.navContact}</span>
                      <span className="text-[12px] opacity-75">∘</span>
                    </a>
                    <button
                      onClick={() => onLanguageChange(lang === 'EN' ? 'ID' : 'EN')}
                      className={`rounded-none px-[16px] py-2.5 text-[9.5px] font-sans font-bold tracking-[0.18em] transition-all duration-300 cursor-pointer uppercase shadow-sm hover:scale-[1.02] flex items-center justify-center min-w-[50px] border ${
                        isLightBg 
                          ? 'bg-[#EFECE6]/95 hover:bg-[#e4dfd5] border-[#0B2240]/10 text-[#0B2240]' 
                          : 'bg-black hover:bg-[#A4855C] border-white/20 text-white hover:text-[#0B2240]'
                      }`}
                    >
                      {lang === 'EN' ? 'EN' : 'ID'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // === MOBILE LAYOUT ===
            <div className="w-full flex items-center justify-between">
              {/* Left Brand Logo */}
              <a href="#" id="nav-logo-mobile" onClick={(e) => handleAnchorClick(e, 'logo')} className="cursor-pointer flex items-center font-sans text-[15px] tracking-[0.16em] font-bold uppercase">
                <span className={`transition-colors duration-500 ${isLightBg ? 'text-[#0B2240]' : 'text-white'}`}>
                  RUKA STUDIO
                </span>
              </a>

              {/* Right Menu & Lang Toggle capsule based on backdrop */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onLanguageChange(lang === 'EN' ? 'ID' : 'EN')}
                  className={`rounded-none px-[16px] py-2.5 text-[9.5px] font-sans font-bold tracking-[0.18em] transition-all duration-300 cursor-pointer uppercase shadow-sm flex items-center justify-center min-w-[50px] border ${
                    isLightBg 
                      ? 'bg-[#EFECE6]/95 border-[#0B2240]/10 text-[#0B2240]' 
                      : 'bg-black border-white/20 text-white'
                  }`}
                >
                  {lang === 'EN' ? 'EN' : 'ID'}
                </button>
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className={`rounded-none px-5 py-2 text-[9px] font-sans font-bold tracking-[0.16em] transition-all duration-300 cursor-pointer uppercase border ${
                    isLightBg
                      ? 'bg-[#EFECE6]/95 text-[#0B2240] border-[#0B2240]/10 hover:bg-[#e4dfd5]'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  MENU
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* === ACCORDION / FULL-SCREEN MENU OVERLAY === */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#0B2240]/98 backdrop-blur-2xl flex flex-col justify-between p-8 md:p-16 text-white"
          >
            {/* Overlay Header */}
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
              <span className="font-sans text-[16px] md:text-[18px] font-bold tracking-[0.2em] uppercase text-white select-none">
                RUKA STUDIO
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-none bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/15 px-[20px] py-2.5 text-[9.5px] font-sans font-bold tracking-[0.18em] text-white cursor-pointer uppercase flex items-center gap-2"
              >
                <span>CLOSE</span>
                <span className="text-[12px] opacity-75">✕</span>
              </button>
            </div>

            {/* Overlay Content / Interactive menu links with stunning numbers */}
            <div className="w-full max-w-7xl mx-auto my-auto flex flex-col items-start gap-8 md:gap-10">
              <div className="text-[#A4855C]/60 text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-mono border-b border-white/10 pb-2 w-full">
                SELECT DESTINATION / 导航
              </div>
              <div className="flex flex-col gap-5 md:gap-8 w-full">
                {[
                  { id: 'projects', label: t.navWork, num: '01' },
                  { id: 'philosophy', label: t.navStudio, num: '02' },
                  { id: 'services', label: t.navProcess, num: '03' },
                  { id: 'hero-section', label: t.navGallery, num: '04' },
                ].map((item) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleMenuClick(e, item.id)}
                    className="group flex items-baseline gap-4 text-left select-none cursor-pointer"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <span className="font-mono text-xs md:text-sm text-[#A4855C]/50 tracking-wider group-hover:text-[#A4855C] transition-colors duration-300">
                      {item.num} //
                    </span>
                    <div className="text-3xl md:text-5xl font-light tracking-[0.08em] uppercase flex overflow-hidden py-2" style={{ perspective: 1000 }}>
                      {item.label.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          variants={{
                            rest: { rotateY: 0, color: 'rgba(255, 255, 255, 0.9)' },
                            hover: { 
                              rotateY: 360, 
                              color: '#A4855C',
                              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 } 
                            }
                          }}
                          style={{ transformStyle: "preserve-3d", transformOrigin: "center", display: "inline-block", whiteSpace: "pre" }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Overlay Footer containing shifted EN|ID switcher */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-6 md:gap-0">
              <div className="flex flex-col items-start gap-2.5 select-none">
                <span className="text-[#A4855C]/50 text-[9px] tracking-[0.18em] uppercase font-sans">
                  SYSTEM LANGUAGE
                </span>
                <button
                  onClick={() => onLanguageChange(lang === 'EN' ? 'ID' : 'EN')}
                  className="rounded-none px-[20px] py-3 text-[11px] font-sans font-bold tracking-[0.18em] transition-all duration-300 cursor-pointer uppercase shadow-sm flex items-center justify-center min-w-[60px] border bg-black border-white/20 text-white hover:bg-[#A4855C] hover:text-[#0B2240]"
                >
                  {lang === 'EN' ? 'EN' : 'ID'}
                </button>
              </div>

              <div className="flex flex-col md:items-end gap-3 select-none w-full md:w-auto">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Ruka%20Studio"
                  className="rounded-none bg-[#A4855C] hover:bg-white text-black text-center px-7 py-3 text-[10px] font-sans font-bold tracking-[0.16em] transition-all duration-300 uppercase flex items-center justify-center gap-2"
                >
                  <span>{t.navContact}</span>
                  <span className="text-[12px] opacity-75">∘</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
