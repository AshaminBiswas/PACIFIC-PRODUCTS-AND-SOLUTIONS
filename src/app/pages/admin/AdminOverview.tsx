import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Package, FileText, Lightbulb, ImageIcon } from "lucide-react";

export default function AdminOverview() {
  const [counts, setCounts] = useState({
    products: 0,
    blogs: 0,
    solutions: 0,
    gallery: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      const [p, b, s, g] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("solutions").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        products: p.count || 0,
        blogs: b.count || 0,
        solutions: s.count || 0,
        gallery: g.count || 0,
      });
    }
    fetchCounts();
  }, []);

  const cards = [
    { label: "Services", count: counts.products, icon: Package, color: "#7FB706" },
    { label: "Blog Posts", count: counts.blogs, icon: FileText, color: "#3B82F6" },
    { label: "Solutions", count: counts.solutions, icon: Lightbulb, color: "#F59E0B" },
    { label: "Gallery Images", count: counts.gallery, icon: ImageIcon, color: "#EC4899" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <span className="text-3xl font-bold text-white">{card.count}</span>
            </div>
            <p className="text-gray-400 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Start</h2>
        <div className="space-y-3 text-gray-400 text-sm">
          <p>
            ✅ Use the sidebar to manage <strong className="text-white">Services</strong>,{" "}
            <strong className="text-white">Blogs</strong>,{" "}
            <strong className="text-white">Solutions</strong>, and{" "}
            <strong className="text-white">Gallery</strong> images.
          </p>
          <p>
            📤 Upload images directly when creating or editing content — they're stored in Supabase Storage.
          </p>
          <p>
            🔒 Only published items are visible on the public website. Use the toggle to control visibility.
          </p>
          <p>
            🌐 Click <strong className="text-white">"View Site →"</strong> in the top bar to see changes live.
          </p>
        </div>
      </div>
    </div>
  );
}
