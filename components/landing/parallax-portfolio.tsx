import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/language-context";
import { Compass } from "lucide-react";
import { parseDualLanguage } from "@/lib/content-parser";


const content = {
  EN: {
    title: "PORTFOLIO",
    subtitle: "SELECT MONOLITHS",
    scroll: "SCROLL DOWN TO EXPLORE",
    close: "CLOSE",
    projectDetail: "PROJECT DETAIL",
  },
  ID: {
    title: "PORTOFOLIO",
    subtitle: "MAHAKARYA TERPILIH",
    scroll: "GULIR KE BAWAH UNTUK MENELUSURI",
    close: "TUTUP",
    projectDetail: "DETAIL PROYEK",
  }
};

const defaultImages = [
  "https://images.unsplash.com/photo-1600607687930-cebc5a73e513?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687931-18e38e8cb504?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154166-d8897c8f7419?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566752229-250de48545e8?q=80&w=600&auto=format&fit=crop",
];

export type PortfolioItem = {
  id?: string;
  imageUrl: string;
  title?: string;
  projectType?: string | null;
  description?: string | null;
  detailImagesJson?: string | null;
};

type Props = {
  items?: PortfolioItem[];
  data?: Record<string, string>;
};

const ParallaxPortfolio = ({ items, data = {} }: Props) => {
  const { language: lang } = useLanguage();
  const t = content[lang];

  const displayTitle = parseDualLanguage(data.sectionTitle, lang, t.title);
  const displaySubtitle = parseDualLanguage(data.sectionDescription, lang, t.subtitle);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [trackWidth, setTrackWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Setup Framer Motion scroll tracker on the pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate translation distance
  const maxMove = Math.max(0, trackWidth - windowWidth);
  const translateX = useTransform(scrollYProgress, [0, 1], [0, -maxMove]);

  // Dynamic items list with loop support
  const validItems = items?.filter(item => item.imageUrl && !item.imageUrl.includes('/images/lummi')) || [];
  const sourceItems = validItems.length > 0 ? validItems : defaultImages.map((img, index) => ({
    id: `default-${index}`,
    imageUrl: img,
    title: lang === "EN" ? `MONOLITH DESIGN ${index + 1}` : `DESAIN MONOLIT ${index + 1}`,
    projectType: lang === "EN" ? "CONCEPTUAL SPACE" : "RUANG KONSEPTUAL"
  }));

  // Duplicate items to make sure the scroll track is sufficiently wide
  // We want at least 16 items in total to enable a smooth horizontal journey
  const repeatCount = Math.max(3, Math.ceil(16 / sourceItems.length));
  const displayItems = Array(repeatCount).fill(sourceItems).flat();

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth);
      }
    };

    // Use ResizeObserver to track layout changes (such as images loading or dynamic resizing)
    const resizeObserver = new ResizeObserver(() => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth);
      }
    });

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Sync scroll lock and Lenis lifecycle
  useEffect(() => {
    if (!isMounted) return;

    let lenis: Lenis | null = null;
    let rafId: number;

    if (!selectedItem) {
      // Modal closed: initialize smooth scrolling
      lenis = new Lenis();
      lenisRef.current = lenis;

      const raf = (time: number) => {
        if (lenis) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
      };
      rafId = requestAnimationFrame(raf);
      document.body.style.overflow = "";
    } else {
      // Modal open: destroy Lenis so native scrolling is restored
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
    };
  }, [selectedItem, isMounted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getDetailImages = (item: PortfolioItem): string[] => {
    if (item.detailImagesJson) {
      try {
        const urls = JSON.parse(item.detailImagesJson);
        if (Array.isArray(urls) && urls.length > 0) {
          return urls;
        }
      } catch (e) {
        console.error("Failed to parse detail images JSON:", e);
      }
    }
    return [item.imageUrl]; // fallback to main cover image
  };

  return (
    <div
      id="projects"
      ref={containerRef}
      className="relative w-full bg-[#FCFAF6] text-[#0B2240] h-[300vh] md:h-[500vh] scroll-mt-24"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-12 md:py-20 overflow-hidden">
        {/* Intro Header */}
        <div className="w-full flex flex-col items-center gap-4 text-center px-4 relative z-10">
          <span className="text-[11px] font-mono tracking-[0.2em] text-[#A4855C] uppercase flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#A4855C]" /> {displayTitle}
          </span>
          <h2 className="font-serif text-[18px] md:text-[24px] leading-[1.4] text-[#0B2240] uppercase tracking-wide max-w-3xl mx-auto text-balance">
            {displaySubtitle}
          </h2>
        </div>

        {/* Horizontal scroll track (Bottom Aligned items-end) */}
        <div className="relative w-full flex-1 flex items-end my-6 overflow-visible">
          <motion.div
            ref={trackRef}
            className="flex flex-row items-end gap-4 md:gap-6 px-10 md:px-20"
            style={{ x: translateX }}
          >
            {displayItems.map((item, i) => (
              <div
                key={`${item.id || i}-${i}`}
                onClick={() => setSelectedItem(item)}
                className="flex flex-col gap-4 items-start shrink-0 group cursor-pointer"
              >
                {/* Image Container with dynamic scaling */}
                <div className="relative overflow-hidden rounded-none bg-[#EFECE6] transition-all duration-300">
                  <img
                    src={item.imageUrl}
                    alt={parseDualLanguage(item.title || "", lang) || "Portfolio View"}
                    loading="lazy"
                    className="w-[200px] md:w-[380px] h-auto max-h-[35vh] md:max-h-[55vh] object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Labels */}
                <div className="flex flex-col gap-1 select-none">
                  <h3 className="font-serif text-[12px] md:text-[14px] leading-tight text-[#0B2240] uppercase tracking-wider">
                    {parseDualLanguage(item.title || "", lang)}
                  </h3>
                  {item.projectType && (
                    <span className="font-mono text-[9px] md:text-[10px] text-[#A4855C] tracking-widest uppercase">
                      {parseDualLanguage(item.projectType, lang)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Indicator footer */}
        <div className="w-full text-center px-4 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#A4855C]/60 uppercase">
            {t.scroll}
          </span>
        </div>
      </div>

      {isMounted && createPortal(
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              key="detail-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[9999] bg-[#FCFAF6] text-[#0B2240] overflow-y-auto h-screen w-screen"
            >
              <div className="w-full min-h-screen flex flex-col md:flex-row">
                {/* Sidebar - sticky on desktop, static on mobile */}
                <div className="w-full md:w-[40%] md:sticky md:top-0 md:h-screen p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#0B2240]/10 bg-[#FCFAF6] overflow-y-auto">
                  {/* Top bar with close button */}
                  <div className="flex justify-between items-center mb-12 md:mb-0">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#A4855C] uppercase">
                      {t.projectDetail}
                    </span>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="group flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#0B2240] hover:text-[#A4855C] transition-colors uppercase"
                    >
                      <span className="w-4 h-[1px] bg-[#0B2240] group-hover:bg-[#A4855C] transition-all" />
                      {t.close}
                    </button>
                  </div>

                  {/* Project Meta & Description */}
                  <div className="my-auto py-8 space-y-6">
                    <div className="space-y-2">
                      {selectedItem.projectType && (
                        <span className="font-mono text-[10px] text-[#A4855C] tracking-widest uppercase">
                          {parseDualLanguage(selectedItem.projectType, lang)}
                        </span>
                      )}
                      <h3 className="font-serif text-[28px] md:text-[36px] leading-tight text-[#0B2240] uppercase tracking-wide">
                        {parseDualLanguage(selectedItem.title || "", lang)}
                      </h3>
                    </div>
                    
                    <div className="w-12 h-[1px] bg-[#A4855C]" />

                    <p className="font-sans text-[14px] leading-relaxed text-[#0B2240]/80 whitespace-pre-line max-w-md">
                      {parseDualLanguage(selectedItem.description || "", lang) || 
                        (lang === "EN" 
                          ? "A curated exploration of space, materials, and form, reflecting Ruka Studio's architectural philosophy of monolith design."
                          : "Eksplorasi terkurasi dari ruang, material, dan bentuk, mencerminkan filosofi arsitektur Ruka Studio tentang desain monolit.")
                      }
                    </p>
                  </div>

                  {/* Footer branding */}
                  <div className="hidden md:block">
                    <span className="text-[9px] font-mono tracking-[0.2em] text-[#0B2240]/40 uppercase">
                      RUKA STUDIO © {new Date().getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Gallery Stack */}
                <div className="w-full md:w-[60%] p-6 md:p-16 space-y-8 md:space-y-12 overflow-y-auto bg-[#F7F4EE]">
                  {getDetailImages(selectedItem).map((imgUrl, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full bg-[#EFECE6] overflow-hidden border border-[#0B2240]/5 animate-pulse-once"
                    >
                      <img
                        src={imgUrl}
                        alt={`${parseDualLanguage(selectedItem.title || "", lang)} Detail ${index + 1}`}
                        className="w-full h-auto object-cover max-h-[85vh]"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export { ParallaxPortfolio };

