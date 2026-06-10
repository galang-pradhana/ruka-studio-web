"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createProjectBrief(data: {
  name: string;
  email: string;
  location: string;
  propType: string;
  landSize: string;
  budget: string;
  details?: string;
}) {
  try {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: "Nama wajib diisi" };
    }
    if (!data.email || !data.email.trim()) {
      return { success: false, error: "Kontak wajib diisi" };
    }

    const brief = await prisma.projectBrief.create({
      data: {
        name: data.name,
        email: data.email,
        location: data.location,
        propType: data.propType,
        landSize: data.landSize,
        budget: data.budget,
        details: data.details || "",
      },
    });

    revalidatePath("/rs-workspace/briefs");
    return { success: true, data: brief };
  } catch (error) {
    console.error("Failed to create project brief:", error);
    return { success: false, error: "Gagal menyimpan brief ke database" };
  }
}

export async function getProjectBriefs() {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const briefs = await prisma.projectBrief.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: briefs };
  } catch (error) {
    console.error("Failed to get project briefs:", error);
    return { success: false, error: "Gagal mengambil data brief" };
  }
}

export async function deleteProjectBrief(id: string) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.projectBrief.delete({
      where: { id },
    });

    revalidatePath("/rs-workspace/briefs");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project brief:", error);
    return { success: false, error: "Gagal menghapus data brief" };
  }
}
