"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Asset URLs
export const PORTAL_BG = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779974947/portal_bg_mu60k9.png';
export const CURTAIN_LEFT = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/curtain_left_cdht6q.png';
export const CURTAIN_RIGHT = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975071/curtain_right_a9bn3i.png';
export const WORLD_BG = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1080&q=80';

export interface BackgroundOption {
  id: string;
  nameEN: string;
  nameID: string;
  url: string;
}

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'cliffside-night',
    nameEN: 'Cliffside Night Sanctuary',
    nameID: 'Kubah Malam Tebing',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1080&q=80',
  },
  {
    id: 'olive-pavilion',
    nameEN: 'Warm Olive Pavilion',
    nameID: 'Paviliun Zaitun Hangat',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80',
  },
  {
    id: 'cycladic-oasis',
    nameEN: 'Cycladic Ocean Oasis',
    nameID: 'Oasis Samudra Cycladic',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1080&q=80',
  },
  {
    id: 'wabi-lounge',
    nameEN: 'Wabi-Sabi Atelier Lounge',
    nameID: 'Lounge Studio Wabi-Sabi',
    url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1080&q=80',
  }
];

export const CARD_IMAGES = [
  'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/card_3_nbwm25.jpg',
  'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/card_2_wr6al6.jpg', // Representing Card 1
  'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/card_1_jz8otj.jpg', // Representing Card 2
];

// Parallax Magnitudes
export const MAG = {
  world: 6,
  portal: 7,
  curtainL: 14,
  curtainR: 14,
};

export interface ScrollAndMouseState {
  scrollProgress: number; // 0 to 1
  rx: number; // smoothly interpolated -1 to 1 (cursor X)
  ry: number; // smoothly interpolated -1 to 1 (cursor Y)
}
