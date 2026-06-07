/**
 * Seed Default LP Content
 * Jalankan: npx tsx prisma/seed-content.ts
 * 
 * Script ini akan mengisi DB dengan default content untuk semua section LP.
 * Aman dijalankan berkali-kali (upsert).
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_CONTENT = [
  // ── HERO ──────────────────────────────────────────────────────────────────
  { section: "HERO", key: "tagline", value: "Ruka Studio | Architecture & Interior Design" },
  { section: "HERO", key: "headline", value: "INTEGRITAS" },
  { section: "HERO", key: "subheadline", value: "Setiap proyek lahir dari sebuah intensi sederhana:\nMenciptakan ruang yang presisi, elegan, dan bertahan lama." },
  { section: "HERO", key: "ctaText", value: "Lihat Karya Kami" },
  { section: "HERO", key: "heroImage", value: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80" },

  // ── SERVICE ───────────────────────────────────────────────────────────────
  { section: "SERVICE", key: "sectionTitle", value: "Layanan Kami" },
  { section: "SERVICE", key: "sectionDescription", value: "Dari konsep hingga eksekusi, kami menghadirkan solusi desain yang tidak hanya indah dipandang, namun juga menyatu dengan kebutuhan personal Anda." },
  { section: "SERVICE", key: "service1Name", value: "Perencanaan Arsitektur" },
  { section: "SERVICE", key: "service1Desc", value: "Merancang denah, tampak, dan gambar kerja yang presisi untuk setiap jenis bangunan." },
  { section: "SERVICE", key: "service1Image", value: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
  { section: "SERVICE", key: "service2Name", value: "Desain Interior" },
  { section: "SERVICE", key: "service2Desc", value: "Konsep ruang dalam yang fungsional, estetis, dan merefleksikan karakter klien." },
  { section: "SERVICE", key: "service2Image", value: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" },
  { section: "SERVICE", key: "service3Name", value: "Pengawasan Konstruksi" },
  { section: "SERVICE", key: "service3Desc", value: "Supervisi lapangan dari groundbreaking hingga serah terima, memastikan kualitas sesuai spesifikasi." },
  { section: "SERVICE", key: "service3Image", value: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" },
  { section: "SERVICE", key: "service4Name", value: "Persiapan & Pengawasan" },
  { section: "SERVICE", key: "service4Desc", value: "Kami mempersiapkan proyek untuk implementasi, mengoordinasikan berbagai pihak, dan mengawasi eksekusi." },
  { section: "SERVICE", key: "service4Image", value: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },

  // ── WHY_US ────────────────────────────────────────────────────────────────
  { section: "WHY_US", key: "title", value: "MENGAPA KAMI" },
  { section: "WHY_US", key: "description", value: "Kami membangun ruang yang bermakna, berfokus pada ketelitian dan kualitas material." },
  { section: "WHY_US", key: "point1", value: "Material Premium" },
  { section: "WHY_US", key: "point1Desc", value: "Setiap material dipilih berdasarkan kualitas, durabilitas, dan estetika jangka panjang." },
  { section: "WHY_US", key: "point2", value: "Desain Berkelanjutan" },
  { section: "WHY_US", key: "point2Desc", value: "Pendekatan desain yang mempertimbangkan fungsi, efisiensi, dan keindahan secara bersamaan." },
  { section: "WHY_US", key: "point3", value: "Eksekusi Presisi" },
  { section: "WHY_US", key: "point3Desc", value: "Tim berpengalaman yang memastikan setiap detail selesai tepat waktu dan sesuai spesifikasi." },
  { section: "WHY_US", key: "whyUsImage", value: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80" },

  // ── OUR_TEAM ──────────────────────────────────────────────────────────────
  { section: "OUR_TEAM", key: "title", value: "TIM KAMI" },
  { section: "OUR_TEAM", key: "description", value: "Di balik setiap karya Ruka Studio terdapat tim yang berdedikasi." },
  { section: "OUR_TEAM", key: "member1Name", value: "Raka Pratama" },
  { section: "OUR_TEAM", key: "member1Role", value: "Principal Architect" },
  { section: "OUR_TEAM", key: "member1Image", value: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { section: "OUR_TEAM", key: "member1Visible", value: "true" },
  { section: "OUR_TEAM", key: "member2Name", value: "Sari Dewi" },
  { section: "OUR_TEAM", key: "member2Role", value: "Interior Designer" },
  { section: "OUR_TEAM", key: "member2Image", value: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { section: "OUR_TEAM", key: "member2Visible", value: "true" },
  { section: "OUR_TEAM", key: "member3Name", value: "Budi Wicaksono" },
  { section: "OUR_TEAM", key: "member3Role", value: "Project Manager" },
  { section: "OUR_TEAM", key: "member3Image", value: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { section: "OUR_TEAM", key: "member3Visible", value: "true" },
  { section: "OUR_TEAM", key: "member4Name", value: "Anisa Putri" },
  { section: "OUR_TEAM", key: "member4Role", value: "3D Visualizer" },
  { section: "OUR_TEAM", key: "member4Image", value: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  { section: "OUR_TEAM", key: "member4Visible", value: "false" },

  // ── TESTIMONIAL ───────────────────────────────────────────────────────────
  { section: "TESTIMONIAL", key: "sectionTitle", value: "Klien kami bercerita." },
  { section: "TESTIMONIAL", key: "sectionSubtitle", value: "Kepercayaan mereka adalah standar kami." },
  { section: "TESTIMONIAL", key: "client1Name", value: "Budi Santoso" },
  { section: "TESTIMONIAL", key: "client1Role", value: "Rumah Tinggal · Depok" },
  { section: "TESTIMONIAL", key: "client1Review", value: "Ruka Studio benar-benar mengubah cara saya melihat proses membangun rumah. Gambar kerja mereka sangat detail — kontraktor di lapangan tidak punya alasan untuk salah." },
  { section: "TESTIMONIAL", key: "client2Name", value: "Dewi Rahayu" },
  { section: "TESTIMONIAL", key: "client2Role", value: "Ruko Komersial · Bekasi" },
  { section: "TESTIMONIAL", key: "client2Review", value: "Tim Ruka hadir setiap minggu untuk pengawasan. Progres proyek tepat waktu dan kualitas bangunan sesuai spesifikasi." },
  { section: "TESTIMONIAL", key: "client3Name", value: "Hendra Wijaya" },
  { section: "TESTIMONIAL", key: "client3Role", value: "Vila · Bali" },
  { section: "TESTIMONIAL", key: "client3Review", value: "Konsultasi awal dengan Ruka Studio sangat membantu — saya jadi tahu mana yang prioritas, mana yang bisa dihemat tanpa mengorbankan kualitas struktural." },
  { section: "TESTIMONIAL", key: "client4Name", value: "Sari Kusuma" },
  { section: "TESTIMONIAL", key: "client4Role", value: "Gedung Kantor · Tangerang" },
  { section: "TESTIMONIAL", key: "client4Review", value: "Dokumen perencanaan dari Ruka lengkap dan terstruktur. Proses perizinan IMB jauh lebih mudah karena kelengkapan dokumen teknis yang mereka sediakan." },

  // ── PORTFOLIO ─────────────────────────────────────────────────────────────
  { section: "PORTFOLIO", key: "sectionTitle", value: "Karya Terpilih" },
  { section: "PORTFOLIO", key: "sectionDescription", value: "Setiap karya adalah representasi dari komitmen kami terhadap kualitas, fungsi, dan keindahan." },

  // ── CONTACT ───────────────────────────────────────────────────────────────
  { section: "CONTACT", key: "address", value: "Jl. Senopati No. 45, Jakarta Selatan" },
  { section: "CONTACT", key: "email", value: "hello@rukastudio.com" },
  { section: "CONTACT", key: "whatsappNumber", value: "6281234567890" },
  { section: "CONTACT", key: "whatsappMessage", value: "Halo Ruka Studio, saya ingin konsultasi proyek." },
  { section: "CONTACT", key: "instagram", value: "https://instagram.com/rukastudio" },
  { section: "CONTACT", key: "linkedin", value: "https://linkedin.com/company/rukastudio" },
] as const;

async function main() {
  console.log("🌱 Seeding default LP content...");

  const users = await prisma.user.findMany({ take: 1 });
  const updaterId = users[0]?.id || "system";

  let created = 0;
  let skipped = 0;

  for (const item of DEFAULT_CONTENT) {
    const existing = await prisma.lpContent.findFirst({
      where: { section: item.section as any, key: item.key },
    });

    if (!existing) {
      await prisma.lpContent.create({
        data: {
          section: item.section as any,
          key: item.key,
          value: item.value,
          orderIndex: 0,
          isActive: true,
          updatedBy: updaterId,
        },
      });
      created++;
      console.log(`  ✅ Created ${item.section}.${item.key}`);
    } else {
      skipped++;
    }
  }

  console.log(`\n✨ Done! Created: ${created}, Skipped (already exists): ${skipped}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
