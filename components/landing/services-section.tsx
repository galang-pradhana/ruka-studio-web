"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

interface ServiceType {
  id: string;
  title: string;
  description: string;
  imgUrl: string;
}

function ServiceItem({ 
  service, 
  index, 
  onActive,
  sectionTitle
}: { 
  service: ServiceType; 
  index: number; 
  onActive: (idx: number) => void;
  sectionTitle: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col justify-center py-20 animate-fade-in border-t border-[#0B2240]/10">
      <motion.div 
        style={{ opacity, scale }} 
        className="max-w-xl"
        onViewportEnter={() => onActive(index)}
        viewport={{ amount: 0.4 }}
      >
        <div 
          className="uppercase tracking-[0.2em] font-semibold mb-4 text-[#A4855C]"
          style={{ fontSize: "11px" }}
        >
          {service.id} — {sectionTitle}
        </div>
        <h3 
          className="font-serif mb-6 text-[#0B2240]"
          style={{ 
            fontSize: "clamp(28px, 3.5vw, 40px)", 
            letterSpacing: "0em",
            lineHeight: 1.2,
          }}
        >
          {service.title}
        </h3>
        <p 
          className="text-slate-600"
          style={{ 
            fontSize: "16px", 
            lineHeight: 1.7,
            fontFamily: "var(--font-montserrat, sans-serif)"
          }}
        >
          {service.description}
        </p>
      </motion.div>
    </div>
  );
}

export function ServicesSection({ data = {} }: { data?: Record<string, string> }) {
  const { language } = useLanguage();

  const sectionTitle = language === 'EN'
    ? (data.sectionTitleEN || "Our Services")
    : (data.sectionTitleID || data.sectionTitle || "Layanan Kami");

  const sectionDescription = 
    (language === 'EN' ? data.sectionDescriptionEN : data.sectionDescriptionID) || 
    data.sectionDescription || 
    (language === 'EN' 
      ? "From initial idea to final build, we create designs that look beautiful and work perfectly for your daily life." 
      : "Dari ide awal hingga tahap pembangunan, kami merancang hunian yang tampil indah dan berfungsi maksimal untuk keseharian Anda.");

  const services: ServiceType[] = [
    {
      id: "01",
      title: (language === 'EN' ? data.service1NameEN : data.service1NameID) || data.service1Name || (language === 'EN' ? "Concept & Direction" : "Konsep & Arahan"),
      description: (language === 'EN' ? data.service1DescEN : data.service1DescID) || data.service1Desc || (language === 'EN' ? "We shape your ideas into clear architectural plans: spaces, lines, and mood. A design built to last." : "Kami mewujudkan ide Anda ke dalam rancangan arsitektur yang nyata: tata ruang, garis, dan suasana. Desain yang bertahan melintasi waktu."),
      imgUrl: data.service1Image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
    },
    {
      id: "02",
      title: (language === 'EN' ? data.service2NameEN : data.service2NameID) || data.service2Name || (language === 'EN' ? "Spatial Organization" : "Organisasi Ruang"),
      description: (language === 'EN' ? data.service2DescEN : data.service2DescID) || data.service2Desc || (language === 'EN' ? "We map out the floor plan and refine how you move through the home. Every space is designed to feel natural and easy to use." : "Kami menyusun denah dan memastikan alur pergerakan di dalam rumah terasa nyaman. Setiap sudut dirancang agar natural dan mudah digunakan."),
      imgUrl: data.service2Image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
    },
    {
      id: "03",
      title: (language === 'EN' ? data.service3NameEN : data.service3NameID) || data.service3Name || (language === 'EN' ? "Materials & Details" : "Material & Detail"),
      description: (language === 'EN' ? data.service3DescEN : data.service3DescID) || data.service3Desc || (language === 'EN' ? "We select the right materials, lighting, and textures. These details give your home depth, character, and warmth." : "Kami memilih material, pencahayaan, dan tekstur yang tepat. Detail-detail inilah yang memberi karakter dan kehangatan pada rumah Anda."),
      imgUrl: data.service3Image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    },
    {
      id: "04",
      title: (language === 'EN' ? data.service4NameEN : data.service4NameID) || data.service4Name || (language === 'EN' ? "Execution & Supervision" : "Persiapan & Pengawasan"),
      description: (language === 'EN' ? data.service4DescEN : data.service4DescID) || data.service4Desc || (language === 'EN' ? "We manage the build, coordinate the team, and oversee the work. We keep the construction process organized and on track." : "Kami mengelola proses pembangunan, mengoordinasikan tim, dan mengawasi pekerjaan agar konstruksi berjalan lancar dan terencana."),
      imgUrl: data.service4Image || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="services" className="relative bg-background scroll-mt-24 border-t border-[#0B2240]/10">
      <div id="proses" className="absolute top-0" />
      <div className="w-full flex flex-col md:flex-row gap-0 relative">
        
        {/* Left Side - Sticky Images with AnimatePresence Crossfade */}
        <div className="hidden md:block w-1/2 relative border-r border-[#0B2240]/10">
          <div className="sticky top-0 h-screen flex items-center justify-center">
            <div className="w-full h-full relative overflow-hidden rounded-none">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeIdx}
                  src={services[activeIdx]?.imgUrl} 
                  alt={services[activeIdx]?.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
 
        {/* Right Side - Scrolling Content */}
        <div className="w-full md:w-1/2 pt-32 md:pt-40 pb-20 px-6 md:px-16 lg:px-24 xl:px-32">
          <div className="mb-16">
            <div 
              className="uppercase tracking-[0.2em] font-semibold mb-6 text-[#A4855C]"
              style={{ fontSize: "11px", fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {sectionTitle}
            </div>
            <h2 
              className="font-serif text-[#0B2240] max-w-xl"
              style={{
                fontSize: "clamp(22px, 2.5vw, 32px)",
                lineHeight: 1.4,
                letterSpacing: "0em",
              }}
            >
              {sectionDescription}
            </h2>
          </div>
          {services.map((service, idx) => (
            <ServiceItem 
              key={service.id} 
              service={service} 
              index={idx} 
              onActive={(index) => setActiveIdx(index)}
              sectionTitle={sectionTitle}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
