import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/footer";
import { getAllContentMap } from "@/app/actions/content.actions";
import type { LpContent } from "@prisma/client";

export const metadata: Metadata = {
  title: "Ruka Studio — Konsultan & Perencana Konstruksi",
  description:
    "Ruka Studio adalah konsultan dan perencana konstruksi profesional. Kami menyediakan gambar kerja, perencanaan detail, pengawasan lapangan, dan konsultasi proyek untuk hunian dan bangunan komersial.",
  keywords: ["konsultan konstruksi", "gambar kerja", "perencanaan konstruksi", "pengawasan lapangan", "Ruka Studio"],
  openGraph: {
    title: "Ruka Studio — Rencana Tepat. Eksekusi Presisi.",
    description:
      "Konsultan dan perencana konstruksi profesional untuk hunian dan komersial.",
    type: "website",
    locale: "id_ID",
  },
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentMapRes = await getAllContentMap();
  const contentMap = contentMapRes.success && contentMapRes.data
    ? (contentMapRes.data as Record<string, LpContent[]>)
    : {} as Record<string, LpContent[]>;

  const toMap = (sectionArray: LpContent[] | undefined) => {
    if (!sectionArray) return {};
    return sectionArray.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
  };

  const contactData = toMap(contentMap["CONTACT"]);
  const footerData = toMap(contentMap["FOOTER"]);
  const mergedData = { ...contactData, ...footerData };

  return (
    <div
      className="antialiased relative min-h-screen flex flex-col bg-[#FCFAF6] text-[#0a0608]"
    >
      {/* Global CSS Grain/Noise Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {/*
        SPA Navigation is handled fully within app/(public)/page.tsx
      */}
      <div className="relative z-10 w-full flex-1">
        {children}
      </div>
      {/* Global Footer — renders on all public pages including homepage */}
      <LandingFooter data={mergedData} />
    </div>
  );
}
