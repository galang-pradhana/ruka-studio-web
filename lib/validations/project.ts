import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nama proyek wajib diisi").max(200, "Maksimal 200 karakter"),
  clientName: z.string().min(1, "Nama klien wajib diisi").max(150, "Maksimal 150 karakter"),
  location: z.string().optional(),
  contractValue: z.number().nonnegative("Nilai kontrak tidak boleh negatif").optional(),
  mode: z.enum(["CONSULTATION", "FULL_CONTRACTOR"]),
  startDate: z.date().optional(),
  estimatedEndDate: z.date().optional(),
  notes: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const createTermSchema = z.object({
  projectId: z.string().uuid("ID Proyek tidak valid"),
  termName: z.string().min(1, "Nama termin wajib diisi").max(100, "Maksimal 100 karakter"),
  percentage: z.number().min(0).max(100).optional(),
  amount: z.number().positive("Jumlah termin harus lebih dari 0"),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
});

export type CreateTermInput = z.infer<typeof createTermSchema>;
