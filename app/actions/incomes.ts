"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { z } from "zod";

const incomeSchema = z.object({
  projectId: z.string().uuid(),
  description: z.string().min(3, "Deskripsi terlalu pendek"),
  amount: z.number().min(0, "Nominal tidak boleh negatif"),
  incomeDate: z.string().datetime(),
});

export async function addIncome(data: {
  projectId: string;
  description: string;
  amount: number;
  incomeDate: string;
}) {
  try {
    const validatedData = incomeSchema.parse(data);

    const session = await auth();
    const createdBy = session?.user?.id;

    if (!createdBy) {
      throw new Error("Unauthorized: No active session");
    }

    const income = await prisma.projectIncome.create({
      data: {
        projectId: validatedData.projectId,
        description: validatedData.description,
        amount: validatedData.amount,
        incomeDate: new Date(validatedData.incomeDate),
        createdBy: createdBy,
      },
    });

    revalidatePath(`/admin/projects/${data.projectId}`);
    return { data: income };
  } catch (error: any) {
    return { error: error.message || "Gagal menambahkan pemasukan" };
  }
}

export async function deleteIncome(incomeId: string, projectId: string) {
  try {
    await prisma.projectIncome.delete({
      where: { id: incomeId },
    });
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menghapus pemasukan" };
  }
}
