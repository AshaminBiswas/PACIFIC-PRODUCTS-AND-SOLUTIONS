import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";

export default function ProductsPage() {
  const products = [
    {
      title: "Restroom Cubicles",
      description: "Premium commercial restroom cubicle systems designed for durability and aesthetic appeal.",
      image: "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0cm9vbSUyMGN1YmljbGVzJTIwY29tbWVyY2lhbHxlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      path: "/products/restroom-cubicles",
    },
    {
      title: "Toilet Cubicles",
      description: "Modern toilet partition systems offering privacy, durability, and contemporary style.",
      image: "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0cm9vbSUyMGN1YmljbGVzJTIwY29tbWVyY2lhbHxlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      path: "/products/toilet-cubicles",
    },
    {
      title: "Toilet Partitions",
      description: "Versatile partition solutions that maximize space efficiency and provide privacy.",
      image: "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0cm9vbSUyMGN1YmljbGVzJTIwY29tbWVyY2lhbHxlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      path: "/products/toilet-partitions",
    },
    {
      title: "Cubicle Hardware",
      description: "Premium fittings and accessories engineered for smooth operation and durability.",
      image: "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBjbGFkZGluZyUyMHBhbmVsc3xlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      path: "/products/cubicle-hardware",
    },
    {
      title: "Exterior Cladding",
      description: "Weather-resistant cladding solutions that protect and enhance building facades.",
      image: "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBjbGFkZGluZyUyMHBhbmVsc3xlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      path: "/products/exterior-cladding",
    },
    {
      title: "Interior Paneling",
      description: "Sophisticated wall paneling systems for creating premium interior spaces.",
      image: "https://images.unsplash.com/photo-1686100510109-d520e59bf0ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZyUyMGludGVyaW9yfGVufDF8fHx8MTc3NDc3Mjc5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      path: "/products/interior-paneling",
    },
    {
      title: "Acrylic Solid Surface",
      description: "Seamless acrylic surfaces perfect for countertops, vanities, and decorative applications.",
      image: "https://images.unsplash.com/photo-1774578342098-66adff9c1fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNpZGVudGlhbCUyMGJhdGhyb29tJTIwZGVzaWdufGVufDF8fHx8MTc3NDc3Mjc5OHww&ixlib=rb-4.1.0&q=80&w=1080",
      path: "/products/acrylic-solid-surface",
    },
  ];

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
              Our <span className="text-[#7FB706]">Products</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Explore our comprehensive range of premium interior solutions engineered for excellence and designed for modern spaces
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
