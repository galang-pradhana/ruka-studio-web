"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSectionContent } from "@/app/actions/content.actions";
import { uploadImage } from "@/app/actions/upload.actions";
import { LpSection, LpContent } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, UploadCloud, Loader2 } from "lucide-react";
import { parseDualLanguage, stringifyDualLanguage } from "@/lib/content-parser";

type FieldDefinition = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "toggle";
  fallback?: string;
};

type SectionFormProps = {
  section: LpSection;
  fields: FieldDefinition[];
  initialData: LpContent[];
};

export default function SectionForm({ section, fields, initialData }: SectionFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Convert initial data array to map
  const initialContentMap = initialData.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);

  const [contentMap, setContentMap] = useState<Record<string, string>>(initialContentMap);
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({});

  // Fix hydration: gunakan useRef biasa
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Fix hydration: gunakan useCallback
  const setFileInputRef = useCallback((key: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[key] = el;
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKeys(prev => ({ ...prev, [fieldKey]: true }));
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImage(formData);

      if (res && res.error) {
        setError(`Upload gagal: ${res.error}`);
      } else if (res && res.url) {
        setContentMap(prev => ({ ...prev, [fieldKey]: res.url as string }));
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(`Terjadi kesalahan saat mengunggah gambar: ${err?.message || "Koneksi terputus"}`);
    } finally {
      setUploadingKeys(prev => ({ ...prev, [fieldKey]: false }));
      if (fileInputRefs.current[fieldKey]) {
        fileInputRefs.current[fieldKey]!.value = "";
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const data: Record<string, string> = {};

      fields.forEach((field) => {
        // Semuanya diambil langsung dari contentMap state
        data[field.key] = contentMap[field.key] ?? (field.fallback || "");
      });

      const res = await saveSectionContent(section, data);

      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccessMsg("✅ Konten berhasil disimpan!");
        router.refresh();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      console.error("Section save error:", err);
      setError(`Gagal menyimpan konten: ${err?.message || "Kesalahan koneksi"}`);
    } finally {
      setIsPending(false);
    }
  }

  const getRawValue = (key: string, fallback?: string) =>
    contentMap[key] !== undefined ? contentMap[key] : (fallback || "");

  const getDualLangValue = (key: string, lang: 'id'|'en', fallback?: string) => {
    const rawVal = getRawValue(key, fallback);
    return parseDualLanguage(rawVal, lang, fallback);
  };

  const handleDualLangChange = (key: string, lang: 'id'|'en', value: string, fallback?: string) => {
    const currentRaw = getRawValue(key, fallback);
    const currentId = parseDualLanguage(currentRaw, 'id', fallback);
    const currentEn = parseDualLanguage(currentRaw, 'en', fallback);

    const newId = lang === 'id' ? value : currentId;
    const newEn = lang === 'en' ? value : currentEn;

    setContentMap(prev => ({ ...prev, [key]: stringifyDualLanguage(newId, newEn) }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white p-6 border border-gray-200">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 text-sm border border-red-100 rounded">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-3 text-sm border border-green-100 rounded">
          {successMsg}
        </div>
      )}

      {fields.map((field) => (
        <div key={field.key} className="space-y-4 pt-4 border-t border-gray-100 first:border-0 first:pt-0">
          <Label className="text-base font-semibold">{field.label}</Label>

          {field.type === "textarea" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">🇮🇩 Indonesia</span>
                <textarea
                  id={`${field.key}-id`}
                  value={getDualLangValue(field.key, 'id', field.fallback)}
                  onChange={(e) => handleDualLangChange(field.key, 'id', e.target.value, field.fallback)}
                  rows={4}
                  className="w-full flex min-h-[80px] rounded-none border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus:border-[#1B3B5A]"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">🇬🇧 English</span>
                <textarea
                  id={`${field.key}-en`}
                  value={getDualLangValue(field.key, 'en', field.fallback)}
                  onChange={(e) => handleDualLangChange(field.key, 'en', e.target.value, field.fallback)}
                  rows={4}
                  className="w-full flex min-h-[80px] rounded-none border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus:border-[#1B3B5A]"
                />
              </div>
            </div>
          ) : field.type === "image" ? (
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative w-full sm:w-48 aspect-video bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {getRawValue(field.key, field.fallback) ? (
                  <Image
                    src={getRawValue(field.key, field.fallback)}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs text-gray-400">Tidak ada gambar</span>
                )}
                {uploadingKeys[field.key] && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-[#1B3B5A]" />
                    <span className="text-xs text-gray-500 mt-1">Mengunggah...</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={setFileInputRef(field.key)}
                  onChange={(e) => handleImageUpload(e, field.key)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none border-gray-300 w-full hover:border-[#1B3B5A]"
                  onClick={() => fileInputRefs.current[field.key]?.click()}
                  disabled={uploadingKeys[field.key]}
                >
                  <UploadCloud className="w-4 h-4 mr-2" />
                  {uploadingKeys[field.key]
                    ? "Mengunggah..."
                    : getRawValue(field.key, field.fallback)
                    ? "Ganti Gambar"
                    : "Unggah Gambar"}
                </Button>
                <p className="text-xs text-gray-500">
                  Format: JPG, PNG. Dioptimasi ke WebP. Maks 10MB.
                </p>
              </div>
            </div>
          ) : field.type === "toggle" ? (
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200">
              <button
                type="button"
                role="switch"
                aria-checked={getRawValue(field.key, field.fallback) !== "false"}
                onClick={() => {
                  const current = getRawValue(field.key, field.fallback);
                  setContentMap(prev => ({
                    ...prev,
                    [field.key]: current === "false" ? "true" : "false",
                  }));
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B3B5A] focus:ring-offset-2 flex-shrink-0"
                style={{
                  backgroundColor:
                    getRawValue(field.key, field.fallback) !== "false" ? "#1B3B5A" : "#D1D5DB",
                }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-none bg-white transition-transform"
                  style={{
                    transform:
                      getRawValue(field.key, field.fallback) !== "false"
                        ? "translateX(22px)"
                        : "translateX(2px)",
                  }}
                />
              </button>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {getRawValue(field.key, field.fallback) !== "false"
                    ? "✅ Ditampilkan di website"
                    : "⬜ Disembunyikan dari website"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Klik untuk toggle</p>
              </div>
            </div>
          ) : (
            // text field: Dual Language
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">🇮🇩 Indonesia</span>
                <Input
                  id={`${field.key}-id`}
                  value={getDualLangValue(field.key, 'id', field.fallback)}
                  onChange={(e) => handleDualLangChange(field.key, 'id', e.target.value, field.fallback)}
                  className="rounded-none border-gray-300 focus:border-[#1B3B5A]"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">🇬🇧 English</span>
                <Input
                  id={`${field.key}-en`}
                  value={getDualLangValue(field.key, 'en', field.fallback)}
                  onChange={(e) => handleDualLangChange(field.key, 'en', e.target.value, field.fallback)}
                  className="rounded-none border-gray-300 focus:border-[#1B3B5A]"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="pt-6">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#1B3B5A] hover:bg-[#2C3E50] text-white rounded-none w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
