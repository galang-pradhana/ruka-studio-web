import { getAllContentMap } from "@/app/actions/content.actions";
import { prisma } from "@/lib/prisma";
import ClientHome from "./client-home";
import type { LpContent } from "@prisma/client";

export const metadata = {
  title: "Ruka Studio | Architecture & Interior Design",
  description: "Setiap proyek lahir dari sebuah intensi sederhana: Menciptakan ruang yang presisi, elegan, dan bertahan lama.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch dynamic content map
  const contentResult = await getAllContentMap();
  
  // Convert it into a simple Record<string, Record<string, string>>
  // where contentMap['HERO']['headline'] = "INTEGRITAS"
  const contentMap: Record<string, Record<string, string>> = {};
  if (contentResult.success && contentResult.data) {
    const data = contentResult.data as Record<string, LpContent[]>;
    Object.entries(data).forEach(([section, items]) => {
      contentMap[section] = {};
      items.forEach(item => {
        contentMap[section][item.key] = item.value;
      });
    });
  }

  // Fetch portfolio items for the parallax gallery
  const portfolioItems = await prisma.lpPortfolioItem.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <ClientHome 
      contentMap={contentMap} 
      portfolioItems={portfolioItems} 
    />
  );
}
