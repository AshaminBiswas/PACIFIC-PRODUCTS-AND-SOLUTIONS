import { useState, useRef } from "react";
import { supabase, uploadImage } from "../../../lib/supabase";
import { useAdminProducts } from "../../../lib/hooks";
import type { Product } from "../../../lib/database.types";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Eye,
  EyeOff,
  Star,
  StarOff,
  GripVertical,
} from "lucide-react";

// Slug helper
function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Empty form ──────────────────────────────────────────────

const emptyForm = {
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  category: "",
  image_url: "",
  additional_images: [] as string[],
  features: [] as string[],
  specifications: [] as { label: string; value: string }[],
  applications: [] as string[],
  is_featured: false,
  sort_order: 0,
  published: false,
};

export default function AdminProducts() {
  const { data: products, loading, refetch } = useAdminProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Feature / spec / application string helpers ──
  const [newFeature, setNewFeature] = useState("");
  const [newApp, setNewApp] = useState("");
  const [newSpecLabel, setNewSpecLabel] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const PREDEFINED_CATEGORIES = ["Restroom Cubicles", "Shower Cubicles", "Exterior Cladding", "Locker System", "Custom Hardware", "Others"];

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: products.length + 1 });
    setCustomCategory("");
    setShowModal(true);
    setError("");
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    const isCustom = product.category && !PREDEFINED_CATEGORIES.includes(product.category);
    setForm({
      slug: product.slug,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      category: isCustom ? "Others" : product.category,
      image_url: product.image_url,
      additional_images: product.additional_images || [],
      features: [...product.features],
      specifications: product.specifications.map((s) => ({ ...s })),
      applications: [...product.applications],
      is_featured: product.is_featured,
      sort_order: product.sort_order,
      published: product.published,
    });
    setCustomCategory(isCustom ? product.category : "");
    setShowModal(true);
    setError("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "products");
    if (url) setForm((f) => ({ ...f, image_url: url }));
  };

  const additionalFileRef = useRef<HTMLInputElement>(null);

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (form.additional_images.length >= 4) {
      setError("Maximum 4 additional images allowed.");
      return;
    }
    const url = await uploadImage(file, "products");
    if (url) setForm((f) => ({ ...f, additional_images: [...f.additional_images, url] }));
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm((f) => ({ ...f, features: [...f.features, newFeature.trim()] }));
    setNewFeature("");
  };

  const addApplication = () => {
    if (!newApp.trim()) return;
    setForm((f) => ({ ...f, applications: [...f.applications, newApp.trim()] }));
    setNewApp("");
  };

  const addSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setForm((f) => ({
      ...f,
      specifications: [
        ...f.specifications,
        { label: newSpecLabel.trim(), value: newSpecValue.trim() },
      ],
    }));
    setNewSpecLabel("");
    setNewSpecValue("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const slug = form.slug || toSlug(form.title);
    const finalCategory = form.category === "Others" && customCategory.trim() !== "" ? customCategory.trim() : form.category;
    const payload = { ...form, slug, category: finalCategory };

    try {
      if (editing) {
        const { error: err } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("products").insert(payload);
        if (err) throw err;
      }
      setShowModal(false);
      refetch();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error: err } = await supabase.from("products").delete().eq("id", id);
    if (err) setError(err.message);
    else refetch();
  };

  const togglePublished = async (product: Product) => {
    await supabase
      .from("products")
      .update({ published: !product.published })
      .eq("id", product.id);
    refetch();
  };

  const toggleFeatured = async (product: Product) => {
    await supabase
      .from("products")
      .update({ is_featured: !product.is_featured })
      .eq("id", product.id);
    refetch();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Services</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-gray-400 text-center py-20">Loading services…</div>
      ) : products.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-gray-400 mb-4">No services yet</p>
          <button
            onClick={openCreate}
            className="text-[#7FB706] hover:underline text-sm"
          >
            Create your first service →
          </button>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-left">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-medium text-center">Featured</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="text-white font-medium">{product.title}</p>
                          <p className="text-gray-500 text-xs font-mono">
                            {product.category
                              ? `/products/${toSlug(product.category)}/${product.slug}`
                              : `/products/${product.slug}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleFeatured(product)}>
                        {product.is_featured ? (
                          <Star className="w-4 h-4 text-yellow-400 mx-auto" />
                        ) : (
                          <StarOff className="w-4 h-4 text-gray-600 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => togglePublished(product)}>
                        {product.published ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-500/15 text-green-400 rounded-full">
                            <Eye className="w-3 h-3" /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-500/15 text-gray-400 rounded-full">
                            <EyeOff className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal ────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 overflow-y-auto p-4 pt-12">
          <div className="w-full max-w-2xl bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editing ? "Edit Service" : "New Service"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      title: e.target.value,
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  placeholder="Product title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  placeholder={toSlug(form.title) || "auto-generated-from-title"}
                />
              </div>

              {/* Subtitle + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Subtitle
                  </label>
                  <input
                    value={form.subtitle}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subtitle: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 bg-[#0a0a1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  >
                    <option value="">Select Category</option>
                    <option value="Restroom Cubicles">Restroom Cubicles</option>
                    <option value="Shower Cubicles">Shower Cubicles</option>
                    <option value="Exterior Cladding">Exterior Cladding</option>
                    <option value="Locker System">Locker System</option>
                    <option value="Custom Hardware">Custom Hardware</option>
                    <option value="Others">Others</option>
                  </select>
                  {form.category === "Others" && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter custom category"
                      className="w-full mt-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706] resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Image</label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                  <input
                    value={form.image_url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, image_url: e.target.value }))
                    }
                    placeholder="or paste image URL"
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">Recommended: 800×600 px (4:3 ratio)</p>
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="mt-2 h-24 rounded-lg object-cover"
                  />
                )}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Additional Images (Max 4)</label>
                <div className="flex items-center gap-3">
                  <input
                    ref={additionalFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAdditionalImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => additionalFileRef.current?.click()}
                    disabled={form.additional_images.length >= 4}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 text-sm disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Additional
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">Recommended: 800×600 px (4:3 ratio)</p>
                {form.additional_images.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {form.additional_images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="h-24 w-24 rounded-lg object-cover border border-white/10" />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, additional_images: f.additional_images.filter((_, j) => j !== i) }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="Add feature"
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  />
                  <button
                    onClick={addFeature}
                    className="px-3 py-2 bg-[#7FB706]/20 text-[#7FB706] rounded-xl text-sm hover:bg-[#7FB706]/30"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                    >
                      {f}
                      <button
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            features: prev.features.filter((_, j) => j !== i),
                          }))
                        }
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Specifications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newSpecLabel}
                    onChange={(e) => setNewSpecLabel(e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  />
                  <input
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  />
                  <button
                    onClick={addSpec}
                    className="px-3 py-2 bg-[#7FB706]/20 text-[#7FB706] rounded-xl text-sm hover:bg-[#7FB706]/30"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {form.specifications.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg text-xs text-gray-300"
                    >
                      <span>
                        <strong className="text-white">{s.label}:</strong>{" "}
                        {s.value}
                      </span>
                      <button
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            specifications: prev.specifications.filter(
                              (_, j) => j !== i
                            ),
                          }))
                        }
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Applications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newApp}
                    onChange={(e) => setNewApp(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addApplication())
                    }
                    placeholder="Add application"
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]"
                  />
                  <button
                    onClick={addApplication}
                    className="px-3 py-2 bg-[#7FB706]/20 text-[#7FB706] rounded-xl text-sm hover:bg-[#7FB706]/30"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.applications.map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                    >
                      {a}
                      <button
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            applications: prev.applications.filter(
                              (_, j) => j !== i
                            ),
                          }))
                        }
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, published: e.target.checked }))
                    }
                    className="accent-[#7FB706] w-4 h-4"
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, is_featured: e.target.checked }))
                    }
                    className="accent-[#7FB706] w-4 h-4"
                  />
                  Featured
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300">Sort</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sort_order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-[#7FB706]"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title}
                className="px-6 py-2 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] disabled:opacity-50 text-sm font-medium"
              >
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
