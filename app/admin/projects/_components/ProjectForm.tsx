"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveProject } from "@/app/actions/project.actions";
import { uploadImage } from "@/app/actions/upload.actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, Loader2 } from "lucide-react";

type ProjectData = {
  id?: string;
  title: string;
  description: string | null;
  imageUrl: string;
  projectType: string | null;
  orderIndex: number | null;
  isActive: boolean;
};

export default function ProjectForm({ initialData }: { initialData?: ProjectData }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState(initialData?.description || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImage(formData);

    if (res.error) {
      setError(res.error);
    } else if (res.url) {
      setImageUrl(res.url);
    }

    setIsUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setFieldErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add image url to formData since it's managed by state
      if (imageUrl) {
        formData.set("imageUrl", imageUrl);
      }

      // Set isActive as a string "true" or "false" based on checkbox
      const isActive = (e.currentTarget.elements.namedItem("isActive") as HTMLInputElement).checked;
      formData.set("isActive", isActive.toString());

      if (initialData?.id) {
        formData.set("id", initialData.id);
      }

      const res = await saveProject(null, formData);

      if (res.error) {
        setError(res.error);
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
        setIsPending(false);
      } else {
        router.push("/admin/projects");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Submit project error:", err);
      setError(err?.message || "Terjadi kesalahan saat menghubungi server.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 border border-gray-200">
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 text-sm border border-red-100 mb-6">
          <p className="font-semibold">{error}</p>
          {Object.keys(fieldErrors).length > 0 && (
            <ul className="mt-2 list-disc list-inside">
              {Object.entries(fieldErrors).map(([field, errors]) => (
                <li key={field}>
                  <span className="capitalize">{field}</span>: {errors.join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Nama Proyek</Label>
        <Input 
          id="title" 
          name="title" 
          defaultValue={initialData?.title} 
          required 
          className="rounded-none border-gray-300 focus:border-[#1A2530]"
        />
        {fieldErrors.title && <p className="text-xs text-red-500">{fieldErrors.title.join(", ")}</p>}
      </div>

      <div className="space-y-2">
        <Label>Foto Proyek (Wajib)</Label>
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-32 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            ) : (
              <span className="text-xs text-gray-400">Tidak ada gambar</span>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[#1A2530]" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload}
            />
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-none border-gray-300 w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              {isUploading ? "Mengunggah..." : (imageUrl ? "Ganti Gambar" : "Unggah Gambar")}
            </Button>
            <p className="text-xs text-gray-500">
              Format yang didukung: JPG, PNG. Gambar akan otomatis dioptimasi ke format WebP.
            </p>
          </div>
        </div>
        {fieldErrors.imageUrl && <p className="text-xs text-red-500">{fieldErrors.imageUrl.join(", ")}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">Tipe Proyek</Label>
        <Input 
          id="projectType" 
          name="projectType" 
          defaultValue={initialData?.projectType || ""} 
          placeholder="Cth: Residensial, Komersial"
          className="rounded-none border-gray-300 focus:border-[#1A2530]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full flex min-h-[80px] rounded-none border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:border-[#1A2530]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="orderIndex">Urutan Tampil (Angka)</Label>
          <Input 
            id="orderIndex" 
            name="orderIndex" 
            type="number"
            defaultValue={initialData?.orderIndex ?? 0} 
            className="rounded-none border-gray-300 focus:border-[#1A2530]"
          />
        </div>
        
        <div className="space-y-2 flex flex-col justify-end pb-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              name="isActive"
              id="isActive"
              defaultChecked={initialData ? initialData.isActive : true}
              className="rounded-none border-gray-300 text-[#1A2530] focus:ring-[#1A2530] w-4 h-4"
            />
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tampilkan di Website
            </span>
          </label>
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="rounded-none border-gray-300 min-w-[120px]"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          className="bg-[#1A2530] hover:bg-[#2C3E50] text-[#E8E1D5] rounded-none min-w-[150px]"
          disabled={isPending || (!imageUrl && !initialData?.imageUrl)}
        >
          {isPending ? "Menyimpan..." : "Simpan Proyek"}
        </Button>
      </div>
    </form>
  );
}
