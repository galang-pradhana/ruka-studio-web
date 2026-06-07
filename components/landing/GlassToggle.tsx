"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SupportedLanguages } from './translations';

interface GlassToggleProps {
  value: SupportedLanguages;
  onChange: (value: SupportedLanguages) => void;
  size?: 'sm' | 'md';
  isLightBg?: boolean;
}

export default function GlassToggle({ value, onChange, size = 'md', isLightBg = false }: GlassToggleProps) {
  const isID = value === 'ID';

  // Sizing styles
  const containerWidth = size === 'sm' ? '70px' : '82px';
  const containerHeight = size === 'sm' ? '28px' : '32px';
  const sliderWidth = size === 'sm' ? '33px' : '39px';
  const sliderHeight = size === 'sm' ? '22px' : '26px';
  const sliderOffsetLeft = size === 'sm' ? '2px' : '3px';
  const sliderOffsetRight = size === 'sm' ? 'calc(100% - 35px)' : 'calc(100% - 42px)';
  const fontSize = size === 'sm' ? '9px' : '10px';

  return (
    <div
      id="language-glass-toggle"
      className="relative flex items-center cursor-pointer select-none overflow-hidden transition-all duration-300"
      style={{
        width: containerWidth,
        height: containerHeight,
        borderRadius: '0px',
        backgroundColor: isLightBg ? 'rgba(11, 34, 64, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isLightBg ? '1px solid rgba(11, 34, 64, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isLightBg ? 'inset 0 1px 2px rgba(11, 34, 64, 0.05)' : 'inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 4px 15px rgba(0, 0, 0, 0.2)',
      }}
      onClick={() => onChange(isID ? 'EN' : 'ID')}
    >
      {/* Premium Glass Slider Circle/Capsule (the golden glowing sphere) */}
      <div
        className="absolute top-[2px] bottom-[2px] transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1)"
        style={{
          width: sliderWidth,
          height: sliderHeight,
          left: isID ? sliderOffsetRight : sliderOffsetLeft,
          borderRadius: '0px',
          background: isLightBg 
            ? 'linear-gradient(135deg, rgba(164, 133, 92, 0.3) 0%, rgba(11, 34, 64, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(197, 168, 128, 0.35) 0%, rgba(138, 123, 110, 0.15) 100%)',
          border: isLightBg ? '1px solid rgba(164, 133, 92, 0.45)' : '1px solid rgba(197, 168, 128, 0.55)',
          boxShadow: isLightBg 
            ? '0 0 10px rgba(164, 133, 92, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)' 
            : '0 0 12px rgba(197, 168, 128, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Slider Inner Glow Overlay (resembling the glossy reflection) */}
      <div
        className="absolute top-[3px] transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1) opacity-60 pointer-events-none"
        style={{
          width: `calc(${sliderWidth} - 6px)`,
          height: '6px',
          left: isID ? `calc(${sliderOffsetRight} + 3px)` : `calc(${sliderOffsetLeft} + 3px)`,
          borderRadius: '0px',
          background: isLightBg ? 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, transparent 100%)' : 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 100%)',
        }}
      />

      {/* Language Labels */}
      <div className="absolute inset-0 flex items-center justify-between px-3 w-full h-full pointer-events-none z-10 font-mono tracking-widest font-semibold">
        <span
          className="transition-colors duration-300 select-none text-center flex-1"
          style={{
            fontSize,
            color: !isID 
              ? (isLightBg ? '#0B2240' : '#ffffff') 
              : (isLightBg ? 'rgba(11, 34, 64, 0.35)' : 'rgba(255, 255, 255, 0.35)'),
            textShadow: (!isID && !isLightBg) ? '0 1px 4px rgba(197, 168, 128, 0.5)' : 'none',
          }}
        >
          EN
        </span>
        <span
          className="transition-colors duration-300 select-none text-center flex-1"
          style={{
            fontSize,
            color: isID 
              ? (isLightBg ? '#0B2240' : '#ffffff') 
              : (isLightBg ? 'rgba(11, 34, 64, 0.35)' : 'rgba(255, 255, 255, 0.35)'),
            textShadow: (isID && !isLightBg) ? '0 1px 4px rgba(197, 168, 128, 0.5)' : 'none',
          }}
        >
          ID
        </span>
      </div>
    </div>
  );
}
