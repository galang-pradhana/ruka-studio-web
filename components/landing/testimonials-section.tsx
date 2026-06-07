"use client";
import { TestimonialMarquee } from "@/components/ui/testimonial-marquee";
import { useLanguage } from "@/contexts/language-context";

export function TestimonialsSection({ data = {} }: { data?: Record<string, string> }) {
  const { language } = useLanguage();

  const sectionTitle = language === 'EN'
    ? (data.sectionTitleEN || "Client stories.")
    : (data.sectionTitleID || data.sectionTitle || "Klien kami bercerita.");
    
  const sectionSubtitle = language === 'EN'
    ? (data.sectionSubtitleEN || "Their trust is our standard.")
    : (data.sectionSubtitleID || data.sectionSubtitle || "Kepercayaan mereka adalah standar kami.");

  const sectionEyebrow = language === 'EN' ? "Testimonials" : "Testimoni";

  // Semua 4 testimonial sekarang bisa diubah dari CMS
  const testimonials = [
    {
      id: "1",
      quote: language === 'EN' ? (data.client1ReviewEN || "Ruka Studio completely changed how I view the building process. Their working drawings are incredibly detailed — contractors on site have no room for error.") : (data.client1ReviewID || data.client1Review || "Ruka Studio benar-benar mengubah cara saya melihat proses membangun rumah. Gambar kerja mereka sangat detail — kontraktor di lapangan tidak punya alasan untuk salah."),
      name: data.client1Name || "Budi Santoso",
      projectType: language === 'EN' ? (data.client1RoleEN || "Residential · Depok") : (data.client1RoleID || data.client1Role || "Rumah Tinggal · Depok"),
      initials: (data.client1Name || "Budi Santoso").substring(0, 2).toUpperCase(),
    },
    {
      id: "2",
      quote: language === 'EN' ? (data.client2ReviewEN || "The Ruka team is present every week for supervision. Project progress is on time and building quality matches specifications.") : (data.client2ReviewID || data.client2Review || "Tim Ruka hadir setiap minggu untuk pengawasan. Progres proyek tepat waktu dan kualitas bangunan sesuai spesifikasi."),
      name: data.client2Name || "Dewi Rahayu",
      projectType: language === 'EN' ? (data.client2RoleEN || "Commercial · Bekasi") : (data.client2RoleID || data.client2Role || "Ruko Komersial · Bekasi"),
      initials: (data.client2Name || "Dewi Rahayu").substring(0, 2).toUpperCase(),
    },
    {
      id: "3",
      quote: language === 'EN' ? (data.client3ReviewEN || "Initial consultation with Ruka Studio was very helpful — I learned what to prioritize and where to save without sacrificing structural quality.") : (data.client3ReviewID || data.client3Review || "Konsultasi awal dengan Ruka Studio sangat membantu — saya jadi tahu mana yang prioritas, mana yang bisa dihemat tanpa mengorbankan kualitas struktural."),
      name: data.client3Name || "Hendra Wijaya",
      projectType: language === 'EN' ? (data.client3RoleEN || "Villa · Bali") : (data.client3RoleID || data.client3Role || "Vila · Bali"),
      initials: (data.client3Name || "Hendra Wijaya").substring(0, 2).toUpperCase(),
    },
    {
      id: "4",
      quote: language === 'EN' ? (data.client4ReviewEN || "Planning documents from Ruka are complete and structured. The permit process was much easier due to their thorough technical documentation.") : (data.client4ReviewID || data.client4Review || "Dokumen perencanaan dari Ruka lengkap dan terstruktur. Proses perizinan IMB jauh lebih mudah karena kelengkapan dokumen teknis yang mereka sediakan."),
      name: data.client4Name || "Sari Kusuma",
      projectType: language === 'EN' ? (data.client4RoleEN || "Office Building · Tangerang") : (data.client4RoleID || data.client4Role || "Gedung Kantor · Tangerang"),
      initials: (data.client4Name || "Sari Kusuma").substring(0, 2).toUpperCase(),
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
