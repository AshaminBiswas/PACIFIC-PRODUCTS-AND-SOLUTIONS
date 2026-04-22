import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import { useSearchParams } from "react-router";
import { useProducts, usePageBanner } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

export default function ProductsPage() {
  const { data: products, loading } = useProducts();
  const { data: banner } = usePageBanner("services");
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const filteredProducts = categoryFilter
    ? products.filter(p => p.category === categoryFilter)
    : products;

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">
      {/* Hero Banner */}
      <section className="relative w-full h-[38vh] min-h-[260px] overflow-hidden">
        <ImageWithFallback
          src={banner?.image_url || DEFAULT_BG}
          alt="Services banner"
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
            {categoryFilter ? (
              <span className="text-[#B5F823]">{categoryFilter}</span>
            ) : banner?.title ? (
              banner.title
            ) : (
              <>Our <span className="text-[#B5F823]">Services</span></>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-gray-200 max-w-2xl"
          >
            {banner?.subtitle || "Explore our comprehensive range of premium interior solutions engineered for excellence and designed for modern spaces"}
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 sm:py-24 bg-transparent dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    title={product.title}
                    description={product.description || product.subtitle}
                    image={product.image_url}
                    path={`/products/${product.slug}`}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
