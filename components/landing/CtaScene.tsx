"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SupportedLanguages, TRANSLATIONS } from './translations';

interface CtaSceneProps {
  lang: SupportedLanguages;
}

export default function CtaScene({ lang }: CtaSceneProps) {
  const t = TRANSLATIONS[lang];

  return (
    <div
      id="cta-scene"
      className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none"
      style={{
        zIndex: 32,
        opacity: 0.95,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <div className="flex flex-col items-center gap-6 max-w-3xl">
        {/* Heading: DESIGN BEYOND HORIZONS */}
        <h2
          id="cta-heading"
          className="font-serif font-normal"
          style={{
            color: '#ffffff',
            letterSpacing: '0.04em',
            lineHeight: '1.05',
            fontSize: 'clamp(38px, 8vw, 78px)',
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          }}
        >
          {t.ctaTitle}
        </h2>

        {/* Paragraph text */}
        <p
          id="cta-paragraph"
          className="font-sans leading-relaxed text-white/90 mx-auto max-w-[280px] md:max-w-[540px] text-[14px] md:text-[18px]"
          style={{
            lineHeight: '1.7',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
          }}
        >
          {t.ctaParagraph}
        </p>
      </div>
    </div>
  );
}

