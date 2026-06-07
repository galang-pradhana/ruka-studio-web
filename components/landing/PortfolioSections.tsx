"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Activity, 
  Mail, 
  Phone, 
  Send,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Calendar
} from 'lucide-react';
import { BACKGROUNDS } from './types';
import { SupportedLanguages } from './translations';
import { ProcessStackedCards } from './process-stacked-cards';
import { ParallaxPortfolio } from './parallax-portfolio';
interface PortfolioSectionsProps {
  scrollProgress: number;
  lang: SupportedLanguages;
  activeBgIndex: number;
  onBgChange: (index: number) => void;
}

export default function PortfolioSections({ scrollProgress, lang, activeBgIndex, onBgChange }: PortfolioSectionsProps) {
  // Localization dictionaries specifically for the 5 sub-sections
  const content = {
    EN: {
      philosophy: {
        title: "PHILOSOPHY",
        subtitle: "MATERIAL AND SILENCE",
        para1: "At RUKA STUDIO, we design architecture that doesn't scream for attention. We construct spaces based on visual reduction, weight, and light, crafting environments that allow the mind to decelerate.",
        para2: "Our projects respond straight to geography. Instead of bulldozing extreme, steep elevations, we stitch board-formed concrete monoliths directly into cliff faces, celebrating nature's stubborn vertical rises.",
        matTitle: "ELEMENTAL DIALOGUE",
        materials: [
          { name: "Board-Formed Concrete", desc: "Left raw and textured to record the fluid motion of timber grains." },
          { name: "Hand-Cracked Basalt", desc: "Locally sourced volcanic stones carrying historic geologic weights." },
          { name: "Atmospheric Silence", desc: "Intentional void structures designed to echo acoustic winds and soft lights." }
        ]
      },
      services: {
        title: "SERVICES",
        subtitle: "SPATIAL RECONSTRUCT",
        intro: "Crafting bespoke residential systems in complex topographies necessitates rigorous engineering alongside design sensuality. We specialize in transforming hostile terrains into exquisite residential refuges.",
        cards: [
          {
            num: "01",
            name: "Architectural Massing",
            desc: "Custom structural schematics and wind-dynamic models designed strictly for high-angle exposures."
          },
          {
            num: "02",
            name: "Elevation Engineering",
            desc: "Advanced subterranean piling, cantilever calculations, and rock anchoring methodologies."
          },
          {
            num: "03",
            name: "Landscape Synectics",
            desc: "Flawless integration of mountain natural rock faces, waterfall corridors, and local flora paths."
          },
          {
            num: "04",
            name: "Precision Sourcing",
            desc: "Securing architectural metals, bespoke glass joineries, and ancient volcanic basalt stone lineages."
          }
        ]
      },
      projects: {
        title: "PORTFOLIO",
        subtitle: "SELECT MONOLITHS",
        clickTip: "Click to focus world oculus backdrop",
        details: "Explore",
        specs: {
          year: "Year",
          area: "Area",
          type: "Type"
        }
      },
      journal: {
        title: "JOURNAL",
        subtitle: "SIGHT & CRITIQUE",
        readTime: "6 Min Read",
        articles: [
          {
            date: "May 2026",
            title: "Designing the Slope: Living at 45 Degrees",
            desc: "How we balance structural shear and visual levity when floating heavy basalt slabs on Indonesian cliff angles."
          },
          {
            date: "March 2026",
            title: "Honesty in Board-Formed Concrete",
            desc: "A reflection on leaving formwork raw—embracing air sockets, curing stains, and timber knots as structural tapestries."
          },
          {
            date: "Jan 2026",
            title: "The Architecture of Whispering Water",
            desc: "Configuring natural water runoff channels as acoustic cooling agents instead of hiding them behind synthetic drains."
          }
        ]
      },
      contact: {
        title: "PATRON INQUIRY",
        subtitle: "FORM THE INCEPTION",
        instructions: "Our studio accepts a highly limited number of custom commissions each year. Connect with our principal architect to discuss your elevation.",
        form: {
          name: "Your Name / Institution",
          email: "Secured Email Address",
          topo: "Elevation Complexity",
          topoG: "Gentle (0° - 15°)",
          topoS: "Steep (15° - 35°)",
          topoE: "Extreme Cliffside (35°+)",
          message: "Describe your prospective space...",
          submit: "Transmit Briefcase",
          success: "Inquiry Transmitted Successfully. We will contact you via secure channel within three cycles."
        },
        addressTitle: "STUDIO CHAMBERS",
        studios: [
          { city: "LOMBOK CHAMBER", street: "Jl. Bukit Senggigi No. 84", region: "Lombok, NTB" },
          { city: "BANDUNG ARCHIVE", street: "Jl. Bukit Pakar Timur No. 12", region: "Dago, Bandung" }
        ]
      }
    },
    ID: {
      philosophy: {
        title: "FILOSOFI",
        subtitle: "MATERIAL & KEHENINGAN",
        para1: "Di RUKA STUDIO, kami merancang arsitektur yang tidak berteriak mencari perhatian. Kami membangun ruang berdasarkan reduksi visual, bobot, dan cahaya, menciptakan atmosfer yang meredakan kebisingan pikiran.",
        para2: "Setiap karya kami merespons topografi secara jujur. Daripada meratakan tanah tebing yang ekstrem, kami menanam monolit beton langsung ke lereng terjal, menghormati kenaikan vertikal alam yang kukuh.",
        matTitle: "DIALOG ELEMENTAL",
        materials: [
          { name: "Beton Cetak Kayu (Board-Formed)", desc: "Dibiarkan mentah dan bertekstur demi mengabadikan serat kayu cetakan." },
          { name: "Batu Basalt Belahan Tangan", desc: "Batu vulkanis lokal yang membawa karakteristik geologis bumi yang masif." },
          { name: "Keheningan Spasial", desc: "Rancangan rongga yang sengaja diciptakan untuk memantulkan hembusan angin dan gradasi cahaya." }
        ]
      },
      services: {
        title: "LAYANAN",
        subtitle: "REKONSTRUKSI RUANG",
        intro: "Menciptakan hunian peristirahatan mewah pada topografi yang kompleks menuntut presisi rekayasa teknik di samping sensitivitas estetika. Kami ahli mengubah lanskap menantang menjadi tempat berteduh ideal.",
        cards: [
          {
            num: "01",
            name: "Massa Arsitektur",
            desc: "Pemodelan skematik struktural dan simulasi angin dinamis khusus untuk paparan sudut curam."
          },
          {
            num: "02",
            name: "Rekayasa Ketinggian",
            desc: "Metode pemancangan bawah tanah canggih, kalkulasi kantilever masif, dan penjangkaran bebatuan."
          },
          {
            num: "03",
            name: "Sinetika Lanskap",
            desc: "Penyatuan sempurna dinding batu lereng alami, celah air mandiri, dan integrasi tanaman musiman."
          },
          {
            num: "04",
            name: "Rantai Pasok Presisi",
            desc: "Pengadaan logam arsitektural khusus, kusen kaca premium, hingga seleksi ketat tambang basalt kuno."
          }
        ]
      },
      projects: {
        title: "PORTOFOLIO",
        subtitle: "MONOLIT PILIHAN",
        clickTip: "Klik kartu untuk menaruh oculus dunia pada latar",
        details: "Eksplorasi",
        specs: {
          year: "Tahun",
          area: "Luas",
          type: "Tipe"
        }
      },
      journal: {
        title: "JURNAL",
        subtitle: "PANDANGAN & KRITIK",
        readTime: "Baca 6 Menit",
        articles: [
          {
            date: "Mei 2026",
            title: "Merancang pada Kemiringan: Hidup di 45 Derajat",
            desc: "Bagaimana kami menyeimbangkan geser struktural dan estetika melayang kala menyusun pelat basalt di tebing Indonesia."
          },
          {
            date: "Maret 2026",
            title: "Kejujuran Konstruksi Beton Ekspos",
            desc: "Perenungan mendalam tentang membiarkan permukaan beton murni dengan jejak kayu cetak, semen mengembun, dan gradasi alami."
          },
          {
            date: "Jan 2026",
            title: "Arsitektur Desis Air yang Menenangkan",
            desc: "Mengonfigurasi saluran air hujan tebing sebagai pemecah suara bising sekitar sekaligus penyejuk alami ruang dalam."
          }
        ]
      },
      contact: {
        title: "PERTANYAAN PATRON",
        subtitle: "AWALI INSEPSI",
        instructions: "Studio kami hanya menerima komisi terbatas setiap tahun demi dedikasi penuh. Hubungi arsitek prinsipal kami untuk mendiskusikan lahan Anda.",
        form: {
          name: "Nama Lengkap / Instansi",
          email: "Alamat Surel Terenkripsi",
          topo: "Tingkat Kompleksitas Lahan",
          topoG: "Landai (0° - 15°)",
          topoS: "Curam (15° - 35°)",
          topoE: "Tebing Ekstrem (35°+)",
          message: "Gambarkan visi ruang Anda...",
          submit: "Kirim Ringkasan",
          success: "Pesan Berhasil Terkirim. Kami akan menghubungi Anda melalui saluran pribadi dalam tiga siklus kerja."
        },
        addressTitle: "KANTOR STUDIO",
        studios: [
          { city: "STUDIO LOMBOK", street: "Jl. Bukit Senggigi No. 84", region: "Lombok, NTB" },
          { city: "ARSIP BANDUNG", street: "Jl. Bukit Pakar Timur No. 12", region: "Dago, Bandung" }
        ]
      }
    }
  };

  const t = content[lang];

  // Form Submission handles
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTopo, setFormTopo] = useState('steep');
  const [formMsg, setFormMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormMsg('');
    }, 4000);
  };

  return (
    <div id="portfolio-scrollable-sections" className="w-full flex flex-col relative z-30">
      
      {/* 1. PHILOSOPHY SECTION */}
      <section
        id="philosophy"
        className="w-full min-h-screen flex items-center justify-center px-6 md:px-12 py-24 select-none relative bg-[#FCFAF6] text-[#0B2240]"
      >
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          {/* Left Description column */}
          <div className="md:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#0B2240]/80 uppercase flex items-center gap-2">
                <Compass className="w-4 h-4 animate-spin-slow text-[#0B2240]" /> {t.philosophy.title}
              </span>
              <h2 className="font-serif text-[28px] md:text-[46px] leading-[1.1] text-[#0B2240] uppercase tracking-normal">
                {t.philosophy.subtitle}
              </h2>
            </div>
            <p className="font-sans text-[13px] md:text-[15px] text-[#0B2240]/85 leading-relaxed">
              {t.philosophy.para1}
            </p>
            <p className="font-sans text-[13px] md:text-[15px] text-[#0B2240]/65 leading-relaxed">
              {t.philosophy.para2}
            </p>
          </div>

          {/* Right materials layout card */}
          <div className="md:col-span-6 bg-white/95 border border-[#0B2240]/10 shadow-[0_12px_40px_rgba(11,34,64,0.06)] p-6 md:p-8 rounded-none space-y-6">
            <h3 className="font-serif text-[13px] text-[#0B2240] tracking-widest uppercase border-b border-[#0B2240]/10 pb-3 flex items-center justify-between text-left">
              <span>{t.philosophy.matTitle}</span>
              <span className="font-mono text-[9px] text-[#0B2240]/40">01 / L</span>
            </h3>
            <div className="space-y-5 text-left">
              {t.philosophy.materials.map((mat, i) => (
                <div key={i} className="group flex gap-4">
                  <span className="font-mono text-[11px] text-[#A4855C] font-bold mt-0.5">
                    // 0{i + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-sans font-medium text-[13px] md:text-[14px] text-[#0B2240] transition-colors duration-300 group-hover:text-[#A4855C]">
                      {mat.name}
                    </h4>
                    <p className="font-sans text-[11px] md:text-[12px] text-[#0B2240]/65 leading-relaxed">
                      {mat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section
        id="services"
        className="w-full min-h-screen flex items-center justify-center px-6 md:px-12 py-24 select-none relative bg-[#FCFAF6] text-[#0B2240]"
      >
        <div className="max-w-6xl w-full flex flex-col gap-8 md:gap-12">
          <div className="text-center md:text-left max-w-3xl space-y-3">
            <span className="text-[11px] font-mono tracking-[0.2em] text-[#A4855C] uppercase flex items-center justify-center md:justify-start gap-2">
              <Layers className="w-4 h-4" /> {t.services.title}
            </span>
            <h2 className="font-serif text-[28px] md:text-[46px] leading-[1.1] text-[#0B2240] uppercase tracking-normal">
              {t.services.subtitle}
            </h2>
            <p className="font-sans text-[13px] md:text-[15px] text-[#0B2240]/85 leading-relaxed max-w-[580px]">
              {t.services.intro}
            </p>
          </div>

          {/* 6-Stage Process Animated Stacked Cards */}
          <div className="w-full mt-8">
            <ProcessStackedCards />
          </div>
        </div>
      </section>

      {/* 3. PROJECTS SECTION */}
      <section
        id="projects"
        className="w-full select-none relative bg-[#FCFAF6] text-[#0B2240]"
      >
        <ParallaxPortfolio />
      </section>

    </div>
  );
}


