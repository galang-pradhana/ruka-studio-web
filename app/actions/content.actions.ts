"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LpSection, LpContent } from "@prisma/client";

export async function getContentBySection(section: LpSection) {
  try {
    const content = await prisma.lpContent.findMany({
      where: { section },
      orderBy: { orderIndex: 'asc' }
    });
    return { success: true, data: content };
  } catch (error) {
    console.error(`Failed to fetch content for ${section}:`, error);
    return { success: false, error: "Gagal mengambil data konten" };
  }
}

import { cache } from 'react';

export const getAllContentMap = cache(async (): Promise<{ success: true; data: Record<string, LpContent[]> } | { success: false; error: string }> => {
  try {
    const allContent = await prisma.lpContent.findMany({
      orderBy: [
        { section: 'asc' },
        { orderIndex: 'asc' }
      ]
    });
    
    // Group by section
    const contentMap = allContent.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    }, {} as Record<string, LpContent[]>);
    
    return { success: true, data: contentMap };
  } catch (error) {
    console.error("Failed to fetch all content:", error);
    return { success: false, error: "Gagal mengambil data konten" };
  }
});

// Untuk form yang mengupdate banyak key-value di satu section
export async function saveSectionContent(section: LpSection, data: Record<string, string>) {
  try {
    // Gunakan transaction untuk update/create banyak item sekaligus
    // Fetch existing records for this section
    const existingContent = await prisma.lpContent.findMany({
      where: { section },
    });
    const existingMap = new Map(existingContent.map(item => [item.key, item.id]));
    
    // Get dummy updater ID since auth is not fully hooked in CMS yet or fetch session
    const users = await prisma.user.findMany();
    const updaterId = users[0]?.id || "system";

    const operations = Object.entries(data).map(([key, value]) => {
      const existingId = existingMap.get(key);
      if (existingId) {
        return prisma.lpContent.update({
          where: { id: existingId },
          data: { value, updatedBy: updaterId },
        });
      } else {
        return prisma.lpContent.create({
          data: {
            section,
            key,
            value,
            orderIndex: 0,
            isActive: true,
            updatedBy: updaterId,
          },
        });
      }
    });

    await prisma.$transaction(operations);
    
    revalidatePath("/rs-workspace/content");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to save content for ${section}:`, error);
    return { success: false, error: "Gagal menyimpan konten" };
  }
}
