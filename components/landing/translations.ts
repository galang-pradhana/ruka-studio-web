"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationSchema {
  navWork: string;
  navStudio: string;
  navProcess: string;
  navGallery: string;
  navContact: string; // Get In Touch button
  projectBrief: string;
  locationLabel: string;
  specsLabel: string;
  pullToOpen: string;
  heroTitle: string;
  heroSubMobile: string;
  heroSubTablet: string;
  heroSubDesktop: string;
  viewReel: string;
  worldPatrons: string;
  descend: string;
  ctaTitle: string;
  ctaParagraph: string;
}

export type SupportedLanguages = 'EN' | 'ID';

export const TRANSLATIONS: Record<SupportedLanguages, TranslationSchema> = {
  EN: {
    navWork: 'Work',
    navStudio: 'Studio',
    navProcess: 'Process',
    navGallery: 'Gallery',
    navContact: 'GET IN TOUCH',
    projectBrief: 'Project Brief',
    locationLabel: 'Location',
    specsLabel: 'Specifications',
    pullToOpen: 'PULL TO OPEN',
    heroTitle: 'SHAPE › THE UNBUILT',
    heroSubMobile: 'Bespoke high-end architectural systems designed by RUKA STUDIO. We transform challenging, steep elevations into custom residential sanctuaries.',
    heroSubTablet: 'Custom residential sanctuaries created by RUKA STUDIO. We construct high-end architectural masterworks in perfect dialogue with steep elevations, cliffside terrains, and custom landscapes.',
    heroSubDesktop: 'Bespoke high-end architectural systems designed by RUKA STUDIO. We transform challenging, steep elevations into custom residential sanctuaries in perfect dialogue with natural rock.',
    viewReel: 'View Reel',
    worldPatrons: 'World\nPatrons',
    descend: 'Descend',
    ctaTitle: 'DESIGN BEYOND HORIZONS',
    ctaParagraph: 'Bespoke high-end architectural systems, engineered for challenging topographies and curated for individuals demanding modern clarity.',
  },
  ID: {
    navWork: 'Karya',
    navStudio: 'Studio',
    navProcess: 'Proses',
    navGallery: 'Galeri',
    navContact: 'KONSULTASI',
    projectBrief: 'Ringkasan Proyek',
    locationLabel: 'Lokasi',
    specsLabel: 'Spesifikasi',
    pullToOpen: 'TARIK UNTUK EKSPLORASI',
    heroTitle: 'MENCIPTAKAN › MAHA KARYA',
    heroSubMobile: 'Sistem arsitektur eksklusif dari RUKA STUDIO. Kami mentransformasikan lanskap menantang menjadi hunian ikonik.',
    heroSubTablet: 'Hunian eksklusif mahakarya RUKA STUDIO. Kami memadukan arsitektur kelas atas dengan kontur ekstrem, menciptakan harmoni sempurna dengan lanskap bebatuan alam.',
    heroSubDesktop: 'Arsitektur eksklusif yang dirancang oleh RUKA STUDIO. Kami menaklukkan topografi ekstrem dan tebing menantang menjadi hunian ikonik yang berdialog dengan alam.',
    viewReel: 'Tonton Reel',
    worldPatrons: 'Klien\nGlobal',
    descend: 'Turun',
    ctaTitle: 'MELAMPAUI BATAS ARSITEKTUR',
    ctaParagraph: 'Arsitektur eksklusif, direkayasa khusus untuk topografi menantang dan dikurasi bagi individu yang mendambakan kemewahan dalam kejernihan modern.',
  }
};
