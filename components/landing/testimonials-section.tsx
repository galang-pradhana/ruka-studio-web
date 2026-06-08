"use client";
import { TestimonialMarquee } from "@/components/ui/testimonial-marquee";
import { useLanguage } from "@/contexts/language-context";
import { parseDualLanguage } from "@/lib/content-parser";

export function TestimonialsSection({ data = {} }: { data?: Record<string, string> }) {
  const { language } = useLanguage();

  const sectionTitle = parseDualLanguage(data.sectionTitle, language, language === 'ID' ? "Klien kami bercerita." : "Client stories.");
    
  const sectionSubtitle = parseDualLanguage(data.sectionSubtitle, language, language === 'ID' ? "Kepercayaan mereka adalah standar kami." : "Their trust is our standard.");

  const sectionEyebrow = language === 'EN' ? "Testimonials" : "Testimoni";

  // Semua 4 testimonial sekarang bisa diubah dari CMS
  const testimonials = [
    {
      id: "1",
      quote: parseDualLanguage(data.client1Review, language, language === 'ID' ? "Ruka Studio benar-benar mengubah cara saya melihat proses membangun rumah. Gambar kerja mereka sangat detail — kontraktor di lapangan tidak punya alasan untuk salah." : "Ruka Studio completely changed how I view the building process. Their working drawings are incredibly detailed — contractors on site have no room for error."),
      name: parseDualLanguage(data.client1Name, language, "Budi Santoso"),
      projectType: parseDualLanguage(data.client1Role, language, language === 'ID' ? "Rumah Tinggal · Depok" : "Residential · Depok"),
      initials: (parseDualLanguage(data.client1Name, language, "Budi Santoso") || "").substring(0, 2).toUpperCase(),
    },
    {
      id: "2",
      quote: parseDualLanguage(data.client2Review, language, language === 'ID' ? "Tim Ruka hadir setiap minggu untuk pengawasan. Progres proyek tepat waktu dan kualitas bangunan sesuai spesifikasi." : "The Ruka team is present every week for supervision. Project progress is on time and building quality matches specifications."),
      name: parseDualLanguage(data.client2Name, language, "Dewi Rahayu"),
      projectType: parseDualLanguage(data.client2Role, language, language === 'ID' ? "Ruko Komersial · Bekasi" : "Commercial · Bekasi"),
      initials: (parseDualLanguage(data.client2Name, language, "Dewi Rahayu") || "").substring(0, 2).toUpperCase(),
    },
    {
      id: "3",
      quote: parseDualLanguage(data.client3Review, language, language === 'ID' ? "Konsultasi awal dengan Ruka Studio sangat membantu — saya jadi tahu mana yang prioritas, mana yang bisa dihemat tanpa mengorbankan kualitas struktural." : "Initial consultation with Ruka Studio was very helpful — I learned what to prioritize and where to save without sacrificing structural quality."),
      name: parseDualLanguage(data.client3Name, language, "Hendra Wijaya"),
      projectType: parseDualLanguage(data.client3Role, language, language === 'ID' ? "Vila · Bali" : "Villa · Bali"),
      initials: (parseDualLanguage(data.client3Name, language, "Hendra Wijaya") || "").substring(0, 2).toUpperCase(),
    },
    {
      id: "4",
      quote: parseDualLanguage(data.client4Review, language, language === 'ID' ? "Dokumen perencanaan dari Ruka lengkap dan terstruktur. Proses perizinan IMB jauh lebih mudah karena kelengkapan dokumen teknis yang mereka sediakan." : "Planning documents from Ruka are complete and structured. The permit process was much easier due to their thorough technical documentation."),
      name: parseDualLanguage(data.client4Name, language, "Sari Kusuma"),
      projectType: parseDualLanguage(data.client4Role, language, language === 'ID' ? "Gedung Kantor · Tangerang" : "Office Building · Tangerang"),
      initials: (parseDualLanguage(data.client4Name, language, "Sari Kusuma") || "").substring(0, 2).toUpperCase(),
    },
  ];

  return (
    <section
      id="testimoni"
      className="py-[120px]"
      style={{ backgroundColor: "#FCFAF6", borderTop: "1px solid rgba(10,6,8,0.06)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-14">
        {/* Section header */}
        <div className="mb-16 max-w-2xl text-center md:text-left">
          <p
            className="uppercase font-semibold mb-6"
            style={{
              fontSize: "10px",
              letterSpacing: "0.35em",
              fontFamily: "var(--font-montserrat, sans-serif)",
              color: "#A4855C",
            }}
          >
            {sectionEyebrow}
          </p>
          <h2
            className="font-bold mb-4"
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-cinzel, serif)",
              color: "#0B2240",
            }}
          >
            {sectionTitle}
          </h2>
          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              fontWeight: 400,
              fontFamily: "var(--font-montserrat, sans-serif)",
              color: "rgba(10,6,8,0.55)",
            }}
          >
            {sectionSubtitle}
          </p>
        </div>

        {/* Testimonial Marquee */}
        <div className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
          <TestimonialMarquee 
            items={testimonials.map(t => ({
              name: t.name,
              text: t.quote,
              role: t.projectType,
              // Update avatar color to match theme (gold #A4855C)
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=c5a880&color=0a0608&bold=true`
            }))} 
            variant="default"
            speed={100}
          />
        </div>
      </div>
    </section>
  );
}
