"use server";

import prisma from "@/lib/prisma";
import { createProjectSchema, CreateProjectInput } from "@/lib/validations/project";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ProjectMode } from "@prisma/client";

export async function createProject(data: CreateProjectInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const parsedData = createProjectSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { error: "Data tidak valid", details: parsedData.error.flatten() };
    }

    const project = await prisma.project.create({
      data: {
        name: parsedData.data.name,
        clientName: parsedData.data.clientName,
        location: parsedData.data.location,
        contractValue: parsedData.data.contractValue,
        startDate: parsedData.data.startDate,
        estimatedEndDate: parsedData.data.estimatedEndDate,
        notes: parsedData.data.notes,
        mode: parsedData.data.mode as ProjectMode,
        status: "ACTIVE",
        createdBy: session.user.id,
      },
    });

    revalidatePath("/admin/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: "Terjadi kesalahan saat membuat proyek." };
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { terms: true }
        }
      }
    });

    // Serialisasi: konversi Decimal ke number
    const serialized = projects.map((p) => ({
      ...p,
      contractValue: Number(p.contractValue),
    }));

    return { success: true, data: serialized };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { error: "Gagal mengambil data proyek." };
  }
}


export async function getProjectById(id: string) {
  try {
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    if (!isUuid) {
      return { error: "Proyek tidak ditemukan" };
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        terms: {
          orderBy: { createdAt: "asc" }
        },
        expenses: {
          orderBy: { expenseDate: "desc" }
        },
        incomes: {
          orderBy: { incomeDate: "desc" }
        },
        creator: {
          select: { name: true }
        }
      }
    });

    if (!project) return { error: "Proyek tidak ditemukan" };

    // Serialisasi: konversi Prisma Decimal ke number biasa
    // agar tidak ada warning "Decimal objects cannot pass to Client Components"
    const serialized = {
      ...project,
      contractValue: Number(project.contractValue),
      terms: project.terms.map((t) => ({
        ...t,
        amount: Number(t.amount),
        percentage: t.percentage !== null ? Number(t.percentage) : null,
      })),
      incomes: project.incomes.map((i) => ({
        ...i,
        amount: Number(i.amount),
      })),
      expenses: project.expenses.map((e) => ({
        ...e,
        amount: Number(e.amount),
      })),
    };

    return { success: true, data: serialized };
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return { error: "Gagal mengambil data proyek." };
  }
}


export async function deleteProject(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    if (!isUuid) {
      return { error: "Proyek tidak ditemukan" };
    }

    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { error: "Gagal menghapus proyek." };
  }
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    clientName?: string;
    location?: string;
    contractValue?: number;
    mode?: string;
    startDate?: Date;
    estimatedEndDate?: Date;
    notes?: string;
    status?: "ACTIVE" | "COMPLETED" | "PENDING" | "CANCELLED";
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    if (!isUuid) {
      return { error: "Proyek tidak ditemukan" };
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.clientName !== undefined) updateData.clientName = data.clientName;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.contractValue !== undefined) updateData.contractValue = data.contractValue;
    if (data.mode !== undefined) updateData.mode = data.mode as any;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.estimatedEndDate !== undefined) updateData.estimatedEndDate = data.estimatedEndDate;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) updateData.status = data.status;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { error: "Gagal memperbarui proyek." };
  }
}

