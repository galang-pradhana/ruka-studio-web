"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { z } from "zod";

const expenseSchema = z.object({
  projectId: z.string().uuid(),
  category: z.enum(["TRANSPORT", "PRINT", "SOFTWARE", "MATERIAL", "LABOR", "EQUIPMENT", "OTHER"]),
  description: z.string().min(3, "Deskripsi terlalu pendek"),
  amount: z.number().min(0, "Nominal tidak boleh negatif"),
  expenseDate: z.string().datetime(),
});

export async function addExpense(data: {
  projectId: string;
  category: "TRANSPORT" | "PRINT" | "SOFTWARE" | "MATERIAL" | "LABOR" | "EQUIPMENT" | "OTHER";
  description: string;
  amount: number;
  expenseDate: string;
}) {
  try {
    const validatedData = expenseSchema.parse(data);

    const session = await auth();
    const createdBy = session?.user?.id;

    if (!createdBy) {
      throw new Error("Unauthorized: No active session");
    }

    const expense = await prisma.projectExpense.create({
      data: {
        projectId: validatedData.projectId,
        category: validatedData.category,
        description: validatedData.description,
        amount: validatedData.amount,
        expenseDate: new Date(validatedData.expenseDate),
        createdBy: createdBy,
      },
    });

    revalidatePath(`/admin/projects/${data.projectId}`);
    return { data: expense };
  } catch (error: any) {
    return { error: error.message || "Gagal menambahkan pengeluaran" };
  }
}

export async function deleteExpense(expenseId: string, projectId: string) {
  try {
    await prisma.projectExpense.delete({
      where: { id: expenseId },
    });
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menghapus pengeluaran" };
  }
}
