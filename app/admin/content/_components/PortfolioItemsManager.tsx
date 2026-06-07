"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/app/actions/portfolio.actions";

export type PortfolioItem = {
  id: string;
  title: string;
  projectType: string | null;
  imageUrl: string;
  description: string | null;
};

export default function PortfolioItemsManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    projectType: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getPortfolioItems();
    if (res.success && res.data) {
      setItems(res.data);
    }
    setLoading(false);
  };

  const handleOpenDialog = (item?: PortfolioItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        projectType: item.projectType || "",
        imageUrl: item.imageUrl,
        description: item.description || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        projectType: "",
        imageUrl: "",
        description: "",
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) return;
    
    setSaving(true);
    
    const payload = {
      title: formData.title,
      projectType: formData.projectType || null,
      imageUrl: formData.imageUrl,
      description: formData.description || null,
    };

    if (editingId) {
      await updatePortfolioItem(editingId, payload);
    } else {
      await createPortfolioItem(payload);
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
                {editingId ? "Edit Portfolio" : "Tambah Portfolio Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Proyek *</Label>
                <Input 
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectType">Jenis Proyek (Opsional)</Label>
                <Input 
                  id="projectType"
                  placeholder="Misal: Perencanaan / Full Kontraktor"
                  value={formData.projectType}
                  onChange={e => setFormData({...formData, projectType: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Gambar *</Label>
                <div className="flex gap-2">
                  <Input 
                    id="imageUrl"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    required
                  />
                  {formData.imageUrl && (
                    <div className="w-10 h-10 rounded border overflow-hidden shrink-0">
                      <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={saving || !formData.title || !formData.imageUrl} className="bg-[#1B3B5A] text-white">
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
        <div className="text-center p-8 border border-dashed rounded-lg text-gray-500 bg-gray-50">
          Belum ada item portfolio. Klik "Tambah Portfolio" untuk mulai menambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-gray-100 relative group">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
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
                    {item.projectType}
                  </div>
                )}
                <h4 className="font-semibold text-lg leading-tight mb-2" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
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
