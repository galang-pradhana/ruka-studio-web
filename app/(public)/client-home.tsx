"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroScene from '@/components/landing/HeroScene';
import dynamic from 'next/dynamic';

const ParallaxPortfolio = dynamic(() => import('@/components/landing/parallax-portfolio').then(m => m.ParallaxPortfolio));
const PhilosophySection = dynamic(() => import('@/components/landing/philosophy-section').then(m => m.PhilosophySection));
const AboutHeroSection = dynamic(() => import('@/components/landing/about-hero-section').then(m => m.AboutHeroSection));
const ProcessStackedCards = dynamic(() => import('@/components/landing/process-stacked-cards').then(m => m.ProcessStackedCards));
const ServicesSection = dynamic(() => import('@/components/landing/services-section').then(m => m.ServicesSection));
const WhyUsSection = dynamic(() => import('@/components/landing/why-us-section').then(m => m.WhyUsSection));
const OurTeamSection = dynamic(() => import('@/components/landing/our-team-section').then(m => m.OurTeamSection));
const TestimonialsSection = dynamic(() => import('@/components/landing/testimonials-section').then(m => m.TestimonialsSection));
const FAQSection = dynamic(() => import('@/components/landing/faq-section').then(m => m.FAQSection));
const ProjectBriefSection = dynamic(() => import('@/components/landing/project-brief-section').then(m => m.ProjectBriefSection));

import { BACKGROUNDS } from '@/components/landing/types';
import { easeInOut, lerp, clamp, useIsMobile } from '@/components/landing/utils';
import { TRANSLATIONS } from '@/components/landing/translations';
import { useLanguage } from '@/contexts/language-context';
import { LandingFooter } from '@/components/landing/footer';

