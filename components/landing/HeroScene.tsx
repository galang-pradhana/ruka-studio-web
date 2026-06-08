"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BACKGROUNDS } from './types';
import { clamp } from './utils';
import { SupportedLanguages, TRANSLATIONS } from './translations';
import Image from "next/image";

interface HeroSceneProps {
  scrollProgress: number;
  heroScrollProgress: number;
  lang: SupportedLanguages;
  activeBgIndex: number;
  onBgChange: (index: number) => void;
  contentMap?: Record<string, Record<string, string>>;
}

export default function HeroScene({ scrollProgress, heroScrollProgress, lang, activeBgIndex, onBgChange, contentMap }: HeroSceneProps) {
  const fallbackT = TRANSLATIONS[lang];
  const heroContent = contentMap?.HERO || {};
  
  const t = {
    ...fallbackT,
    tagline: heroContent.tagline || "",
    headline: heroContent.headline || fallbackT.heroTitle,
    subheadline: heroContent.subheadline || fallbackT.heroSubDesktop,
    viewWork: heroContent.ctaText || fallbackT.navWork,
    heroBadge: heroContent.badgeText || "",
    rightTitle: heroContent.rightTitle || "",
    rightValue: heroContent.rightValue || "",
  };

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calls
    handleResize();
    handleScroll();
    
    // Mount delay
    const timer = setTimeout(() => {
      setMounted(true);
    }, 600); // UI fades in after 600ms as per specs

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1100;
  const isDesktop = windowWidth >= 1100;
  const vh = windowHeight;

  // Hero section opacity calculations for smooth, cinematic scrolling interaction
  // Branding elements (main heading, normal descriptions, selectable cards) fade out early as the portal opens
  const brandingOpacity = clamp(1 - heroScrollProgress / 0.42, 0, 1);

  // Advanced Blueprint Details panel fades in as the oculus expands, then fades out as Section 2 (Philosophy) rolls in
  const fadeIn = clamp((heroScrollProgress - 0.36) / 0.18, 0, 1);
  const fadeOut = clamp(1 - (scrollY - (1.35 * vh)) / (0.35 * vh), 0, 1);
  const detailOpacity = fadeIn * fadeOut;

  // The master scene container fades out only as the Philosophy section scrolls up to cover the viewport
  const sceneOpacity = clamp(1 - (scrollY - (1.4 * vh)) / (0.35 * vh), 0, 1);

  // Layout-specific styling values
  let containerClasses = '';

  if (isMobile) {
    containerClasses = 'flex flex-col items-center text-center px-4 pt-16 pb-8 justify-center min-h-[90vh]';
  } else if (isTablet) {
    containerClasses = 'flex flex-col items-center text-center px-8 pt-24 pb-8 justify-center min-h-[85vh]';
  } else {
    containerClasses = 'relative w-full h-full max-w-7xl mx-auto px-12';
  }

  // Dynamic project narrative database for extreme fidelity when portals open (gb 2)
  const PROJECT_DETAILS = [
    {
      code: "01 / SLATE",
      titleEN: "Cliffside Night Sanctuary",
      titleID: "Kubah Malam Tebing",
      locationEN: "Uluwatu Cliffs, Bali",
      locationID: "Tebing Uluwatu, Bali",
      metricsEN: "Elevation: +120m | Core: Board-Formed Concrete | Year: 2024",
      metricsID: "Elevasi: +120m | Utama: Beton Ekspos | Tahun: 2024",
      descEN: "Floating heavy slate-stone and basalt slabs anchored with subterranean steel micro-piles. Built directly over extreme vertical shear drop elevations to framing stellar views.",
      descID: "Pelat batu sabak masif dan basalt yang ditopang tiang pancang baja bawah tanah. Dibangun langsung di atas lereng curam ekstrem untuk membingkai pemandangan samudra secara dramatis."
    },
    {
      code: "02 / OLIVE",
      titleEN: "Warm Olive Pavilion",
      titleID: "Paviliun Zaitun Hangat",
      locationEN: "Senggigi Heights, Lombok",
      locationID: "Bukit Senggigi, Lombok",
      metricsEN: "Elevation: +85m | Core: Volcanic Basalt & Teak | Year: 2025",
      metricsID: "Elevasi: +85m | Utama: Basalt Vulkanik & Jati | Tahun: 2025",
      descEN: "Stitched along a steep 35-degree natural ridge. Curated for cooling utilizing natural wind-corridors, open timber frames, and extensive basalt masonry that absorbs highland heat.",
      descID: "Dirajut di sepanjang punggungan bukit bersudut 35 derajat. Dibuat mendingin mandiri melalui pemanfaatan koridor angin alami, rangka jati terbuka, dan dinding batu penyerap panas."
    },
    {
      code: "03 / CYCLADIC",
      titleEN: "Cycladic Ocean Oasis",
      titleID: "Oasis Samudra Cycladic",
      locationEN: "Gianyar Coastline, Bali",
      locationID: "Pesisir Gianyar, Bali",
      metricsEN: "Elevation: +60m | Core: Raw Mortar & Teak Wood | Year: 2024",
      metricsID: "Elevasi: +60m | Utama: Mortar Semen & Jati | Tahun: 2024",
      descEN: "Vaulted monolithic curves echoing natural limestone sea hollows. Seamlessly sewn into cliffsides, featuring sky portals and dynamic water elements that dissolve inner boundaries.",
      descID: "Lengkungan monolitik yang menyerupai bentukan alami gua tebing pantai. Menempel anggun pada dinding tebing berbatu, dilengkapi dengan bukaan atap cahaya matahari."
    },
    {
      code: "04 / WABI",
      titleEN: "Wabi-Sabi Atelier Lounge",
      titleID: "Lounge Studio Wabi-Sabi",
      locationEN: "Dago Hills, Pakar Bandung",
      locationID: "Pakar Dago, Bandung",
      metricsEN: "Elevation: +180m | Core: Smoked Timber & Ash-Stone | Year: 2026",
      metricsID: "Elevasi: +180m | Utama: Kayu Asap & Abu-Abu | Tahun: 2026",
      descEN: "An acoustic atelier lounge integrated into highland mist. Stands on deep-anchored structural columns, engineered to frame shifting seasonal clouds and soft atmospheric shadow lines.",
      descID: "Lounge studio akustik yang diintegrasikan dengan kabut pegunungan. Berdiri di atas tiang penjangkar bebatuan terjal, dirancang khusus untuk membingkai gradasi bayangan alam lembut."
    }
  ];

  const currentProject = PROJECT_DETAILS[activeBgIndex];

  // Professional architectural tectonic details explaining precisely how each monolith was crafted (concise yet compelling)
  const CRAFT_DETAILS = [
    {
      notes: [
        {
          labelEN: "STRUCTURAL MASSING",
          labelID: "STRUKTUR & TEKTONIKA",
          valEN: "Cantilevered reinforced concrete floor plates anchored into volcanic basalt cliffs.",
          valID: "Kantilever pelat beton bertulang yang baji terjangkar murni ke dinding basalt vulkanik curam."
        },
        {
          labelEN: "CRAFT & CHADDING / FINISH",
          labelID: "STILISTIKA & FASAD",
          valEN: "Hand-chiseled raw slate-stone screens that replicate rugged surrounding cliff crevices.",
          valID: "Panel batu sabak pahatan tangan presisi tinggi untuk mereplikasi kontur tebing sekitar."
        },
        {
          labelEN: "BIOCLIMATIC SYSTEM",
          labelID: "SISTEM BIOMIKRO",
          valEN: "Designed with rain runoff channels cascading down raw terraces for acoustic evaporative cooling.",
          valID: "Saluran air hujan mengalir berundak pada teras semen sebagai akustik penyejuk pasif alami."
        }
      ]
    },
    {
      notes: [
        {
          labelEN: "STRUCTURAL MASSING",
          labelID: "STRUKTUR & TEKTONIKA",
          valEN: "35-degree slope steel tension anchoring preserving natural ridge soil profiles intact.",
          valID: "Penjangkaran baja tarikan tinggi pada lereng 35° menjaga integritas kontur tanah asli tetap utuh."
        },
        {
          labelEN: "CRAFT & CHADDING / FINISH",
          labelID: "STILISTIKA & FASAD",
          valEN: "Smoked teak frames coupled with coarse locally sourced volcanic basalt masonry.",
          valID: "Kerangka kayu jati asam panggang cuaca berpadu dinding komposit bebatuan basalt pegunungan."
        },
        {
          labelEN: "BIOCLIMATIC SYSTEM",
          labelID: "SISTEM BIOMIKRO",
          valEN: "Spatially ventilated timber shafts utilizing mountain ridge cross-wind corridors.",
          valID: "Sistem ventilasi celah kayu terbuka memanfaatkan limpahan tiupan angin lereng pegunungan."
        }
      ]
    },
    {
      notes: [
        {
          labelEN: "STRUCTURAL MASSING",
          labelID: "STRUKTUR & TEKTONIKA",
          valEN: "Monolithic curved arches cast in synergy with coastal marine limestone caves.",
          valID: "Kubah lengkung monolitik tanpa sambungan, dicor membingkai gua pasir kapur pantai."
        },
        {
          labelEN: "CRAFT & CHADDING / FINISH",
          labelID: "STILISTIKA & FASAD",
          valEN: "Coarse lime-mortar plastering engineered to resist corrosive maritime ocean breezes.",
          valID: "Lapisan akhir mortar kapur putih berpasir kasar anti-korosi uapan embun garam laut pantai."
        },
        {
          labelEN: "BIOCLIMATIC SYSTEM",
          labelID: "SISTEM BIOMIKRO",
          valEN: "Sky oculus lightwells channeling vertical midday rays deep into subterranean core galleries.",
          valID: "Bukaan oculus atap meneruskan pencahayaan alami matahari langsung ke pusat ruang galeri."
        }
      ]
    },
    {
      notes: [
        {
          labelEN: "STRUCTURAL MASSING",
          labelID: "STRUKTUR & TEKTONIKA",
          valEN: "Minimal-contact elevated multi-point steel pillars protecting high mountain moss layers.",
          valID: "Tiang pancang baji baja multi-titik menjaga ekosistem lapisan lumut gunung tetap asri."
        },
        {
          labelEN: "CRAFT & CHADDING / FINISH",
          labelID: "STILISTIKA & FASAD",
          valEN: "Charred cedar wood (Yakisugi technique) matching raw cast-iron brackets.",
          valID: "Fasad kayu cedar bakar teknik Yakisugi kuno berpadu siku sambungan besi cetak hitam kasar."
        },
        {
          labelEN: "BIOCLIMATIC SYSTEM",
          labelID: "SISTEM BIOMIKRO",
          valEN: "Double-glazed acoustic shields blocking highland wind forces while storing daytime solar heat.",
          valID: "Kaca ganda kedap suara peredam angin kencang pegunungan sekaligus pemerangkap kehangatan siang."
        }
      ]
    }
  ];

  const currentCraft = CRAFT_DETAILS[activeBgIndex];
  const activeTitle = lang === 'EN' ? currentProject.titleEN : currentProject.titleID;
  const activeLocation = lang === 'EN' ? currentProject.locationEN : currentProject.locationID;
  const activeMetrics = lang === 'EN' ? currentProject.metricsEN : currentProject.metricsID;
  const activeDesc = lang === 'EN' ? currentProject.descEN : currentProject.descID;

  // Cards layout logic
  // Render Card
  const renderCard = (index: number, orderLabel: string) => {
    const bg = BACKGROUNDS[index];
    const isSelected = activeBgIndex === index;
    const isHovered = hoveredCard === index;
    const name = lang === 'EN' ? bg.nameEN : bg.nameID;

    // Width adjustments for high density responsive rows
    const cardWidth = isMobile ? '128px' : '150px';
    const cardHeight = isMobile ? '128px' : '150px';

    return (
      <div
        key={index}
        id={`hero-card-${index}`}
        onClick={() => onBgChange(index)}
        className={`glass relative flex-shrink-0 group overflow-hidden transition-all duration-500 cursor-pointer ${
          isSelected 
            ? 'border border-[#A4855C] shadow-[0_0_18px_rgba(197,168,128,0.45)]' 
            : 'border border-white/10 hover:border-white/25 shadow-lg'
        }`}
        style={{
          width: cardWidth,
          height: cardHeight,
          borderRadius: '0px',
          transform: isHovered 
            ? 'translateY(-6px) scale(1.03)' 
            : 'translateY(0)',
        }}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <Image
          src={bg.url}
          alt={name}
          fill
          sizes="150px"
          className={`object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
            isSelected ? 'opacity-90 saturate-100' : 'opacity-55 group-hover:opacity-75 saturate-50'
          }`}
        />

        {/* Selected Accent Glow Square Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-2 h-2 bg-[#A4855C] animate-pulse shadow-[0_0_8px_rgba(197,168,128,0.9)] z-20" />
        )}

        {/* Index Number Badge */}
        <div className="absolute top-3 left-4 font-mono text-[9px] tracking-wider opacity-60 text-white z-20">
          {orderLabel}
        </div>

        {/* Bottom linear gradient & overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/95 via-black/45 to-transparent">
          <div className="flex flex-col gap-0.5 z-10 text-left">
            {/* Tiny aesthetic square button resembling attachment images */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className={`w-3.5 h-3.5 rounded-none flex items-center justify-center border transition-all duration-300 ${
                isSelected 
                  ? 'bg-[#A4855C]/20 border-[#A4855C]' 
                  : 'bg-white/10 border-white/20 group-hover:border-white/45'
              }`}>
                <div className={`w-1 h-1 rounded-none ${isSelected ? 'bg-[#A4855C]' : 'bg-white/50 group-hover:bg-white'}`} />
              </div>
              <span className={`text-[7px] font-mono tracking-widest uppercase transition-colors duration-350 ${
                isSelected ? 'text-[#A4855C]' : 'text-white/40 group-hover:text-white/70'
              }`}>
                {isSelected ? (lang === 'EN' ? 'ACTIVE' : 'AKTIF') : (lang === 'EN' ? 'EXPLORE' : 'JELAJAH')}
              </span>
            </div>
            
            <span className="font-serif text-[10px] sm:text-[11px] leading-tight text-white tracking-wide line-clamp-2 select-none">
              {name}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id="hero-scene"
      className="absolute inset-0 w-full h-full flex items-center justify-center transition-all bg-transparent"
      style={{
        zIndex: 30,
        opacity: mounted ? sceneOpacity : 0,
        pointerEvents: sceneOpacity > 0.05 ? 'auto' : 'none',
        // Slide upward by 20px on mount with opacity transition 0.9s ease delayed by 300ms
        transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
        transition: 'transform 0.9s ease, opacity 0.4s ease',
      }}
    >
      <div className={`${containerClasses} w-full`}>
        {/* MOBILE LAYOUT (<768px) */}
        {isMobile && (
          <div className="flex flex-col items-center justify-center gap-5 mt-4 w-full relative">
            {/* Original Mobile branding / active card (fades out as oculus zoom increases) */}
            {heroScrollProgress <= 0.45 && (
              <div 
                className="space-y-3 px-3 transition-opacity duration-300"
                style={{
                  opacity: brandingOpacity,
                  pointerEvents: brandingOpacity > 0.1 ? 'auto' : 'none'
                }}
              >
                <h1
                  id="hero-title-mobile"
                  className="font-serif text-[32px] font-normal tracking-[0.1em] leading-tight text-white uppercase"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                  {t.heroTitle}
                </h1>
                
                {/* Dynamic mobile project highlight card */}
                <div 
                  key={activeBgIndex}
                  className="glass p-3.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-none transition-all duration-500 ease-out text-center"
                >
                  <div className="font-mono text-[8px] tracking-[0.2em] text-[#A4855C] uppercase mb-0.5">
                    {currentProject.code} &nbsp;•&nbsp; {activeLocation}
                  </div>
                  <h3 className="font-serif text-[12px] text-white tracking-wider uppercase mb-1 font-semibold">
                    {activeTitle}
                  </h3>
                  <p className="font-sans text-[11px] leading-relaxed text-white/90 max-w-[270px] mx-auto pb-1">
                    {activeDesc}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Swipeable Card Row (fades out early) */}
            {heroScrollProgress <= 0.45 && (
              <div 
                className="mt-2 flex items-center justify-start gap-3.5 w-full overflow-x-auto pb-4 px-4 scrollbar-none snap-x snap-mandatory transition-opacity duration-300"
                style={{
                  opacity: brandingOpacity,
                  pointerEvents: brandingOpacity > 0.1 ? 'auto' : 'none'
                }}
              >
                <div className="flex-shrink-0 w-2" />
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="snap-center">
                    {renderCard(idx, `0${idx + 1}`)}
                  </div>
                ))}
                <div className="flex-shrink-0 w-2" />
              </div>
            )}

            {/* Mobile Blueprint Notes (fades in as oculus opens fully) */}
            {heroScrollProgress > 0.35 && (
              <div
                id="hero-blueprint-panel-mobile"
                className="glass p-4 bg-black/65 border border-white/10 rounded-none w-full max-w-[310px] mx-auto text-left space-y-3.5 absolute"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: detailOpacity,
                  pointerEvents: detailOpacity > 0.1 ? 'auto' : 'none',
                  transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
                }}
              >
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] tracking-[0.2em] text-[#A4855C] uppercase block font-bold">
                    {lang === 'EN' ? 'CONSTRUCTION BLUEPRINT' : 'RANCANGAN KONSTRUKSI'}
                  </span>
                  <h3 className="font-serif text-[13px] text-white tracking-wider uppercase font-medium">
                    {activeTitle}
                  </h3>
                </div>
                
                <div className="w-8 h-[1px] bg-[#A4855C]/50" />

                <div className="space-y-2.5">
                  {currentCraft.notes.map((note, index) => {
                    const label = lang === 'EN' ? note.labelEN : note.labelID;
                    const val = lang === 'EN' ? note.valEN : note.valID;
                    return (
                      <div key={index} className="space-y-0.5">
                        <span className="font-mono text-[8px] tracking-[0.12em] text-[#A4855C]/85 uppercase block">
                          // 0{index + 1} {label}
                        </span>
                        <p className="font-sans text-[10.5px] leading-normal text-white/95">
                          {val}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TABLET LAYOUT (768px - 1100px) */}
        {isTablet && (
          <div className="flex flex-col items-center justify-center gap-8 mt-12 w-full relative">
            {/* Original Tablet elements */}
            {heroScrollProgress <= 0.45 && (
              <div 
                className="space-y-4 px-4 w-full max-w-xl text-center transition-opacity duration-300"
                style={{
                  opacity: brandingOpacity,
                  pointerEvents: brandingOpacity > 0.1 ? 'auto' : 'none'
                }}
              >
                <h1
                  id="hero-title-tablet"
                  className="font-serif text-[44px] font-normal tracking-[0.08em] leading-none text-white uppercase"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
                >
                  {t.heroTitle}
                </h1>

                {/* Dynamic tablet project highlight card */}
                <div 
                  key={activeBgIndex}
                  className="glass p-5 bg-black/45 border border-white/5 rounded-none transition-all duration-500 text-center"
                >
                  <div className="font-mono text-[9px] tracking-[0.25em] text-[#A4855C] uppercase mb-1">
                    {currentProject.code} &nbsp;•&nbsp; {activeLocation}
                  </div>
                  <h3 className="font-serif text-[16px] text-white tracking-widest uppercase mb-2 font-medium">
                    {activeTitle}
                  </h3>
                  <p className="font-sans text-[12px] leading-relaxed text-white/85 max-w-[460px] mx-auto mb-2">
                    {activeDesc}
                  </p>
                  <div className="font-mono text-[9px] text-white/40 tracking-wider border-t border-white/5 pt-2">
                    {activeMetrics}
                  </div>
                </div>
              </div>
            )}

            {/* Tablet Card Row */}
            {heroScrollProgress <= 0.45 && (
              <div 
                className="flex items-center justify-center gap-4 mt-2 w-full px-4 overflow-x-auto pb-4 transition-opacity duration-300"
                style={{
                  opacity: brandingOpacity,
                  pointerEvents: brandingOpacity > 0.1 ? 'auto' : 'none'
                }}
              >
                {[0, 1, 2, 3].map((idx) => renderCard(idx, `0${idx + 1}`))}
              </div>
            )}

            {/* Tablet Blueprint Details (fades in as oculus opens fully) */}
            {heroScrollProgress > 0.35 && (
              <div
                id="hero-blueprint-panel-tablet"
                className="glass p-6 bg-black/55 border border-white/10 rounded-none w-full max-w-lg mx-auto text-left space-y-4 absolute"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: detailOpacity,
                  pointerEvents: detailOpacity > 0.1 ? 'auto' : 'none',
                  transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
                }}
              >
                <div className="space-y-1 text-center">
                  <span className="font-mono text-[8px] tracking-[0.2em] text-[#A4855C] uppercase font-bold">
                    {lang === 'EN' ? 'CONSTRUCTION & TECTONIC DETAILS' : 'DETIL TEKTONIKA & KONSTRUKSI'}
                  </span>
                  <h3 className="font-serif text-[17px] text-white tracking-widest uppercase font-medium">
                    {activeTitle}
                  </h3>
                </div>
                
                <div className="w-12 h-[1px] bg-[#A4855C]/50 mx-auto" />

                <div className="space-y-3 pt-1">
                  {currentCraft.notes.map((note, index) => {
                    const label = lang === 'EN' ? note.labelEN : note.labelID;
                    const val = lang === 'EN' ? note.valEN : note.valID;
                    return (
                      <div key={index} className="space-y-0.5">
                        <span className="font-mono text-[8px] tracking-[0.15em] text-[#A4855C]/85 uppercase block">
                          // 0{index + 1} / {label}
                        </span>
                        <p className="font-sans text-[11.5px] leading-relaxed text-white/95">
                          {val}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DESKTOP LAYOUT (>=1100px) */}
        {isDesktop && (
          <div className="w-full h-full relative">
            {/* Left Container with both overall theme title & the dynamic project spec list */}
            <div
              id="hero-left-container"
              className="absolute left-[80px] flex flex-col gap-5 transition-opacity duration-300"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                maxWidth: '430px',
                opacity: brandingOpacity,
                pointerEvents: brandingOpacity > 0.1 ? 'auto' : 'none',
              }}
            >
              <div className="space-y-1">
                <h1
                  id="hero-title-desktop"
                  className="font-serif text-[68px] lg:text-[76px] leading-[0.95] tracking-tight text-white uppercase"
                >
                  {t.heroTitle}
                </h1>
              </div>

              {/* Decorative line separating general branding from active focused project narrative */}
              <div className="w-full h-[1px] bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

              {/* Dynamic Project Details for focused background */}
              <div 
                key={activeBgIndex} 
                className="space-y-3.5 text-left select-none transition-all duration-500"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#A4855C] uppercase font-bold">
                      {currentProject.code}
                    </span>
                    <span className="w-1 h-[4px] bg-[#A4855C]/40 rounded-none" />
                    <span className="font-sans text-[11px] font-medium tracking-widest text-white/50 uppercase">
                      {activeLocation}
                    </span>
                  </div>
                  <h2 className="font-serif text-[22px] lg:text-[25px] text-white tracking-widest leading-snug uppercase">
                    {activeTitle}
                  </h2>
                </div>

                <p className="font-sans text-[13px] leading-relaxed text-white/75 tracking-wide max-w-[370px]">
                  {activeDesc}
                </p>

                <div className="pt-2.5 border-t border-white/5 font-mono text-[9px] text-[#A4855C]/70 tracking-widest uppercase flex items-center justify-between">
                  <span className="opacity-40 text-white">{t.specsLabel}</span>
                  <span className="font-sans font-medium text-white/50 leading-none">{activeMetrics}</span>
                </div>
              </div>
            </div>

            {/* Right Container of 4 selectable Cards */}
            <div
              id="hero-right-container"
              className="absolute right-[40px] xl:right-[60px] flex items-center gap-4 xl:gap-5 transition-opacity duration-300"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: brandingOpacity,
                pointerEvents: brandingOpacity > 0.1 ? 'auto' : 'none',
              }}
            >
              {[0, 1, 2, 3].map((idx) => renderCard(idx, `0${idx + 1}`))}
            </div>

            {/* INLINE BLUEPRINT SPEC SHEET (Fades in when image is fully open / gb 2) */}
            {heroScrollProgress > 0.35 && (
              <div
                id="hero-blueprint-panel"
                className="absolute left-[80px] bg-black/45 border border-white/10 p-7 md:p-8 space-y-6 select-none text-left"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  maxWidth: '520px',
                  opacity: detailOpacity,
                  pointerEvents: detailOpacity > 0.1 ? 'auto' : 'none',
                  transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
                }}
              >
                <div className="space-y-1">
                  <span className="font-mono text-[8.5px] tracking-[0.25em] text-[#A4855C] uppercase font-bold">
                    {lang === 'EN' ? 'TECTONICS & CONSTRUCTION NOTES' : 'CATATAN TEKTONIKA & KONSTRUKSI'}
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-[24px] text-white tracking-widest uppercase">
                      {activeTitle}
                    </h2>
                    <span className="font-mono text-[10px] text-white/40">[{currentProject.code}]</span>
                  </div>
                </div>
                
                <div className="w-16 h-[1.5px] bg-[#A4855C]/65" />

                <div className="space-y-4">
                  {currentCraft.notes.map((note, index) => {
                    const label = lang === 'EN' ? note.labelEN : note.labelID;
                    const val = lang === 'EN' ? note.valEN : note.valID;
                    return (
                      <div key={index} className="space-y-1">
                        <h4 className="font-mono text-[9px] tracking-[0.18em] text-[#A4855C]/85 uppercase">
                          // 0{index + 1} / {label}
                        </h4>
                        <p className="font-sans text-[12.5px] leading-relaxed text-white/90">
                          {val}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Slider Dots (Bottom Left/Center) */}
        <div
          id="hero-slider-indicators"
          className={`absolute flex items-center gap-3 z-40 transition-opacity duration-300 ${
            isMobile || isTablet 
              ? 'bottom-2 left-1/2 -translate-x-1/2 mt-2' 
              : 'bottom-10 left-12'
          }`}
          style={{
            opacity: brandingOpacity,
            pointerEvents: brandingOpacity > 0.1 ? 'auto' : 'none'
          }}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isActive = activeBgIndex === idx;
            return (
              <button
                key={idx}
                id={`slide-dot-${idx}`}
                onClick={() => onBgChange(idx)}
                className="h-[4px] bg-white rounded-none transition-all duration-500 ease-out hover:opacity-100 cursor-pointer outline-none focus:ring-1 focus:ring-[#A4855C]/40"
                style={{
                  width: isActive ? '28px' : '12px',
                  opacity: isActive ? 1 : 0.3,
                }}
                aria-label={`Switch to background ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Scroll Cue (Descend) - Hidden on Mobile */}
        {!isMobile && (
          <div
            id="hero-scroll-cue"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 transition-opacity duration-300"
            style={{ 
              bottom: '40px',
              opacity: brandingOpacity,
              pointerEvents: brandingOpacity > 0.1 ? 'auto' : 'none'
            }}
          >
            <span className="uppercase text-[9px] font-sans tracking-[0.3em] opacity-40 text-white select-none">
              {t.descend}
            </span>
            {/* Chevron surrounded by a sharp square border with bobUp animation */}
            <div
              id="scroll-cue-circle"
              className="w-8 h-8 rounded-none border border-white/20 flex items-center justify-center animate-bobUp backdrop-blur-[2px] transition-colors duration-300 hover:border-white/50 cursor-pointer"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight * 1.5,
                  behavior: 'smooth'
                });
              }}
            >
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                className="opacity-60"
              >
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
