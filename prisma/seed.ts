/**
 * Seed Script — Admin pertama Ruka Studio
 * Jalankan sekali saja: npx tsx prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@rukastudio.id";
  const password = "ruka@admin2024"; // Ganti segera setelah login pertama!

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ User ${email} sudah ada. Seed dilewati.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: "Admin Ruka Studio",
      email,
      passwordHash,
      role: "OWNER",
      isActive: true,
      mustChangePassword: true,
    },
  });

  console.log(`🎉 Admin user berhasil dibuat!`);
  console.log(`   Email   : ${user.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   ⚠️  GANTI PASSWORD SETELAH LOGIN PERTAMA!`);
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
