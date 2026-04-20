import { useState, useRef } from "react";
import { supabase, uploadImage } from "../../../lib/supabase";
import { useAdminGallery } from "../../../lib/hooks";
import type { GalleryImage } from "../../../lib/database.types";
import { Plus, Trash2, X, Upload, Eye, EyeOff } from "lucide-react";

const CATS = ["airports", "malls", "offices", "residential", "other"];

export default function AdminGallery() {
  const { data: images, loading, refetch } = useAdminGallery();
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [imageUrl, setImageUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadImage(f, "gallery");
    if (url) setImageUrl(url);
  };

  const save = async () => {
    setSaving(true); setErr("");
    try {
      const { error } = await supabase.from("gallery_images").insert({
        title, category, image_url: imageUrl,
        sort_order: images.length + 1, published: true,
      });
      if (error) throw error;
      setShow(false); setTitle(""); setCategory("other"); setImageUrl("");
      refetch();
    } catch (e: any) { setErr(e.message); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    refetch();
  };

  const toggle = async (img: GalleryImage) => {
    await supabase.from("gallery_images").update({ published: !img.published }).eq("id", img.id);
    refetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Gallery</h1>
        <button onClick={() => { setShow(true); setErr(""); }} className="flex items-center gap-2 px-4 py-2 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] text-sm font-medium">
          <Plus className="w-4 h-4" />Add Image
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-20">Loading…</div>
      ) : images.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-gray-400 mb-4">No gallery images yet</p>
          <button onClick={() => setShow(true)} className="text-[#7FB706] hover:underline text-sm">Upload your first image →</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <img src={img.image_url} alt={img.title} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => toggle(img)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                  {img.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => del(img.id)} className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate">{img.title}</p>
                <p className="text-gray-500 text-xs capitalize">{img.category}</p>
              </div>
              {!img.published && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-800/80 text-gray-400 text-xs rounded-full">Draft</div>
              )}
            </div>
          ))}
        </div>
      )}

      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md bg-[#0a0a1a] border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Add Gallery Image</h3>
              <button onClick={() => setShow(false)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {err && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">{err}</div>}
              <div><label className="block text-sm text-gray-300 mb-1">Title *</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]" /></div>
              <div><label className="block text-sm text-gray-300 mb-1">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]">{CATS.map(c => <option key={c} value={c} className="bg-[#0a0a1a]">{c}</option>)}</select></div>
              <div><label className="block text-sm text-gray-300 mb-1">Image *</label><div className="flex items-center gap-3"><input ref={fileRef} type="file" accept="image/*" onChange={handleImg} className="hidden" /><button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 text-sm"><Upload className="w-4 h-4" />Upload</button><input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="or paste URL" className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]" /></div><p className="text-xs text-gray-500 mt-1 font-medium">Recommended: Any ratio (masonry layout, max width 1000px)</p>{imageUrl && <img src={imageUrl} alt="" className="mt-2 h-24 rounded-lg object-cover" />}</div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button onClick={() => setShow(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
              <button onClick={save} disabled={saving || !title || !imageUrl} className="px-6 py-2 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] disabled:opacity-50 text-sm font-medium">{saving ? "Saving…" : "Add Image"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
