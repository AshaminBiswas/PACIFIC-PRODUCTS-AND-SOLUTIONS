import { motion } from "motion/react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "airports", "malls", "offices", "residential"];

  const galleryImages = [
    {
      id: 1,
      category: "airports",
      title: "Airport Restroom Facility",
      image: "https://images.unsplash.com/photo-1759497904878-82c9bb21b2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwb3J0JTIwbW9kZXJuJTIwcmVzdHJvb20lMjBmYWNpbGl0aWVzfGVufDF8fHx8MTc3NDc3Mjc5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      category: "malls",
      title: "Shopping Mall Interior",
      image: "https://images.unsplash.com/photo-1542883339-f2680a3e3996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzQ3NzI3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      category: "offices",
      title: "Corporate Office Washroom",
      image: "https://images.unsplash.com/photo-1686100510109-d520e59bf0ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZyUyMGludGVyaW9yfGVufDF8fHx8MTc3NDc3Mjc5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 4,
      category: "residential",
      title: "Luxury Residential Bathroom",
      image: "https://images.unsplash.com/photo-1774578342098-66adff9c1fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNpZGVudGlhbCUyMGJhdGhyb29tJTIwZGVzaWdufGVufDF8fHx8MTc3NDc3Mjc5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 5,
      category: "offices",
      title: "Commercial Restroom Cubicles",
      image: "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0cm9vbSUyMGN1YmljbGVzJTIwY29tbWVyY2lhbHxlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 6,
      category: "malls",
      title: "Retail Space Interior Paneling",
      image: "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBjbGFkZGluZyUyMHBhbmVsc3xlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

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
                    src={item.image}
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
        </div>
      </section>
    </div>
  );
}
