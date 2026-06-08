import { getAllContentMap } from "@/app/actions/content.actions";
import SectionForm from "./_components/SectionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LpSection } from "@prisma/client";
import { FileText, Image as ImageIcon, Users, MessageSquare, Phone, Briefcase, HelpCircle } from "lucide-react";
import PortfolioItemsManager from "./_components/PortfolioItemsManager";

export const metadata = {
  title: "Kelola Konten Web | Ruka Studio Admin",
};

// Definisi field untuk masing-masing section
const SECTION_FIELDS = {
  [LpSection.HERO]: [
    { key: "tagline", label: "Tagline (Teks Kecil di Atas)", type: "text" as const, fallback: "Ruka Studio | Architecture & Interior Design" },
    { key: "headline", label: "Headline (Teks Utama Besar)", type: "text" as const, fallback: "INTEGRITAS" },
    { key: "subheadline", label: "Subheadline (Deskripsi Paragraf)", type: "textarea" as const, fallback: "Setiap proyek lahir dari sebuah intensi sederhana:\nMenciptakan ruang yang presisi, elegan, dan bertahan lama." },
    { key: "ctaText", label: "Teks Tombol (Call to Action)", type: "text" as const, fallback: "Lihat Karya Kami" },
    { key: "heroImage", label: "📷 Gambar Hero (Foto Utama)", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80" },
    { key: "badgeText", label: "Teks Badge (Glassmorphism)", type: "text" as const, fallback: "Est. 2018" },
    { key: "rightTitle", label: "Judul Kanan", type: "text" as const, fallback: "Proyek Selesai" },
    { key: "rightValue", label: "Nilai Kanan", type: "text" as const, fallback: "250+" },
  ],
  [LpSection.SERVICE]: [
    { key: "sectionTitle", label: "Judul Section Layanan", type: "text" as const, fallback: "Layanan Kami" },
    { key: "sectionDescription", label: "Deskripsi Singkat Layanan", type: "textarea" as const, fallback: "Dari konsep hingga eksekusi, kami menghadirkan solusi desain yang tidak hanya indah dipandang, namun juga menyatu dengan kebutuhan personal Anda." },
    { key: "service1Name", label: "Nama Layanan 1", type: "text" as const, fallback: "Perencanaan Arsitektur" },
    { key: "service1Desc", label: "Deskripsi Layanan 1", type: "textarea" as const, fallback: "Merancang denah, tampak, dan gambar kerja yang presisi untuk setiap jenis bangunan." },
    { key: "service1Image", label: "📷 Gambar Layanan 1", type: "image" as const, fallback: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
    { key: "service2Name", label: "Nama Layanan 2", type: "text" as const, fallback: "Desain Interior" },
    { key: "service2Desc", label: "Deskripsi Layanan 2", type: "textarea" as const, fallback: "Konsep ruang dalam yang fungsional, estetis, dan merefleksikan karakter klien." },
    { key: "service2Image", label: "📷 Gambar Layanan 2", type: "image" as const, fallback: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" },
    { key: "service3Name", label: "Nama Layanan 3", type: "text" as const, fallback: "Pengawasan Konstruksi" },
    { key: "service3Desc", label: "Deskripsi Layanan 3", type: "textarea" as const, fallback: "Supervisi lapangan dari groundbreaking hingga serah terima, memastikan kualitas sesuai spesifikasi." },
    { key: "service3Image", label: "📷 Gambar Layanan 3", type: "image" as const, fallback: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" },
    { key: "service4Name", label: "Nama Layanan 4", type: "text" as const, fallback: "Persiapan & Pengawasan" },
    { key: "service4Desc", label: "Deskripsi Layanan 4", type: "textarea" as const, fallback: "Kami mempersiapkan proyek untuk implementasi, mengoordinasikan berbagai pihak, dan mengawasi eksekusi." },
    { key: "service4Image", label: "📷 Gambar Layanan 4", type: "image" as const, fallback: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
  ],
  [LpSection.PORTFOLIO]: [
    { key: "sectionTitle", label: "Label Section (Teks Kecil)", type: "text" as const, fallback: "Karya Terpilih" },
    { key: "sectionDescription", label: "Judul Section (Teks Besar)", type: "textarea" as const, fallback: "Setiap karya adalah representasi dari komitmen kami terhadap kualitas, fungsi, dan keindahan." },
  ],
  [LpSection.TESTIMONIAL]: [
    { key: "sectionTitle", label: "Judul Section Testimoni", type: "text" as const, fallback: "Klien kami bercerita." },
    { key: "sectionSubtitle", label: "Subjudul Section", type: "text" as const, fallback: "Kepercayaan mereka adalah standar kami." },
    { key: "client1Name", label: "Nama Klien 1", type: "text" as const, fallback: "Budi Santoso" },
    { key: "client1Role", label: "Jabatan/Proyek Klien 1", type: "text" as const, fallback: "Rumah Tinggal · Depok" },
    { key: "client1Review", label: "Review Klien 1", type: "textarea" as const, fallback: "Ruka Studio benar-benar mengubah cara saya melihat proses membangun rumah. Gambar kerja mereka sangat detail — kontraktor di lapangan tidak punya alasan untuk salah." },
    { key: "client2Name", label: "Nama Klien 2", type: "text" as const, fallback: "Dewi Rahayu" },
    { key: "client2Role", label: "Jabatan/Proyek Klien 2", type: "text" as const, fallback: "Ruko Komersial · Bekasi" },
    { key: "client2Review", label: "Review Klien 2", type: "textarea" as const, fallback: "Tim Ruka hadir setiap minggu untuk pengawasan. Progres proyek tepat waktu dan kualitas bangunan sesuai spesifikasi." },
    { key: "client3Name", label: "Nama Klien 3", type: "text" as const, fallback: "Hendra Wijaya" },
    { key: "client3Role", label: "Jabatan/Proyek Klien 3", type: "text" as const, fallback: "Vila · Bali" },
    { key: "client3Review", label: "Review Klien 3", type: "textarea" as const, fallback: "Konsultasi awal dengan Ruka Studio sangat membantu — saya jadi tahu mana yang prioritas, mana yang bisa dihemat tanpa mengorbankan kualitas struktural." },
    { key: "client4Name", label: "Nama Klien 4", type: "text" as const, fallback: "Sari Kusuma" },
    { key: "client4Role", label: "Jabatan/Proyek Klien 4", type: "text" as const, fallback: "Gedung Kantor · Tangerang" },
    { key: "client4Review", label: "Review Klien 4", type: "textarea" as const, fallback: "Dokumen perencanaan dari Ruka lengkap dan terstruktur. Proses perizinan IMB jauh lebih mudah karena kelengkapan dokumen teknis yang mereka sediakan." },
  ],
  [LpSection.CONTACT]: [
    { key: "address", label: "Alamat Lengkap", type: "textarea" as const, fallback: "Jl. Senopati No. 45, Jakarta Selatan" },
    { key: "email", label: "Email Bisnis", type: "text" as const, fallback: "hello@rukastudio.com" },
    { key: "whatsappNumber", label: "Nomor WhatsApp (format: 62xxx tanpa +)", type: "text" as const, fallback: "6281234567890" },
    { key: "whatsappMessage", label: "Pesan WhatsApp Default", type: "text" as const, fallback: "Halo Ruka Studio, saya ingin konsultasi proyek." },
    { key: "instagram", label: "Link Instagram", type: "text" as const, fallback: "https://instagram.com/rukastudio" },
    { key: "linkedin", label: "Link LinkedIn", type: "text" as const, fallback: "https://linkedin.com/company/rukastudio" },
  ],
  [LpSection.WHY_US]: [
    { key: "title", label: "Judul Section (Mengapa Kami)", type: "text" as const, fallback: "MENGAPA KAMI" },
    { key: "description", label: "Deskripsi", type: "textarea" as const, fallback: "Kami membangun ruang yang bermakna, berfokus pada ketelitian dan kualitas material." },
    { key: "point1", label: "Poin Keunggulan 1", type: "text" as const, fallback: "Material Premium" },
    { key: "point1Desc", label: "Deskripsi Poin 1", type: "textarea" as const, fallback: "Setiap material dipilih berdasarkan kualitas, durabilitas, dan estetika jangka panjang." },
    { key: "point2", label: "Poin Keunggulan 2", type: "text" as const, fallback: "Desain Berkelanjutan" },
    { key: "point2Desc", label: "Deskripsi Poin 2", type: "textarea" as const, fallback: "Pendekatan desain yang mempertimbangkan fungsi, efisiensi, dan keindahan secara bersamaan." },
    { key: "point3", label: "Poin Keunggulan 3", type: "text" as const, fallback: "Eksekusi Presisi" },
    { key: "point3Desc", label: "Deskripsi Poin 3", type: "textarea" as const, fallback: "Tim berpengalaman yang memastikan setiap detail selesai tepat waktu dan sesuai spesifikasi." },
    { key: "whyUsImage", label: "📷 Gambar Ilustrasi (Opsional)", type: "image" as const, fallback: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80" },
    { key: "stats1Value", label: "Nilai Statistik 1", type: "text" as const, fallback: "250+" },
    { key: "stats1Label", label: "Label Statistik 1", type: "text" as const, fallback: "Proyek Selesai" },
    { key: "stats2Value", label: "Nilai Statistik 2", type: "text" as const, fallback: "100%" },
    { key: "stats2Label", label: "Label Statistik 2", type: "text" as const, fallback: "Ketepatan Waktu" },
    { key: "stats3Value", label: "Nilai Statistik 3", type: "text" as const, fallback: "15+" },
    { key: "stats3Label", label: "Label Statistik 3", type: "text" as const, fallback: "Tahun Pengalaman" },
  ],
  [LpSection.OUR_TEAM]: [
    { key: "title", label: "Judul Section (Tim Kami)", type: "text" as const, fallback: "TIM KAMI" },
    { key: "description", label: "Deskripsi Tim", type: "textarea" as const, fallback: "Di balik setiap karya Ruka Studio terdapat tim yang berdedikasi." },
    // Anggota 1
    { key: "member1Name", label: "Nama Anggota 1", type: "text" as const, fallback: "Raka Pratama" },
    { key: "member1Role", label: "Jabatan Anggota 1", type: "text" as const, fallback: "Principal Architect" },
    { key: "member1Bio", label: "Bio Anggota 1", type: "textarea" as const, fallback: "ID: Memiliki pengalaman lebih dari 10 tahun dalam merancang hunian premium. | EN: Has over 10 years of experience in designing premium residences." },
    { key: "member1Image", label: "📷 Foto Anggota 1", type: "image" as const, fallback: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
    { key: "member1Visible", label: "Tampilkan Anggota 1 di Website", type: "toggle" as const, fallback: "true" },
    // Anggota 2
    { key: "member2Name", label: "Nama Anggota 2", type: "text" as const, fallback: "Sari Dewi" },
    { key: "member2Role", label: "Jabatan Anggota 2", type: "text" as const, fallback: "Interior Designer" },
    { key: "member2Bio", label: "Bio Anggota 2", type: "textarea" as const, fallback: "ID: Spesialis dalam menciptakan harmoni antara ruang dalam dan luar. | EN: Specialist in creating harmony between indoor and outdoor spaces." },
    { key: "member2Image", label: "📷 Foto Anggota 2", type: "image" as const, fallback: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
    { key: "member2Visible", label: "Tampilkan Anggota 2 di Website", type: "toggle" as const, fallback: "true" },
    // Anggota 3
    { key: "member3Name", label: "Nama Anggota 3", type: "text" as const, fallback: "Budi Wicaksono" },
    { key: "member3Role", label: "Jabatan Anggota 3", type: "text" as const, fallback: "Project Manager" },
    { key: "member3Bio", label: "Bio Anggota 3", type: "textarea" as const, fallback: "ID: Memastikan setiap proyek selesai tepat waktu dengan kualitas terbaik. | EN: Ensuring every project is completed on time with the best quality." },
    { key: "member3Image", label: "📷 Foto Anggota 3", type: "image" as const, fallback: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
    { key: "member3Visible", label: "Tampilkan Anggota 3 di Website", type: "toggle" as const, fallback: "true" },
    // Anggota 4
    { key: "member4Name", label: "Nama Anggota 4", type: "text" as const, fallback: "Anisa Putri" },
    { key: "member4Role", label: "Jabatan Anggota 4", type: "text" as const, fallback: "3D Visualizer" },
    { key: "member4Bio", label: "Bio Anggota 4", type: "textarea" as const, fallback: "ID: Menghidupkan desain melalui rendering fotorealistik yang memukau. | EN: Bringing designs to life through stunning photorealistic renderings." },
    { key: "member4Image", label: "📷 Foto Anggota 4", type: "image" as const, fallback: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
    { key: "member4Visible", label: "Tampilkan Anggota 4 di Website", type: "toggle" as const, fallback: "false" },
  ],
  [LpSection.PHILOSOPHY]: [
    { key: "philosophyEyebrow", label: "Label Kecil Atas", type: "text" as const, fallback: "Filosofi Desain" },
    { key: "philosophyTitle", label: "Judul Utama", type: "text" as const, fallback: "Merancang Ruang untuk Kehidupan yang Sebenarnya." },
    { key: "philosophyDesc", label: "Deskripsi Filosofi", type: "textarea" as const, fallback: "Kami percaya bahwa rumah yang baik bukan sekadar bangunan. Ini tentang bagaimana cahaya alami, material yang jujur, dan tata ruang yang cerdas menyatu untuk membuat hidup Anda lebih baik." },
    { key: "philosophyImage", label: "📷 Gambar Background/Ilustrasi", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=1600&q=80" },
  ],
  [LpSection.ABOUT_HERO]: [
    { key: "heroEyebrow", label: "Label Kecil Atas", type: "text" as const, fallback: "Studio Kami" },
    { key: "heroTitle", label: "Judul Utama Bawah", type: "text" as const, fallback: "Tentang Ruka Studio." },
    { key: "heroSubtitle", label: "Quote Besar Tengah", type: "textarea" as const, fallback: "Kami adalah kolektif arsitek dan desainer yang percaya bahwa bangunan bukan sekadar struktur — ia adalah kerangka bagi kehidupan." },
    { key: "aboutHeroImage", label: "📷 Gambar Background/Ilustrasi", type: "image" as const, fallback: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80" },
  ],
  [LpSection.PROCESS]: [
    { key: "process1Title", label: "Judul Proses 1", type: "text" as const, fallback: "Sketsa Desain" },
    { key: "process1Desc", label: "Deskripsi Proses 1", type: "textarea" as const, fallback: "Kami memulai dengan kunjungan lokasi dan konsultasi kreatif untuk menentukan visi, gaya, dan kebutuhan fungsional Anda. Berdasarkan ini, kami membuat serangkaian sketsa desain tangan untuk memberikan konsep visual awal yang mencerminkan brief Anda." },
    { key: "process1Image", label: "📷 Gambar Proses 1", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600607687930-cebc5a73e513?q=80&w=800&auto=format&fit=crop" },
    { key: "process2Title", label: "Judul Proses 2", type: "text" as const, fallback: "Pengembangan Desain" },
    { key: "process2Desc", label: "Deskripsi Proses 2", type: "textarea" as const, fallback: "Di sini kami mengembangkan sketsa awal dengan semua detail — termasuk pemilihan material bangunan, denah lantai, layout, desain joinery indikatif, dan alur ruang." },
    { key: "process2Image", label: "📷 Gambar Proses 2", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
    { key: "process3Title", label: "Judul Proses 3", type: "text" as const, fallback: "Aplikasi Pengembangan" },
    { key: "process3Desc", label: "Deskripsi Proses 3", type: "textarea" as const, fallback: "Tidak semua proyek memerlukan aplikasi pengembangan. Jika proyek Anda memerlukannya, kami akan mengkoordinasikan seluruh proses — termasuk pengumpulan dokumentasi, penyiapan dan pengajuan aplikasi." },
    { key: "process3Image", label: "📷 Gambar Proses 3", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600607687931-18e38e8cb504?q=80&w=800&auto=format&fit=crop" },
    { key: "process4Title", label: "Judul Proses 4", type: "text" as const, fallback: "Desain Interior" },
    { key: "process4Desc", label: "Deskripsi Proses 4", type: "textarea" as const, fallback: "Kami merancang konsep desain interior yang menciptakan alur, kontras, dan keseimbangan dengan desain arsitektur dan visi keseluruhan rumah Anda." },
    { key: "process4Image", label: "📷 Gambar Proses 4", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop" },
    { key: "process5Title", label: "Judul Proses 5", type: "text" as const, fallback: "Persetujuan Bangunan" },
    { key: "process5Desc", label: "Deskripsi Proses 5", type: "textarea" as const, fallback: "Semua proyek arsitektur memerlukan Persetujuan Bangunan. Tim kami akan menasihati, memandu, mengkoordinasikan, dan mengelola semua rencana serta aplikasi persetujuan bangunan Anda." },
    { key: "process5Image", label: "📷 Gambar Proses 5", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop" },
    { key: "process6Title", label: "Judul Proses 6", type: "text" as const, fallback: "Rencana Konstruksi" },
    { key: "process6Desc", label: "Deskripsi Proses 6", type: "textarea" as const, fallback: "Dengan semua detail desain selesai, kami beralih ke pembuatan rencana, gambar, dan dokumen konstruksi yang akan memandu builder dalam mewujudkan desain." },
    { key: "process6Image", label: "📷 Gambar Proses 6", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?q=80&w=800&auto=format&fit=crop" },
  ],
  [LpSection.FAQ]: [
    { key: "faqEyebrow", label: "Label Kecil Atas", type: "text" as const, fallback: "PERTANYAAN UMUM" },
    { key: "faqTitle", label: "Judul FAQ", type: "text" as const, fallback: "Yang sering ditanyakan." },
    { key: "faqDesc", label: "Deskripsi", type: "textarea" as const, fallback: "Semua hal yang perlu Anda ketahui sebelum merencanakan hunian impian bersama kami." },
    { key: "faq1Question", label: "Pertanyaan 1", type: "text" as const, fallback: "Apakah Ruka Studio melayani pembangunan fisik atau hanya jasa desain?" },
    { key: "faq1Answer", label: "Jawaban 1", type: "textarea" as const, fallback: "Kami berfokus penuh sebagai konsultan & perencana konstruksi. Untuk pelaksanaan fisik pembangunan, kami dapat merekomendasikan kontraktor rekanan tepercaya." },
    { key: "faq2Question", label: "Pertanyaan 2", type: "text" as const, fallback: "Di mana saja jangkauan wilayah proyek Ruka Studio?" },
    { key: "faq2Answer", label: "Jawaban 2", type: "textarea" as const, fallback: "Studio fisik kami berada di Lombok dan Bandung, namun kami melayani perancangan arsitektur di seluruh wilayah Indonesia." },
    { key: "faq3Question", label: "Pertanyaan 3", type: "text" as const, fallback: "Berapa lama estimasi waktu pengerjaan dokumen desain?" },
    { key: "faq3Answer", label: "Jawaban 3", type: "textarea" as const, fallback: "Waktu perencanaan bervariasi antara 1 hingga 3 bulan tergantung kompleksitas lahan." },
    { key: "faq4Question", label: "Pertanyaan 4", type: "text" as const, fallback: "Bagaimana sistem perhitungan biaya jasa arsitek di Ruka Studio?" },
    { key: "faq4Answer", label: "Jawaban 4", type: "textarea" as const, fallback: "Biaya perencanaan kami dihitung secara transparan berbasis luas lantai bangunan (per meter persegi)." },
    { key: "faq5Question", label: "Pertanyaan 5", type: "text" as const, fallback: "Apakah dokumen dari Ruka Studio bisa digunakan untuk mengurus IMB/PBG?" },
    { key: "faq5Answer", label: "Jawaban 5", type: "textarea" as const, fallback: "Ya. Setiap output perencanaan dari kami dilengkapi dokumen teknis berstandar nasional yang lengkap." },
    { key: "faqImage", label: "📷 Gambar Background/Ilustrasi", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80" },
  ],
  [LpSection.PROJECT_BRIEF]: [
    { key: "projectBriefEyebrow", label: "Label Kecil Atas", type: "text" as const, fallback: "RANCANG BRIEF PROYEK" },
    { key: "projectBriefTitle", label: "Judul", type: "text" as const, fallback: "Awali rencana Anda." },
    { key: "projectBriefDesc", label: "Deskripsi", type: "textarea" as const, fallback: "Gambarkan rencana hunian Anda dalam 4 langkah praktis. Tim kami akan meninjau draf brief ini sebelum sesi konsultasi awal." },
    { key: "projectBriefImage", label: "📷 Gambar Background/Ilustrasi", type: "image" as const, fallback: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1600&q=80" },
  ],
  [LpSection.FOOTER]: [
    { key: "footerTitle", label: "Judul Footer", type: "text" as const, fallback: "Wujudkan visi Anda sekarang." },
    { key: "footerDesc", label: "Deskripsi", type: "textarea" as const, fallback: "Kami siap mendengarkan. Diskusikan ide awal Anda bersama tim arsitek kami." },
    { key: "footerButton", label: "Teks Tombol CTA", type: "text" as const, fallback: "Diskusikan Bersama Kami" },
    { key: "footerImage", label: "📷 Gambar Background", type: "image" as const, fallback: "/cad-footer-bg.png" },
  ]
};

export default async function ContentPage() {
  const contentResult = await getAllContentMap();
  const contentMap = contentResult.success ? contentResult.data : null;
  const error = contentResult.success ? null : contentResult.error;

  const getInitialData = (section: LpSection) => {
    return contentMap?.[section] || [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1A2530] tracking-wide" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>Konten Website</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola teks dan gambar statis pada landing page Anda.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-sm">
          {error}
        </div>
      )}

      <Tabs defaultValue={LpSection.HERO} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="bg-white border border-gray-200 h-12 w-max sm:w-full justify-start rounded-none p-1">
            <TabsTrigger value={LpSection.PROJECT_BRIEF} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" /> Brief
            </TabsTrigger>
            <TabsTrigger value={LpSection.HERO} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" /> Hero
            </TabsTrigger>
            <TabsTrigger value={LpSection.WHY_US} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <HelpCircle className="w-4 h-4 mr-2" /> Why Us
            </TabsTrigger>
            <TabsTrigger value={LpSection.OUR_TEAM} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" /> Tim Kami
            </TabsTrigger>
            <TabsTrigger value={LpSection.PHILOSOPHY} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" /> Filosofi
            </TabsTrigger>
            <TabsTrigger value={LpSection.ABOUT_HERO} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" /> Tentang
            </TabsTrigger>
            <TabsTrigger value={LpSection.PROCESS} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <Briefcase className="w-4 h-4 mr-2" /> Proses
            </TabsTrigger>
            <TabsTrigger value={LpSection.SERVICE} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <Briefcase className="w-4 h-4 mr-2" /> Layanan
            </TabsTrigger>
            <TabsTrigger value={LpSection.PORTFOLIO} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" /> Portfolio
            </TabsTrigger>
            <TabsTrigger value={LpSection.FAQ} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" /> FAQ
            </TabsTrigger>
            <TabsTrigger value={LpSection.TESTIMONIAL} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" /> Testimoni
            </TabsTrigger>
            <TabsTrigger value={LpSection.CONTACT} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <Phone className="w-4 h-4 mr-2" /> Kontak
            </TabsTrigger>
            <TabsTrigger value={LpSection.FOOTER} className="rounded-none data-[state=active]:bg-[#1B3B5A] data-[state=active]:text-white">
              <Phone className="w-4 h-4 mr-2" /> Footer
            </TabsTrigger>
          </TabsList>
        </div>

        {Object.entries(SECTION_FIELDS).map(([sectionKey, fields]) => (
          <TabsContent key={sectionKey} value={sectionKey} className="mt-4 outline-none">
            <SectionForm 
              section={sectionKey as LpSection} 
              fields={fields} 
              initialData={getInitialData(sectionKey as LpSection)} 
            />
            {sectionKey === LpSection.PORTFOLIO && (
              <div className="mt-12 border-t pt-8 border-gray-200">
                <PortfolioItemsManager />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
