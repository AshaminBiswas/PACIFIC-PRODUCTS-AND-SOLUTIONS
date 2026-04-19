import { motion } from "motion/react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { useGallery } from "../../lib/hooks";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: galleryImages, loading } = useGallery();

  // Extract unique categories dynamically, or keep a hardcoded list for consistency
  const uniqueCategories = Array.from(new Set(galleryImages.map(img => img.category))).filter(Boolean);
  const categories = ["all", ...uniqueCategories];

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-[#E9FDBF] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-[#030213] mb-6">
              Project <span className="text-[#7FB706]">Gallery</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Explore our portfolio of completed projects across various industries and applications
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-[#7FB706] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-[#E9FDBF]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
             <div className="text-center text-gray-500 py-10">Loading gallery images...</div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredImages.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="relative h-80">
                    <ImageWithFallback
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-white text-xl font-semibold">{item.title}</h3>
                        <p className="text-gray-300 text-sm capitalize">{item.category}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">No gallery images found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
