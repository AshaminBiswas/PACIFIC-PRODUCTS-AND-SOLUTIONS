import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { CheckCircle2, Shield, Zap, Award } from "lucide-react";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { useProduct, useCatalogs } from "../../lib/hooks";
import { CatalogCard, CatalogViewerModal } from "../components/CatalogViewer";
import { useState } from "react";

interface ProductSpecification {
  label: string;
  value: string;
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // 3. Initialize the navigate hook
  const navigate = useNavigate(); 
  
  const { data: product, loading } = useProduct(slug);
  const { data: catalogs } = useCatalogs(product?.id || undefined);
  const [showCatalogViewer, setShowCatalogViewer] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-gray-500">Loading service...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#030213] mb-4">Service Not Found</h1>
          {/* 4. Swapped window.location for navigate() */}
          <Button onClick={() => navigate("/products")}>View All Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-[#E9FDBF] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-[#030213] mb-4">
                {product.title}
              </h1>
              <p className="text-2xl text-[#7FB706] mb-6">{product.subtitle}</p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-4">
                {/* 5. Swapped window.location for navigate() */}
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Request Quote
                </Button>
                {catalogs.length > 0 && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      // Directly download the first catalog file
                      const link = document.createElement('a');
                      link.href = catalogs[0].file_url;
                      link.target = '_blank';
                      link.download = catalogs[0].title || 'catalog';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download Catalog
                  </Button>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <ImageWithFallback
                src={product.image_url}
                alt={product.title}
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      {product.additional_images && product.additional_images.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.additional_images.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.title} gallery ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-xl shadow-lg"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#030213] mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What makes our {product.title.toLowerCase()} stand out
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-3 bg-gray-50 rounded-xl p-6 hover:bg-[#E9FDBF]/30 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-[#7FB706] flex-shrink-0 mt-1" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-[#030213] mb-8">Technical Specifications</h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {/* 6. Applied ProductSpecification type */}
                {product.specifications.map((spec: ProductSpecification, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0"
                  >
                    <span className="font-semibold text-[#030213]">{spec.label}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-[#030213] mb-8">Why Choose Us</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Quality Assured",
                    description: "All products undergo rigorous quality testing",
                  },
                  {
                    icon: Zap,
                    title: "Fast Delivery",
                    description: "Quick turnaround time on all orders",
                  },
                  {
                    icon: Award,
                    title: "Expert Support",
                    description: "Technical assistance throughout your project",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-white rounded-xl p-6">
                    <div className="w-12 h-12 bg-[#E9FDBF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-[#7FB706]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#030213] mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#030213] mb-4">Ideal Applications</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Perfect for various commercial and residential settings
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {product.applications.map((app: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-3 bg-gradient-to-br from-[#7FB706] to-[#B5F823] text-white rounded-full font-semibold"
              >
                {app}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogs Section */}
      {catalogs.length > 0 && (
        <section className="py-24 bg-white dark:bg-[#030213]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-[#030213] dark:text-white mb-4">
                Download Catalogs
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Access detailed product catalogs, brochures, and resources
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {catalogs.map((catalog) => (
                <CatalogCard key={catalog.id} catalog={catalog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catalog Viewer Modal */}
      {showCatalogViewer && catalogs.length > 0 && (
        <CatalogViewerModal
          catalog={catalogs[0]}
          onClose={() => setShowCatalogViewer(false)}
        />
      )}

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#030213] to-[#1a1a2e] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Contact our team for detailed specifications, pricing, and project consultation
            </p>
            {/* 7. Swapped window.location for navigate() */}
            <Button size="lg" variant="secondary" onClick={() => navigate("/contact")}>
              Request Detailed Quote
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}