"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/app/actions/portfolio.actions";
import { uploadImage } from "@/app/actions/upload.actions";
import { parseDualLanguage, stringifyDualLanguage } from "@/lib/content-parser";

export type PortfolioItem = {
  id: string;
  title: string;
  projectType: string | null;
  imageUrl: string;
  description: string | null;
  detailImagesJson?: string | null;
};

export default function PortfolioItemsManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detailFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingDetail, setIsUploadingDetail] = useState(false);
  const [detailUploadError, setDetailUploadError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    titleId: "",
    titleEn: "",
    projectTypeId: "",
    projectTypeEn: "",
    imageUrl: "",
    descriptionId: "",
    descriptionEn: "",
    detailImages: [] as string[],
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getPortfolioItems();
    if (res.success && res.data) {
      setItems(res.data as any);
    }
    setLoading(false);
  };

  const handleOpenDialog = (item?: PortfolioItem) => {
    setUploadError(null);
    setDetailUploadError(null);
    setSaveError(null);
    if (item) {
      setEditingId(item.id);
      let details: string[] = [];
      if (item.detailImagesJson) {
        try {
          details = JSON.parse(item.detailImagesJson);
        } catch (e) {
          console.error("Failed to parse detail images:", e);
        }
      }
      setFormData({
        titleId: parseDualLanguage(item.title, 'id'),
        titleEn: parseDualLanguage(item.title, 'en'),
        projectTypeId: parseDualLanguage(item.projectType || "", 'id'),
        projectTypeEn: parseDualLanguage(item.projectType || "", 'en'),
        imageUrl: item.imageUrl,
        descriptionId: parseDualLanguage(item.description || "", 'id'),
        descriptionEn: parseDualLanguage(item.description || "", 'en'),
        detailImages: details,
      });
    } else {
      setEditingId(null);
      setFormData({
        titleId: "",
        titleEn: "",
        projectTypeId: "",
        projectTypeEn: "",
        imageUrl: "",
        descriptionId: "",
        descriptionEn: "",
        detailImages: [],
      });
    }
    setIsOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const res = await uploadImage(formDataObj);

      if (res && res.error) {
        setUploadError(`Upload gagal: ${res.error}`);
      } else if (res && res.url) {
        setFormData(prev => ({ ...prev, imageUrl: res.url as string }));
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setUploadError(`Terjadi kesalahan saat mengunggah gambar: ${err?.message || "Koneksi terputus"}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDetailImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingDetail(true);
    setDetailUploadError(null);

    try {
      const newUrls: string[] = [...formData.detailImages];
      
      for (let i = 0; i < files.length; i++) {
        if (newUrls.length >= 8) {
          setDetailUploadError("Maksimal 8 gambar detail.");
          break;
        }
        const file = files[i];
        const formDataObj = new FormData();
        formDataObj.append("file", file);

        const res = await uploadImage(formDataObj);
        if (res && res.url) {
          newUrls.push(res.url as string);
        } else if (res && res.error) {
          setDetailUploadError(`Upload gagal: ${res.error}`);
        }
      }
      
      setFormData(prev => ({ ...prev, detailImages: newUrls }));
    } catch (err: any) {
      console.error("Detail image upload error:", err);
      setDetailUploadError(`Gagal mengunggah beberapa gambar detail`);
    } finally {
      setIsUploadingDetail(false);
      if (detailFileInputRef.current) {
        detailFileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveDetailImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      detailImages: prev.detailImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleId || !formData.imageUrl) return;
    
    setSaving(true);
    setSaveError(null);
    
    const payload = {
      title: stringifyDualLanguage(formData.titleId, formData.titleEn || formData.titleId),
      projectType: formData.projectTypeId || formData.projectTypeEn
        ? stringifyDualLanguage(formData.projectTypeId, formData.projectTypeEn || formData.projectTypeId)
        : null,
      imageUrl: formData.imageUrl,
      description: formData.descriptionId || formData.descriptionEn
        ? stringifyDualLanguage(formData.descriptionId, formData.descriptionEn || formData.descriptionId)
        : null,
      detailImagesJson: JSON.stringify(formData.detailImages),
    };

    let res;
    if (editingId) {
      res = await updatePortfolioItem(editingId, payload);
    } else {
      res = await createPortfolioItem(payload);
    }
    
    if (res && !res.success) {
      setSaveError(res.error || "Gagal menyimpan data portfolio");
      setSaving(false);
      return;
    }
    
    setSaving(false);
    setIsOpen(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item portfolio ini?")) {
      await deletePortfolioItem(id);
      fetchItems();
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>Daftar Portfolio</h3>
        
        <Button onClick={() => handleOpenDialog()} className="bg-[#1B3B5A] hover:bg-[#2A517A] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Portfolio
        </Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto rounded-none">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
                {editingId ? "Edit Portfolio" : "Tambah Portfolio Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-4">
              {saveError && (
                <div className="text-xs text-red-600 bg-red-50 p-3 border border-red-100 rounded-none">
                  {saveError}
                </div>
              )}
              <div className="space-y-4">
                <Label className="font-semibold">Judul Proyek *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">🇮🇩 Indonesia</span>
                    <Input 
                      id="title-id"
                      value={formData.titleId}
                      onChange={e => setFormData({...formData, titleId: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">🇬🇧 English</span>
                    <Input 
                      id="title-en"
                      placeholder="Project Title (English)"
                      value={formData.titleEn}
                      onChange={e => setFormData({...formData, titleEn: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-semibold">Jenis Proyek (Opsional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">🇮🇩 Indonesia</span>
                    <Input 
                      id="projectType-id"
                      placeholder="Misal: Perencanaan / Full Kontraktor"
                      value={formData.projectTypeId}
                      onChange={e => setFormData({...formData, projectTypeId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">🇬🇧 English</span>
                    <Input 
                      id="projectType-en"
                      placeholder="e.g. Planning / Full Contractor"
                      value={formData.projectTypeEn}
                      onChange={e => setFormData({...formData, projectTypeEn: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Gambar Portfolio Utama (Cover) *</Label>
                {uploadError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 border border-red-100 rounded-none">{uploadError}</p>
                )}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="relative w-full sm:w-32 aspect-video bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Belum ada gambar</span>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-[#1B3B5A]" />
                        <span className="text-[10px] text-gray-500 mt-1">Mengunggah...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 w-full">
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
                      className="rounded-none border-gray-300 w-full hover:border-[#1B3B5A] text-gray-700"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <UploadCloud className="w-4 h-4 mr-2" />
                      {isUploading
                        ? "Mengunggah..."
                        : formData.imageUrl
                        ? "Ganti Gambar"
                        : "Unggah Gambar"}
                    </Button>
                    <p className="text-[10px] text-gray-500">
                      Format: JPG, PNG. Dioptimasi ke WebP. Maks 10MB.
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="imageUrl" className="text-xs text-gray-500">Atau masukkan URL Gambar langsung</Label>
                  <Input 
                    id="imageUrl"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    required
                    disabled={isUploading}
                    className="rounded-none"
                  />
                </div>
              </div>

              {/* Detail Images Section */}
              <div className="space-y-2 border-t pt-4">
                <Label>Gambar Detail Proyek (Maksimal 8 Gambar)</Label>
                {detailUploadError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 border border-red-100 rounded-none">{detailUploadError}</p>
                )}
                
                {formData.detailImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {formData.detailImages.map((url, idx) => (
                      <div key={idx} className="relative aspect-square bg-gray-100 border border-gray-200 group overflow-hidden">
                        <img src={url} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveDetailImage(idx)}
                          className="absolute inset-0 bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={detailFileInputRef}
                    onChange={handleDetailImagesUpload}
                    disabled={isUploadingDetail || formData.detailImages.length >= 8}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none border-gray-300 w-full hover:border-[#1B3B5A] text-gray-700 text-xs"
                    onClick={() => detailFileInputRef.current?.click()}
                    disabled={isUploadingDetail || formData.detailImages.length >= 8}
                  >
                    {isUploadingDetail ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                        Mengunggah...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5 mr-2" />
                        Tambah Gambar Detail ({formData.detailImages.length}/8)
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[9px] text-gray-500">
                  Anda dapat memilih beberapa gambar sekaligus. Rekomendasi 5 sampai 8 gambar detail.
                </p>
              </div>

              <div className="space-y-4 border-t pt-4">
                <Label className="font-semibold">Deskripsi Penjelasan Proyek (Opsional)</Label>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">🇮🇩 Indonesia</span>
                    <Textarea 
                      id="description-id"
                      placeholder="Jelaskan secara singkat latar belakang, konsep desain, atau detail teknis proyek..."
                      value={formData.descriptionId}
                      onChange={e => setFormData({...formData, descriptionId: e.target.value})}
                      rows={3}
                      className="rounded-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">🇬🇧 English</span>
                    <Textarea 
                      id="description-en"
                      placeholder="Briefly explain the project background, design concept, or technical details..."
                      value={formData.descriptionEn}
                      onChange={e => setFormData({...formData, descriptionEn: e.target.value})}
                      rows={3}
                      className="rounded-none"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={saving || isUploading || isUploadingDetail || !formData.titleId || !formData.imageUrl} className="bg-[#1B3B5A] text-white rounded-none">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-none text-gray-500 bg-gray-50">
          Belum ada item portfolio. Klik "Tambah Portfolio" untuk mulai menambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="border rounded-none overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-gray-100 relative group">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={parseDualLanguage(item.title, 'id')} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => handleOpenDialog(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                {item.projectType && (
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    {parseDualLanguage(item.projectType, 'id')}
                  </div>
                )}
                <h4 className="font-semibold text-lg leading-tight mb-2" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
                  {parseDualLanguage(item.title, 'id')}
                </h4>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {parseDualLanguage(item.description, 'id')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
