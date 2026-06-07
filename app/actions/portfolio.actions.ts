"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPortfolioItems() {
  try {
    const items = await prisma.lpPortfolioItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: items };
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);
    return { success: false, error: "Gagal mengambil data portfolio" };
  }
}

export async function createPortfolioItem(data: { title: string; projectType?: string | null; imageUrl: string; description?: string | null }) {
  try {
    const item = await prisma.lpPortfolioItem.create({
      data: {
        ...data,
      },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
    
    return { success: true, data: item };
  } catch (error) {
    console.error("Failed to create portfolio item:", error);
    return { success: false, error: "Gagal membuat data portfolio" };
  }
}

export async function updatePortfolioItem(id: string, data: { title?: string; projectType?: string | null; imageUrl?: string; description?: string | null }) {
  try {
    const item = await prisma.lpPortfolioItem.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
    
    return { success: true, data: item };
  } catch (error) {
    console.error("Failed to update portfolio item:", error);
    return { success: false, error: "Gagal update data portfolio" };
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    await prisma.lpPortfolioItem.delete({
      where: { id },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete portfolio item:", error);
    return { success: false, error: "Gagal hapus data portfolio" };
  }
}
