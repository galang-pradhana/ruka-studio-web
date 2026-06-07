"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const projectSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string().min(1, "Judul proyek wajib diisi"),
  description: z.string().optional(),
  // imageUrl bisa kosong saat submit, validasi di form
  imageUrl: z.string().optional().default(""),
  projectType: z.string().optional(),
  orderIndex: z.coerce.number().optional().default(0),
  isActive: z.coerce.boolean().default(true),
});

export async function getProjects() {
  try {
    const projects = await prisma.lpPortfolioItem.findMany({
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Gagal mengambil data proyek" };
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.lpPortfolioItem.findUnique({
      where: { id }
    });
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return { success: false, error: "Gagal mengambil data proyek" };
  }
}

export async function saveProject(prevState: any, formData: FormData) {
  try {
    const idVal = formData.get("id") as string;
    const rawData = {
      id: idVal && idVal.trim() !== "" ? idVal : undefined,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      projectType: formData.get("projectType") as string,
      orderIndex: formData.get("orderIndex") ? parseInt(formData.get("orderIndex") as string) : 0,
      isActive: formData.get("isActive") === "true",
    };

    const validatedFields = projectSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      return {
        error: "Input tidak valid: " + Object.values(fieldErrors).flat().join(", "),
        fieldErrors,
      };
    }

    // Validasi gambar wajib ada
    if (!rawData.imageUrl || rawData.imageUrl.trim() === "") {
      return {
        error: "Foto proyek wajib diunggah sebelum menyimpan.",
        fieldErrors: { imageUrl: ["Foto proyek wajib ada"] },
      };
    }

    const data = validatedFields.data;

    if (data.id) {
      // Update existing
      await prisma.lpPortfolioItem.update({
        where: { id: data.id },
        data: {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          projectType: data.projectType,
          orderIndex: data.orderIndex,
          isActive: data.isActive,
        }
      });
    } else {
      // Create new
      await prisma.lpPortfolioItem.create({
        data: {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          projectType: data.projectType,
          orderIndex: data.orderIndex,
          isActive: data.isActive,
        }
      });
    }

    revalidatePath("/admin/projects");
    revalidatePath("/"); // Revalidate landing page
    
    return { success: true };
  } catch (error) {
    console.error("Save project error:", error);
    return { error: "Terjadi kesalahan saat menyimpan proyek" };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.lpPortfolioItem.delete({
      where: { id }
    });
    
    revalidatePath("/admin/projects");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, error: "Gagal menghapus proyek" };
  }
}
