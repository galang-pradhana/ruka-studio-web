"use client";

import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp({ data = {} }: { data?: Record<string, string> }) {
  const waNumber = data.whatsappNumber || "6281234567890";
  const waMessage = data.whatsappMessage || "Halo Ruka Studio, saya ingin konsultasi proyek.";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-xl group"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Tooltip */}
      <span className="absolute right-16 px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Konsultasi Gratis
      </span>
    </a>
  );
}