export default function ClientHome({ 
  contentMap, 
  portfolioItems 
}: { 
  contentMap: Record<string, Record<string, string>>;
  portfolioItems: any[];
}) {
  const isMobile = useIsMobile();
  const { language: lang, setLanguage: setLang } = useLanguage();
  const t = TRANSLATIONS[lang];
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  // Scroll Tracking & Progress State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [curtainScrollProgress, setCurtainScrollProgress] = useState(0);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);

  // Entrance Timelines States
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);
  const [entryTransitionActive, setEntryTransitionActive] = useState(true);

  // Smooth Mouse Tracking Parallax States (interpolated rx, ry)
  const cursorTarget = useRef({ rx: 0, ry: 0 });
  const cursorCurrent = useRef({ rx: 0, ry: 0 });
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);

  useEffect(() => {
    // 1. Scroll tracking with dynamic page layout height
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      // Calculate separate scroll progress for curtains & portal oculus zoom mapping
      // Opens fully when scrolling down past 70% of the first viewpane
      const curtainProgress = clamp(scrollY / (viewportHeight * 0.7), 0, 1);
      setCurtainScrollProgress(curtainProgress);

      const heroProgress = clamp(scrollY / viewportHeight, 0, 1);
      setHeroScrollProgress(heroProgress);

      const maxScroll = documentHeight - viewportHeight;
      const progress = maxScroll > 0 ? clamp(scrollY / maxScroll, 0, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run an initial trigger
    handleScroll();

    // 2. Mouse parallax coordinates normalization (-1 to 1 relative to center)
    const handleMouseMove = (e: MouseEvent) => {
      // Disable mouse move coordinate shifts on mobile device for performance
      if (window.innerWidth < 768) {
        cursorTarget.current = { rx: 0, ry: 0 };
        return;
      }
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;

      const targetX = (clientX / width) * 2 - 1;
      const targetY = (clientY / height) * 2 - 1;

      cursorTarget.current = { rx: targetX, ry: targetY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3. Entrance animation sequence delays:
    // Curtains transition open after 100ms
    const curtainsTimer = setTimeout(() => {
      setCurtainsOpen(true);
    }, 100);

    // UI elements fade in after 600ms
    const uiTimer = setTimeout(() => {
      setUiVisible(true);
    }, 600);

    // Disable CSS transition for smooth, hardware-accelerated tracking after 2200ms
    const transitionTimer = setTimeout(() => {
      setEntryTransitionActive(false);
    }, 2200);

    // 4. Smooth requestAnimationFrame render loop ticker
    let animId: number;
    const tick = () => {
      // Lerp speed step: 0.07 to eliminate frame-rate stutter completely
      const nextRx = lerp(cursorCurrent.current.rx, cursorTarget.current.rx, 0.07);
      const nextRy = lerp(cursorCurrent.current.ry, cursorTarget.current.ry, 0.07);

      cursorCurrent.current = { rx: nextRx, ry: nextRy };
      setRx(nextRx);
      setRy(nextRy);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(curtainsTimer);
      clearTimeout(uiTimer);
      clearTimeout(transitionTimer);
      cancelAnimationFrame(animId);
    };
  }, []);

  // --- Animation Matrices Computed on Every Frame ---

  // 1. World Background (WORLD_BG) calculation (Full-bleed, sharp aesthetic, no shrinking)
  const easedHeroP = easeInOut(heroScrollProgress);
  
  // Custom scale that zooms in slightly on scroll rather than shrinking
  const worldScale = lerp(1.03, 1.10, easedHeroP);
  const worldTransform = `scale(${worldScale}) translate3d(${rx * 8}px, ${ry * 8}px, 0)`;

  // Always sharp corners
  const worldBorderRadius = '0px';

  // Ivory background behind the hero image card
  const ivoryOpacity = clamp(heroScrollProgress / 0.5, 0, 1);

  // Determine if the current screen region has a light background (e.g. scrolled into Philosophy)
  const isLightBg = scrollProgress > 0.1 || heroScrollProgress > 0.8;

  // 2. Portal Frame (PORTAL_BG) calculation
  const easedP = easeInOut(curtainScrollProgress);
  // Scale of Portal Background: lerp from 1 to 7.5
  const portalScale = lerp(1, 7.5, easedP);
  // Portal Opacity: Starts at 1, fades out fully
  const portalOpacity = clamp(1 - curtainScrollProgress / 0.8, 0, 1);
  const portalTransform = `scale(${portalScale}) translate3d(${rx * 7}px, ${ry * 7}px, 0)`;

  // 3. Curtain Left (CURTAIN_LEFT) & Curtain Right (CURTAIN_RIGHT) calculation
  // Initial shift when open: 62%, extra: up to 150% leftward shift aligned with scroll easing
  const currentBaseShift = curtainsOpen ? 62 : 0;
  const scrollShift = curtainsOpen ? easedP * 150 : 0;
  const totalShift = currentBaseShift + scrollShift;

  // Curtain scale: lerps from 1 to 1.3
  const curtainScrollScale = lerp(1, 1.3, easedP);

  const curtainLeftTransform = `translateX(calc(-${totalShift}% + ${rx * 14}px)) translateY(${ry * 14 * 0.3}px) scale(${curtainScrollScale}) translateZ(0)`;
  const curtainRightTransform = `translateX(calc(${totalShift}% + ${rx * 14}px)) translateY(${ry * 14 * 0.3}px) scale(${curtainScrollScale}) translateZ(0)`;

  // Entrance transition styling logic:
  // Smoothly animated transition on start, then instantaneous during interactive moves to avoid delay drag
  const transformTransitionValue = entryTransitionActive
    ? 'transform 2.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.5s ease-out'
    : 'opacity 0.6s ease-out';

  return (
    <div
      id="reverie-app-container"
      className="relative w-full bg-[#0a0608] select-none text-white overflow-clip min-h-screen"
    >
      {/* Fixed Background Frame */}
      <div
        id="sticky-background-frame"
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Layer 0: Ivory backdrop that fades in behind the shrinking images */}
        <div
          id="layer-ivory-backdrop"
          className="absolute inset-0 w-full h-full bg-[#FCFAF6] pointer-events-none"
          style={{
            zIndex: 4,
            opacity: ivoryOpacity,
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'opacity',
          }}
        />

        {/* Layer 1: World Background */}
        {BACKGROUNDS.map((bg, idx) => (
          <img
            key={bg.id}
            id={`layer-world-bg-${bg.id}`}
            src={bg.url}
            alt={bg.nameEN}
            referrerPolicy="no-referrer"
            loading={idx === 0 ? "eager" : "lazy"}
            fetchPriority={idx === 0 ? "high" : "low"}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{
              zIndex: 5,
              opacity: activeBgIndex === idx ? 1 : 0,
              transform: worldTransform,
              borderRadius: worldBorderRadius,
              overflow: 'hidden',
              transition: entryTransitionActive
                ? 'transform 2.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.5s ease-out'
                : 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform, opacity, border-radius',
            }}
          />
        ))}

        {/* Layer 2: Portal Gateway Frame */}
        <div
          id="layer-portal-container"
          className="absolute inset-0 w-full h-full select-none pointer-events-none"
          style={{
            zIndex: 10,
            opacity: portalOpacity,
            transform: portalTransform,
            transition: transformTransitionValue,
            transformOrigin: '52% 38%',
            willChange: 'transform, opacity',
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <mask id="portal-mask">
                <rect width="1000" height="1000" fill="white" />
                <circle cx="520" cy="380" r="180" fill="black" />
              </mask>
              <radialGradient id="concrete-gradient" cx="52%" cy="38%" r="65%">
                <stop offset="0%" stopColor="#141115" />
                <stop offset="50%" stopColor="#0a080a" />
                <stop offset="100%" stopColor="#040304" />
              </radialGradient>
            </defs>
            <rect width="1000" height="1000" fill="url(#concrete-gradient)" mask="url(#portal-mask)" />
            <circle cx="520" cy="380" r="186" fill="none" stroke="#221e24" strokeWidth="4" />
            <circle cx="520" cy="380" r="180" fill="none" stroke="#8a7b6e" strokeWidth="3" opacity="0.8" />
            <circle cx="520" cy="380" r="177" fill="none" stroke="#c5a880" strokeWidth="1.5" opacity="0.9" />
          </svg>
        </div>

        {/* Layer 3: Left Curtains Overlay */}
        <div
          id="layer-curtain-left"
          className="absolute top-0 left-0 h-full border-r border-[#8a7b6e]/20"
          style={{
            width: '51vw',
            zIndex: 20,
            transform: curtainLeftTransform,
            transformOrigin: 'right center',
            transition: transformTransitionValue,
            willChange: 'transform',
            background: 'linear-gradient(135deg, rgba(16,14,18,0.98) 0%, rgba(8,6,9,0.99) 100%)',
            boxShadow: '10px 0 30px rgba(0,0,0,0.8)',
          }}
        >
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(138,123,110,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(138,123,110,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }} />
          <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#c5a880]/30 via-[#8a7b6e]/60 to-[#c5a880]/30" />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <div className="w-[3px] h-[120px] bg-gradient-to-b from-[#c5a880] via-[#8a7b6e] to-[#c5a880] rounded-none shadow-[0_0_12px_rgba(197,168,128,0.3)]" />
            <div className="text-[9px] tracking-[0.22em] uppercase origin-center rotate-90 text-[#c5a880]/50 whitespace-nowrap select-none font-sans mt-8">
              {t.pullToOpen}
            </div>
          </div>
        </div>

        {/* Layer 4: Right Curtains Overlay */}
        <div
          id="layer-curtain-right"
          className="absolute top-0 right-0 h-full border-l border-[#8a7b6e]/20"
          style={{
            width: '51vw',
            zIndex: 20,
            transform: curtainRightTransform,
            transformOrigin: 'left center',
            transition: transformTransitionValue,
            willChange: 'transform',
            background: 'linear-gradient(225deg, rgba(16,14,18,0.98) 0%, rgba(8,6,9,0.99) 100%)',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
          }}
        >
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(138,123,110,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(138,123,110,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }} />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#c5a880]/30 via-[#8a7b6e]/60 to-[#c5a880]/30" />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <div className="w-[3px] h-[120px] bg-gradient-to-b from-[#c5a880] via-[#8a7b6e] to-[#c5a880] rounded-none shadow-[0_0_12px_rgba(197,168,128,0.3)]" />
            <div className="text-[9px] tracking-[0.22em] uppercase origin-center -rotate-90 text-[#c5a880]/50 whitespace-nowrap select-none font-sans mt-8">
              RUKA STUDIO
            </div>
          </div>
        </div>
      </div>

      <Navbar isMobile={isMobile} isVisible={uiVisible} lang={lang} onLanguageChange={setLang} isLightBg={isLightBg} />

      <div id="scroll-content-container" className="relative z-30 w-full flex flex-col">
        <section
          id="hero-section"
          className="w-full h-[220vh] relative"
        >
          <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none">
            <div className="w-full h-full pointer-events-auto flex items-center justify-center">
              <HeroScene
                scrollProgress={scrollProgress}
                heroScrollProgress={heroScrollProgress}
                lang={lang}
                activeBgIndex={activeBgIndex}
                onBgChange={setActiveBgIndex}
                contentMap={contentMap}
              />
            </div>
          </div>
        </section>

        <PhilosophySection data={contentMap?.PHILOSOPHY || {}} />

        <ParallaxPortfolio items={portfolioItems} data={contentMap?.PORTFOLIO || {}} />

        <div className="relative z-40 bg-[#FCFAF6]">
          <AboutHeroSection data={contentMap?.ABOUT_HERO || {}} />
          <ProcessStackedCards data={contentMap?.PROCESS || {}} />
          <WhyUsSection data={contentMap?.WHY_US || {}} />
          <ServicesSection data={contentMap?.SERVICE || {}} />
          <OurTeamSection data={contentMap?.OUR_TEAM || {}} />
          <TestimonialsSection data={contentMap?.TESTIMONIAL || {}} />
          <FAQSection data={contentMap?.FAQ || {}} />
          <ProjectBriefSection data={contentMap?.PROJECT_BRIEF || {}} />
        </div>
      </div>
    </div>
  );
}
