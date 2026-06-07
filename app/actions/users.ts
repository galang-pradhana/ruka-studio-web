"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["OWNER", "ADMIN", "VIEWER"]),
});

export async function getUsers() {
  try {
    const session = await auth();
    if (session?.user?.role !== "OWNER") {
      return { error: "Akses ditolak. Hanya OWNER yang dapat melihat daftar user." };
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });
    return { success: true, data: users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { error: "Gagal mengambil data user." };
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "OWNER" | "ADMIN" | "VIEWER";
}) {
  try {
    const session = await auth();
    if (session?.user?.role !== "OWNER") {
      return { error: "Akses ditolak. Hanya OWNER yang dapat membuat user baru." };
    }

    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { error: "Email sudah terdaftar." };
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
        isActive: true,
        mustChangePassword: true,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { error: "Gagal membuat user baru." };
  }
}

export async function updateUserRole(userId: string, role: "OWNER" | "ADMIN" | "VIEWER") {
  try {
    const session = await auth();
    if (session?.user?.role !== "OWNER") {
      return { error: "Akses ditolak." };
    }
    if (session?.user?.id === userId) {
      return { error: "Tidak dapat mengubah role diri sendiri." };
    }

    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Gagal mengubah role user." };
  }
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== "OWNER") {
      return { error: "Akses ditolak." };
    }
    if (session?.user?.id === userId) {
      return { error: "Tidak dapat menonaktifkan akun sendiri." };
    }

    await prisma.user.update({ where: { id: userId }, data: { isActive } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Gagal mengubah status user." };
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "OWNER") {
      return { error: "Akses ditolak." };
    }
    if (newPassword.length < 8) {
      return { error: "Password minimal 8 karakter." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash, mustChangePassword: true },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Gagal mereset password." };
  }
}
