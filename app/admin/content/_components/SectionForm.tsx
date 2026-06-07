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

  // Fix hydration: gunakan useRef biasa (bukan inline function di JSX)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Fix hydration: gunakan useCallback agar ref callback stabil
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
      // Reset file input agar bisa upload ulang file yang sama
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
      const formData = new FormData(e.currentTarget);
      const data: Record<string, string> = {};

      fields.forEach((field) => {
        if (field.type === "image" || field.type === "toggle") {
          // image & toggle fields dikelola lewat state
          data[field.key] = contentMap[field.key] ?? (field.fallback || "");
        } else {
          const val = formData.get(field.key);
          if (val !== null) {
            data[field.key] = val.toString();
          }
        }
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

  const getValue = (key: string, fallback?: string) =>
    contentMap[key] !== undefined ? contentMap[key] : (fallback || "");

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 border border-gray-200">
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
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>{field.label}</Label>

          {field.type === "textarea" ? (
            <textarea
              id={field.key}
              name={field.key}
              // Gunakan value + onChange (controlled) untuk hindari hydration mismatch
              value={getValue(field.key, field.fallback)}
              onChange={(e) =>
                setContentMap(prev => ({ ...prev, [field.key]: e.target.value }))
              }
              rows={4}
              className="w-full flex min-h-[80px] rounded-none border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus:border-[#1B3B5A]"
            />
          ) : field.type === "image" ? (
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative w-full sm:w-48 aspect-video bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {getValue(field.key, field.fallback) ? (
                  <Image
                    src={getValue(field.key, field.fallback)}
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
                {/* Fix hydration: ref pakai useCallback, bukan inline arrow */}
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
                    : getValue(field.key, field.fallback)
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
                aria-checked={getValue(field.key, field.fallback) !== "false"}
                onClick={() => {
                  const current = getValue(field.key, field.fallback);
                  setContentMap(prev => ({
                    ...prev,
                    [field.key]: current === "false" ? "true" : "false",
                  }));
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B3B5A] focus:ring-offset-2 flex-shrink-0"
                style={{
                  backgroundColor:
                    getValue(field.key, field.fallback) !== "false" ? "#1B3B5A" : "#D1D5DB",
                }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  style={{
                    transform:
                      getValue(field.key, field.fallback) !== "false"
                        ? "translateX(22px)"
                        : "translateX(2px)",
                  }}
                />
              </button>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {getValue(field.key, field.fallback) !== "false"
                    ? "✅ Ditampilkan di website"
                    : "⬜ Disembunyikan dari website"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Klik untuk toggle</p>
              </div>
            </div>
          ) : (
            // text field: controlled untuk konsistensi
            <Input
              id={field.key}
              name={field.key}
              value={getValue(field.key, field.fallback)}
              onChange={(e) =>
                setContentMap(prev => ({ ...prev, [field.key]: e.target.value }))
              }
              className="rounded-none border-gray-300 focus:border-[#1B3B5A]"
            />
          )}
        </div>
      ))}

      <div className="pt-4">
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
