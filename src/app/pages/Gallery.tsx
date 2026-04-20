import { motion } from "motion/react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useGallery, usePageBanner } from "../../lib/hooks";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: galleryImages, loading } = useGallery();
  const { data: banner } = usePageBanner("gallery");

  const uniqueCategories = Array.from(new Set(galleryImages.map(img => img.category))).filter(Boolean);
  const categories = ["all", ...uniqueCategories];

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-[#030213] transition-colors">
      {/* Hero Banner */}
      <section className="relative w-full h-[38vh] min-h-[260px] overflow-hidden">
        <ImageWithFallback
          src={banner?.image_url || DEFAULT_BG}
          alt="Gallery banner"
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            {banner?.title ? (
              banner.title
            ) : (
              <>Project <span className="text-[#B5F823]">Gallery</span></>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-gray-200 max-w-2xl"
          >
            {banner?.subtitle || "Explore our portfolio of completed projects across various industries and applications"}
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white dark:bg-[#0a0a1a] border-b border-gray-200 dark:border-white/5 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl transition-all capitalize font-medium ${
                  selectedCategory === category
                    ? "bg-[#7FB706] text-white shadow-lg shadow-[#7FB706]/30"
                    : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-[#E9FDBF] dark:hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
             <div className="text-center text-gray-500 py-10">Loading gallery images...</div>
          ) : filteredImages.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {filteredImages.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg border border-gray-200/50 dark:border-white/5 hover:shadow-2xl transition-all cursor-pointer break-inside-avoid"
                >
                  <ImageWithFallback
                    src={item.image_url}
                    alt={item.title}
                    className="w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-[#B5F823] text-sm font-medium capitalize">{item.category}</p>
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
