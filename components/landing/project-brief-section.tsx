"use client";
import React, { useState } from 'react';
import { useLanguage } from "@/contexts/language-context";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { parseDualLanguage } from "@/lib/content-parser";
import Image from "next/image";
import { createProjectBrief } from "@/app/actions/brief.actions";
import { toast } from "sonner";

export function ProjectBriefSection({ data = {} }: { data?: Record<string, string> }) {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Lombok');
  const [propType, setPropType] = useState(language === 'EN' ? 'Residential' : 'Hunian');
  const [landSize, setLandSize] = useState('< 150m²');
  const [budget, setBudget] = useState(language === 'EN' ? '< Rp 100 Million' : '< Rp 100jt');
  const [details, setDetails] = useState('');
  
  // Validation
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationOptions = {
    EN: ['Lombok', 'Bandung', 'Bali', 'Other'],
    ID: ['Lombok', 'Bandung', 'Bali', 'Lainnya']
  };

  const propTypeOptions = {
    EN: ['Residential', 'Villa', 'Commercial', 'Other'],
    ID: ['Hunian', 'Vila', 'Ruko / Komersial', 'Lainnya']
  };

  const landSizeOptions = ['< 150m²', '150m² - 300m²', '300m² - 500m²', '> 500m²'];
  
  const budgetOptions = {
    EN: ['< Rp 100 Million', 'Rp 100 - 250 Million', 'Rp 250 - 500 Million', '> Rp 500 Million'],
    ID: ['< Rp 100jt', 'Rp 100 - 250jt', 'Rp 250 - 500jt', '> Rp 500jt']
  };

  const steps = [
    { id: 1, titleEN: "Contact Info", titleID: "Info Kontak" },
    { id: 2, titleEN: "Location & Type", titleID: "Lokasi & Tipe" },
    { id: 3, titleEN: "Scale & Budget", titleID: "Skala & Anggaran" },
    { id: 4, titleEN: "Spatial Vision", titleID: "Visi Ruang" }
  ];

  const handleNext = () => {
    setErrorMsg('');
    
    // Validate Step 1
    if (currentStep === 1) {
      if (!name.trim()) {
        setErrorMsg(language === 'EN' ? 'Please fill in your name.' : 'Mohon isi nama Anda.');
        return;
      }
      if (!email.trim()) {
        setErrorMsg(language === 'EN' ? 'Please fill in your email or phone number.' : 'Mohon isi kontak email atau telepon Anda.');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    // Pre-submission final checks
    if (!name.trim() || !email.trim()) {
      setCurrentStep(1);
      setErrorMsg(language === 'EN' ? 'Name and Contact are required.' : 'Nama dan Kontak wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createProjectBrief({
        name,
        email,
        location,
        propType,
        landSize,
        budget,
        details,
      });

      if (!res.success) {
        setErrorMsg(res.error || (language === 'EN' ? 'Something went wrong.' : 'Terjadi kesalahan.'));
        toast.error(res.error || (language === 'EN' ? 'Something went wrong.' : 'Gagal menyimpan data brief.'));
        setIsSubmitting(false);
        return;
      }

      toast.success(
        language === 'EN' 
          ? "Brief saved successfully! Connecting to WhatsApp..." 
          : "Brief berhasil disimpan! Menghubungkan ke WhatsApp..."
      );

      const whatsappNumber = "6281234567890"; // Ruka Studio Contact WA
      const messageTemplate = language === 'EN' 
        ? `Hello Ruka Studio,\n\nI am interested in starting a project planning brief with your team.\n\n*Project Details:*\n- Name: ${name}\n- Contact: ${email}\n- Project Location: ${location}\n- Property Type: ${propType}\n- Land Area: ${landSize}\n- Estimated Construction Budget: ${budget}\n\n*Additional Space Brief:*\n${details || "-"}\n\nThank you.`
        : `Halo Ruka Studio,\n\nSaya tertarik untuk mendiskusikan rencana konsultasi & perancangan arsitektur bersama tim Ruka.\n\n*Rincian Brief Proyek:*\n- Nama: ${name}\n- Kontak/Email: ${email}\n- Lokasi Proyek: ${location}\n- Tipe Properti: ${propType}\n- Luas Lahan: ${landSize}\n- Estimasi Budget Konstruksi: ${budget}\n\n*Deskripsi Kebutuhan Ruang:*\n${details || "-"}\n\nTerima kasih.`;

      const encodedMsg = encodeURIComponent(messageTemplate);
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
      
      window.open(waUrl, '_blank');
    } catch (err) {
      console.error(err);
      setErrorMsg(language === 'EN' ? 'Failed to submit.' : 'Gagal mengirimkan brief.');
      toast.error(language === 'EN' ? 'Failed to submit.' : 'Gagal mengirimkan brief.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectBriefImage = data.projectBriefImage || "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1600&q=80";

  return (
    <section
      id="project-planner"
      className="py-[100px] md:py-[120px] overflow-hidden relative"
      style={{ backgroundColor: "#FCFAF6", borderTop: "1px solid rgba(10,6,8,0.06)" }}
    >
      {/* Fallback Background Image */}
      {projectBriefImage && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
          <Image
            src={projectBriefImage}
            alt="Project Brief Background"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="max-w-[1000px] mx-auto px-6 md:px-14 relative z-10">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Progress Indicator */}
          <div className="lg:col-span-5 flex flex-col justify-between h-auto lg:h-[340px]">
            <div>
              <p
                className="uppercase font-semibold mb-5 text-left"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.35em",
                  fontFamily: "var(--font-montserrat, sans-serif)",
                  color: "#A4855C",
                }}
              >
                {parseDualLanguage(data.projectBriefEyebrow, language, language === 'EN' ? "PROJECT BRIEF PLANNER" : "RANCANG BRIEF PROYEK")}
              </p>
              <h2
                className="font-bold mb-4 text-left"
                style={{
                  fontSize: "clamp(30px, 3.5vw, 42px)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-cinzel, serif)",
                  color: "#0B2240",
                }}
              >
                {parseDualLanguage(data.projectBriefTitle, language, language === 'EN' ? "Form the inception." : "Awali rencana Anda.")}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  fontWeight: 400,
                  fontFamily: "var(--font-montserrat, sans-serif)",
                  color: "rgba(10,6,8,0.55)",
                }}
                className="max-w-md text-left"
              >
                {parseDualLanguage(
                  data.projectBriefDesc,
                  language,
                  language === 'EN' 
                    ? "Define your spatial goals in 4 simple steps. We will review this brief prior to our initial architectural consultation." 
                    : "Gambarkan rencana hunian Anda dalam 4 langkah praktis. Tim kami akan meninjau draf brief ini sebelum sesi konsultasi awal."
                )}
              </p>
            </div>

            {/* Stepper Progress Visualizer */}
            <div className="mt-8 lg:mt-0 pt-6 border-t border-[#0B2240]/10">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="font-mono text-[10px] tracking-widest text-[#A4855C] font-semibold">
                  {language === 'EN' ? `STEP 0${currentStep} / 04` : `LANGKAH 0${currentStep} / 04`}
                </span>
                <span className="text-xs text-[#0B2240]/40 font-medium">—</span>
                <span className="font-sans text-xs text-[#0B2240] font-semibold">
                  {language === 'EN' ? steps[currentStep-1].titleEN : steps[currentStep-1].titleID}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-[#0B2240]/10 h-[2px] rounded-none overflow-hidden">
                <div 
                  className="bg-[#A4855C] h-full transition-all duration-500 ease-out" 
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Multistep Wizard Card */}
          <div className="lg:col-span-7 w-full">
            <div 
              className="bg-[#0B2240]/[0.02] border border-[#0B2240]/5 rounded-none p-6 md:p-8 flex flex-col justify-between min-h-[340px] shadow-[0_12px_30px_rgba(11,34,64,0.02)]"
            >
              <div className="w-full">
                
                {/* STEP 1: Contact info */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] tracking-widest text-[#0B2240]/60 uppercase text-left">
                        {language === 'EN' ? "01 / Your Name or Institution" : "01 / Nama Lengkap / Instansi"}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === 'EN' ? "Budi Santoso" : "Budi Santoso"}
                        className="bg-transparent border-b border-[#0B2240]/20 py-3 focus:border-[#A4855C] focus:outline-none transition-colors duration-300 font-sans text-sm text-[#0B2240]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] tracking-widest text-[#0B2240]/60 uppercase text-left">
                        {language === 'EN' ? "02 / Contact Email or Phone" : "02 / Kontak Surel / Nomor Telepon"}
                      </label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={language === 'EN' ? "budi@email.com / +62..." : "budi@email.com / +62..."}
                        className="bg-transparent border-b border-[#0B2240]/20 py-3 focus:border-[#A4855C] focus:outline-none transition-colors duration-300 font-sans text-sm text-[#0B2240]"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Location and Type */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest text-[#0B2240]/60 uppercase text-left">
                        {language === 'EN' ? "03 / Project Location" : "03 / Lokasi Rencana Proyek"}
                      </label>
                      <div className="flex flex-wrap gap-2 justify-start">
                        {locationOptions[language].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setLocation(opt)}
                            className={`px-4 py-2 rounded-none text-xs font-sans font-medium transition-all duration-300 cursor-pointer border ${
                              location === opt
                                ? "bg-[#0B2240] text-[#FCFAF6] border-[#0B2240]"
                                : "bg-transparent text-[#0B2240]/80 border-[#0B2240]/10 hover:border-[#A4855C] hover:text-[#A4855C]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest text-[#0B2240]/60 uppercase text-left">
                        {language === 'EN' ? "04 / Property Type" : "04 / Tipe Bangunan / Properti"}
                      </label>
                      <div className="flex flex-wrap gap-2 justify-start">
                        {propTypeOptions[language].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPropType(opt)}
                            className={`px-4 py-2 rounded-none text-xs font-sans font-medium transition-all duration-300 cursor-pointer border ${
                              propType === opt
                                ? "bg-[#0B2240] text-[#FCFAF6] border-[#0B2240]"
                                : "bg-transparent text-[#0B2240]/80 border-[#0B2240]/10 hover:border-[#A4855C] hover:text-[#A4855C]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Land size & Budget */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest text-[#0B2240]/60 uppercase text-left">
                        {language === 'EN' ? "05 / Target Land Area" : "05 / Estimasi Luas Lahan"}
                      </label>
                      <div className="flex flex-wrap gap-2 justify-start">
                        {landSizeOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setLandSize(opt)}
                            className={`px-4 py-2 rounded-none text-xs font-sans font-medium transition-all duration-300 cursor-pointer border ${
                              landSize === opt
                                ? "bg-[#0B2240] text-[#FCFAF6] border-[#0B2240]"
                                : "bg-transparent text-[#0B2240]/80 border-[#0B2240]/10 hover:border-[#A4855C] hover:text-[#A4855C]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest text-[#0B2240]/60 uppercase text-left">
                        {language === 'EN' ? "06 / Estimated Construction Budget" : "06 / Estimasi Budget Pembangunan"}
                      </label>
                      <div className="flex flex-wrap gap-2 justify-start">
                        {budgetOptions[language].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setBudget(opt)}
                            className={`px-4 py-2 rounded-none text-xs font-sans font-medium transition-all duration-300 cursor-pointer border ${
                              budget === opt
                                ? "bg-[#0B2240] text-[#FCFAF6] border-[#0B2240]"
                                : "bg-transparent text-[#0B2240]/80 border-[#0B2240]/10 hover:border-[#A4855C] hover:text-[#A4855C]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Spatial vision */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest text-[#0B2240]/60 uppercase text-left">
                        {language === 'EN' ? "07 / Spatial Intent & Special Requests" : "07 / Deskripsi Ruang & Kebutuhan Khusus"}
                      </label>
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder={
                          language === 'EN' 
                            ? "Describe your spatial goals (e.g., number of rooms, building heights, style reference, or site difficulty)..." 
                            : "Deskripsikan kebutuhan ruang Anda (misal: jumlah kamar, tinggi lantai, preferensi gaya, atau tantangan kontur lahan)..."
                        }
                        rows={4}
                        className="bg-transparent border border-[#0B2240]/20 rounded-none p-3 focus:border-[#A4855C] focus:outline-none transition-colors duration-300 font-sans text-sm text-[#0B2240] leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Navigation Controls */}
              <div className="mt-8 pt-4 border-t border-[#0B2240]/5 flex items-center justify-between">
                
                {/* Back Button */}
                <div>
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#0B2240] hover:text-[#A4855C] transition-colors duration-300 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {language === 'EN' ? "Back" : "Kembali"}
                    </button>
                  ) : (
                    <div className="w-10" />
                  )}
                </div>

                {/* Error message inline */}
                {errorMsg && (
                  <p className="text-red-500 font-sans text-[11px] font-semibold text-center flex-1 px-4 animate-pulse">
                    {errorMsg}
                  </p>
                )}

                {/* Next/Submit Button */}
                <div>
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 bg-[#0B2240] hover:bg-[#A4855C] text-white px-5 py-2.5 rounded-none text-xs font-sans font-bold transition-all duration-300 cursor-pointer shadow-sm hover:scale-[1.02]"
                    >
                      {language === 'EN' ? "Next" : "Lanjut"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 bg-black hover:bg-[#A4855C] text-white px-5 py-2.5 rounded-none text-xs font-sans font-bold transition-all duration-300 cursor-pointer shadow-md hover:scale-[1.02] border border-[#0B2240]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          {language === 'EN' ? "Sending..." : "Mengirim..."}
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        </>
                      ) : (
                        <>
                          {language === 'EN' ? "Transmit Brief" : "Kirim Brief"}
                          <Check className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
