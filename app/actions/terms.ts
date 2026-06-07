"use server";

import prisma from "@/lib/prisma";
import { createTermSchema, CreateTermInput } from "@/lib/validations/project";
import { revalidatePath } from "next/cache";

export async function addProjectTerm(data: CreateTermInput) {
  try {
    const parsedData = createTermSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { error: "Data tidak valid", details: parsedData.error.flatten() };
    }

    const term = await prisma.projectTerm.create({
      data: {
        ...parsedData.data,
        status: "UNPAID",
      },
    });

    revalidatePath(`/admin/projects/${data.projectId}`);
    return { success: true, data: term };
  } catch (error) {
    console.error("Failed to add project term:", error);
    return { error: "Terjadi kesalahan saat menambahkan termin." };
  }
}

export async function updateTermStatus(termId: string, projectId: string, status: "PAID" | "UNPAID" | "OVERDUE") {
  try {
    const updateData: any = { status };
    
    if (status === "PAID") {
      updateData.paidDate = new Date();
    } else if (status === "UNPAID" || status === "OVERDUE") {
      updateData.paidDate = null;
    }

    const term = await prisma.projectTerm.update({
      where: { id: termId },
      data: updateData,
    });

    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true, data: term };
  } catch (error) {
    console.error("Failed to update term status:", error);
    return { error: "Gagal memperbarui status termin." };
  }
}
