import { useState, useRef } from "react";
import { supabase, uploadImage } from "../../../lib/supabase";
import { useAdminHeroImages } from "../../../lib/hooks";
import type { HeroImage } from "../../../lib/database.types";
import {
  Upload,
  Trash2,
  ImageIcon,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const MAX_IMAGES = 10;

export default function AdminHero() {
  const { data: images, loading, refetch } = useAdminHeroImages();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      showToast("error", `Maximum ${MAX_IMAGES} images allowed. Please delete one first.`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    if (files.length > remaining) {
      showToast("error", `Only ${remaining} slot(s) left. Uploading first ${remaining} file(s).`);
    }

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];

      // Validate type
      if (!file.type.startsWith("image/")) {
        showToast("error", `"${file.name}" is not an image file.`);
        continue;
      }

      // Validate size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast("error", `"${file.name}" exceeds 10 MB limit.`);
        continue;
      }

      const url = await uploadImage(file, "hero");
      if (!url) {
        showToast("error", `Failed to upload "${file.name}". Check Supabase Storage bucket.`);
        continue;
      }

      const nextOrder = (images[images.length - 1]?.sort_order ?? -1) + 1 + i;
      const { error } = await supabase
        .from("hero_images")
        .insert({ url, sort_order: nextOrder });

      if (error) {
        showToast("error", `DB error: ${error.message}`);
      } else {
        successCount++;
      }
    }

    if (successCount > 0) {
      showToast("success", `${successCount} image${successCount > 1 ? "s" : ""} uploaded successfully!`);
      refetch();
    }

    setUploading(false);
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(img: HeroImage) {
    if (!confirm("Delete this hero image?")) return;
    setDeletingId(img.id);

    const { error } = await supabase.from("hero_images").delete().eq("id", img.id);
    if (error) {
      showToast("error", `Delete failed: ${error.message}`);
    } else {
      showToast("success", "Image deleted.");
      refetch();
    }

    setDeletingId(null);
  }

  async function handleMove(img: HeroImage, direction: "up" | "down") {
    const idx = images.findIndex((i) => i.id === img.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= images.length) return;

    const other = images[swapIdx];

    // Swap sort_order values
    await Promise.all([
      supabase.from("hero_images").update({ sort_order: other.sort_order }).eq("id", img.id),
      supabase.from("hero_images").update({ sort_order: img.sort_order }).eq("id", other.id),
    ]);

    refetch();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium border transition-all duration-300 ${
            toast.type === "success"
              ? "bg-[#1a2e00] border-[#7FB706]/40 text-[#B5F823]"
              : "bg-[#2e0000] border-red-500/40 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Hero Background Images</h1>
          <p className="text-gray-400 text-sm">
            Upload up to {MAX_IMAGES} images. They will appear as an auto-advancing slideshow on the home page hero section.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              images.length >= MAX_IMAGES
                ? "bg-red-500/15 text-red-400"
                : "bg-[#7FB706]/15 text-[#7FB706]"
            }`}
          >
            {images.length} / {MAX_IMAGES}
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= MAX_IMAGES}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#7FB706] text-white rounded-xl text-sm font-semibold hover:bg-[#6fa005] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#7FB706]/20"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading…" : "Upload Images"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Limit warning */}
      {images.length >= MAX_IMAGES && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Maximum of {MAX_IMAGES} images reached. Delete an image before uploading more.
        </div>
      )}

      {/* Image Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          Loading images…
        </div>
      ) : images.length === 0 ? (
        /* Empty state */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center py-20 cursor-pointer hover:border-[#7FB706]/40 hover:bg-[#7FB706]/5 transition-all group"
        >
          <ImageIcon className="w-12 h-12 text-gray-600 group-hover:text-[#7FB706]/60 mb-4 transition-colors" />
          <p className="text-gray-400 text-base font-medium mb-1">No hero images yet</p>
          <p className="text-gray-600 text-sm">Click to upload your first image</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative rounded-2xl overflow-hidden bg-[#0a0a1a] border border-white/8 hover:border-[#7FB706]/30 transition-all"
            >
              {/* Image */}
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={img.url}
                  alt={`Hero background ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Order badge */}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">
                  #{idx + 1}
                </div>

                {/* Action buttons */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  {/* Move up */}
                  <button
                    onClick={() => handleMove(img, "up")}
                    disabled={idx === 0}
                    className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-[#7FB706] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>

                  {/* Move down */}
                  <button
                    onClick={() => handleMove(img, "down")}
                    disabled={idx === images.length - 1}
                    className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-[#7FB706] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(img)}
                    disabled={deletingId === img.id}
                    className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                    title="Delete image"
                  >
                    {deletingId === img.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Drag handle (visual only) */}
                <div className="absolute top-3 right-3 text-white/40">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      {images.length > 0 && (
        <p className="mt-6 text-xs text-gray-600 text-center">
          Hover over an image to see reorder and delete controls. Images display in order #1 → #{images.length} on the live site.
        </p>
      )}
    </div>
  );
}
