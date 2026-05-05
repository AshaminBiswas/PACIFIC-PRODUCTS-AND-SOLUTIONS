import { useState, useRef } from "react";
import { supabase, uploadFile, uploadImage } from "../../../lib/supabase";
import { useAdminCatalogs, useAdminProducts } from "../../../lib/hooks";
import type { Catalog } from "../../../lib/database.types";
import {
  Plus, Trash2, X, Upload, Eye, EyeOff, Pencil,
  FileText, Image as ImageIcon, Download, ExternalLink,
} from "lucide-react";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function AdminCatalogs() {
  const { data: catalogs, loading, refetch } = useAdminCatalogs();
  const { data: products } = useAdminProducts();

  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<"pdf" | "image">("pdf");
  const [fileSize, setFileSize] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [productId, setProductId] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  // Preview modal state
  const [previewCatalog, setPreviewCatalog] = useState<Catalog | null>(null);

  // Edit state — null means "create new", a string means "editing that id"
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFileUrl("");
    setFileType("pdf");
    setFileSize(0);
    setThumbnailUrl("");
    setProductId("");
    setErr("");
    setEditingId(null);
  };

  const startEdit = (cat: Catalog) => {
    setEditingId(cat.id);
    setTitle(cat.title);
    setDescription(cat.description);
    setFileUrl(cat.file_url);
    setFileType(cat.file_type);
    setFileSize(cat.file_size);
    setThumbnailUrl(cat.thumbnail_url);
    setProductId(cat.product_id || "");
    setErr("");
    setShow(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validate file type
    const isPdf = f.type === "application/pdf";
    const isImg = f.type.startsWith("image/");
    if (!isPdf && !isImg) {
      setErr("Only PDF and image files are allowed.");
      return;
    }

    setUploading(true);
    setErr("");

    try {
      const result = await uploadFile(f, "catalogs");
      if (result) {
        setFileUrl(result.url);
        setFileSize(result.size);
        setFileType(isPdf ? "pdf" : "image");
      } else {
        setErr("File upload failed. Please try again.");
      }
    } catch (ex: any) {
      setErr(ex.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadImage(f, "catalog-thumbnails");
    if (url) setThumbnailUrl(url);
  };

  const save = async () => {
    if (!title || !fileUrl || !productId) {
      setErr("Title, file, and service are required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      if (editingId) {
        // Update existing catalog
        const { error } = await supabase.from("catalogs").update({
          title,
          description,
          file_url: fileUrl,
          file_type: fileType,
          file_size: fileSize,
          thumbnail_url: thumbnailUrl,
          product_id: productId || null,
        }).eq("id", editingId);
        if (error) throw error;
      } else {
        // Insert new catalog
        const { error } = await supabase.from("catalogs").insert({
          title,
          description,
          file_url: fileUrl,
          file_type: fileType,
          file_size: fileSize,
          thumbnail_url: thumbnailUrl,
          product_id: productId || null,
          sort_order: catalogs.length + 1,
          published: true,
        });
        if (error) throw error;
      }
      setShow(false);
      resetForm();
      refetch();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this catalog?")) return;
    await supabase.from("catalogs").delete().eq("id", id);
    refetch();
  };

  const toggle = async (item: Catalog) => {
    await supabase.from("catalogs").update({ published: !item.published }).eq("id", item.id);
    refetch();
  };

  const getProductTitle = (pid: string | null) => {
    if (!pid) return "General";
    return products.find((p) => p.id === pid)?.title || "Unknown";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Catalogs</h1>
        <button
          onClick={() => { setShow(true); setErr(""); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] text-sm font-medium"
        >
          <Plus className="w-4 h-4" />Upload Catalog
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-20">Loading…</div>
      ) : catalogs.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No catalogs uploaded yet</p>
          <button
            onClick={() => setShow(true)}
            className="text-[#7FB706] hover:underline text-sm"
          >
            Upload your first catalog →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {catalogs.map((cat) => (
            <div
              key={cat.id}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5 hover:border-white/20 transition-colors"
            >
              {/* Thumbnail / Icon */}
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {cat.thumbnail_url ? (
                  <img
                    src={cat.thumbnail_url}
                    alt={cat.title}
                    className="w-full h-full object-cover"
                  />
                ) : cat.file_type === "pdf" ? (
                  <FileText className="w-7 h-7 text-red-400" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-blue-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{cat.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    cat.file_type === "pdf"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {cat.file_type === "pdf" ? (
                      <FileText className="w-3 h-3" />
                    ) : (
                      <ImageIcon className="w-3 h-3" />
                    )}
                    {cat.file_type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(cat.file_size)}
                  </span>
                  <span className="text-xs text-gray-500">
                    • {getProductTitle(cat.product_id)}
                  </span>
                </div>
                {cat.description && (
                  <p className="text-gray-500 text-xs mt-1 truncate">{cat.description}</p>
                )}
              </div>

              {/* Status badge */}
              {!cat.published && (
                <span className="px-2 py-0.5 bg-gray-800/80 text-gray-400 text-xs rounded-full">
                  Draft
                </span>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(cat)}
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-[#7FB706] hover:bg-white/10 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewCatalog(cat)}
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <a
                  href={cat.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-[#7FB706] hover:bg-white/10 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => toggle(cat)}
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title={cat.published ? "Unpublish" : "Publish"}
                >
                  {cat.published ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => del(cat.id)}
                  className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-[#0a0a1a] border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">{editingId ? "Edit Catalog" : "Upload Catalog"}</h3>
              <button
                onClick={() => { setShow(false); resetForm(); }}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {err && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
                  {err}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product Catalog 2026"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description of this catalog"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706] resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Catalog File * <span className="text-gray-500">(PDF or Image)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 text-sm disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading…" : "Choose File"}
                  </button>
                  {fileUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      {fileType === "pdf" ? (
                        <FileText className="w-4 h-4 text-red-400" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-green-400">✓ Uploaded</span>
                      <span className="text-gray-500">
                        ({formatFileSize(fileSize)})
                      </span>
                    </div>
                  )}
                </div>
                {fileUrl && fileType === "image" && (
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="mt-3 h-32 rounded-lg object-cover border border-white/10"
                  />
                )}
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Thumbnail <span className="text-gray-500">(optional, for PDF preview)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={thumbRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => thumbRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 text-sm"
                  >
                    <Upload className="w-4 h-4" />Upload Thumbnail
                  </button>
                  <input
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="or paste URL"
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  />
                </div>
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="mt-2 h-20 rounded-lg object-cover"
                  />
                )}
              </div>

              {/* Link to Product */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Link to Service *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                >
                  <option value="" disabled className="bg-[#0a0a1a]">
                    Select a service…
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0a0a1a]">
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => { setShow(false); resetForm(); }}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !title || !fileUrl || !productId}
                className="px-6 py-2 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] disabled:opacity-50 text-sm font-medium"
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Upload Catalog"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewCatalog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-4xl bg-[#0a0a1a] border border-white/10 rounded-2xl max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                {previewCatalog.file_type === "pdf" ? (
                  <FileText className="w-5 h-5 text-red-400" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">{previewCatalog.title}</h3>
                  <p className="text-xs text-gray-500">
                    {previewCatalog.file_type.toUpperCase()} • {formatFileSize(previewCatalog.file_size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewCatalog.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-gray-300 hover:bg-white/10 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />Open
                </a>
                <a
                  href={previewCatalog.file_url}
                  download
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#7FB706]/10 rounded-lg text-[#7FB706] hover:bg-[#7FB706]/20 text-sm"
                >
                  <Download className="w-4 h-4" />Download
                </a>
                <button
                  onClick={() => setPreviewCatalog(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="flex-1 overflow-hidden p-4 bg-gray-900/50">
              {previewCatalog.file_type === "pdf" ? (
                <iframe
                  src={previewCatalog.file_url}
                  className="w-full h-full min-h-[60vh] rounded-xl border border-white/10"
                  title={previewCatalog.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center overflow-auto">
                  <img
                    src={previewCatalog.file_url}
                    alt={previewCatalog.title}
                    className="max-w-full max-h-[70vh] rounded-xl object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
