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
    heroSubMobile: 'High-end architectural design by RUKA STUDIO. We turn difficult cliffside terrain into custom residential homes.',
    heroSubTablet: 'Custom homes designed by RUKA STUDIO. We build high-end architecture that works with challenging cliffside terrain and natural landscapes.',
    heroSubDesktop: 'High-end architectural design by RUKA STUDIO. We build custom homes that blend seamlessly into challenging cliffside terrain and natural rock.',
    viewReel: 'View Reel',
    worldPatrons: 'World\nPatrons',
    descend: 'Descend',
    ctaTitle: 'DESIGN BEYOND HORIZONS',
    ctaParagraph: 'Custom architectural design built for difficult terrain, made for those who value modern simplicity.',
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
    heroSubMobile: 'Desain arsitektur kelas atas dari RUKA STUDIO. Kami membangun hunian elegan di lanskap yang menantang.',
    heroSubTablet: 'Desain hunian kelas atas dari RUKA STUDIO. Kami memadukan arsitektur modern dengan kontur lahan yang ekstrem dan bebatuan alam.',
    heroSubDesktop: 'Desain arsitektur kelas atas dari RUKA STUDIO. Kami membangun hunian yang menyatu dengan topografi ekstrem dan tebing bebatuan alami.',
    viewReel: 'Tonton Reel',
    worldPatrons: 'Klien\nGlobal',
    descend: 'Turun',
    ctaTitle: 'MELAMPAUI BATAS ARSITEKTUR',
    ctaParagraph: 'Desain arsitektur khusus untuk medan ekstrem, dirancang bagi Anda yang menghargai ruang hidup modern dan fungsional.',
  }
};
