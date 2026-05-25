import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import { useSearchParams } from "react-router";
import { useProducts, usePageBanner } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SEO } from "../components/SEO";
import { DEFAULT_KEYWORDS } from "../../lib/seo-data";
import { PageHero } from "../components/PageHero";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

function toCategorySlug(category: string | undefined) {
  if (!category) return "";
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

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
      <SEO
        title="Our Products & Services"
        description="Explore our range of premium restroom cubicles, shower cubicles, exterior cladding, locker systems, wall paneling, and custom hardware solutions."
        keywords={`${DEFAULT_KEYWORDS}, premium restroom cubicles, shower partitions, HPL exterior cladding, commercial wall paneling, phenolic lockers, stainless steel cubicle hardware`}
        canonical="/products"
      />
      {/* Hero Banner */}
      <PageHero
        title="Our Services"
        accentWord="Services"
        subtitle="Explore our premium range of restroom cubicles, exterior cladding, locker systems, wall paneling, and custom hardware solutions for commercial spaces."
        breadcrumb="Services"
        backgroundImage={banner?.image_url}
      />

      {/* Products Grid */}
      <section className="py-16 sm:py-24 bg-transparent dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const catSlug = toCategorySlug(product.category);
                const productPath = catSlug
                  ? `/products/${catSlug}/${product.slug}`
                  : `/products/${product.slug}`;
                return (
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
                      path={productPath}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
