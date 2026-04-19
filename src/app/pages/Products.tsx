import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import { useSearchParams } from "react-router";
import { useProducts } from "../../lib/hooks";

export default function ProductsPage() {
  const { data: products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category === categoryFilter)
    : products;

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
              {categoryFilter ? (
                <>
                  <span className="text-[#7FB706]">{categoryFilter}</span>
                </>
              ) : (
                <>
                  Our <span className="text-[#7FB706]">Services</span>
                </>
              )}
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
          {loading ? (
            <div className="text-center text-gray-500">Loading services...</div>
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
