import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import {
  CheckCircle2, Shield, Zap, Award, ArrowRight, Phone,
  Clock, Wrench, BadgeCheck, Truck, HeadphonesIcon, Star,
} from "lucide-react";
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
  const navigate = useNavigate();
  const { data: product, loading } = useProduct(slug);
  const { data: catalogs } = useCatalogs(product?.id || undefined);
  const [showCatalogViewer, setShowCatalogViewer] = useState(false);
  const [currentMain, setCurrentMain] = useState<string | null>(null);
  const [currentThumbs, setCurrentThumbs] = useState<string[] | null>(null);

  const mainImage = currentMain || product?.image_url || "";
  const thumbnailImages = currentThumbs || product?.additional_images?.filter(Boolean).slice(0, 4) || [];

  const handleSwap = (idx: number) => {
    const clickedImg = thumbnailImages[idx];
    if (clickedImg === mainImage) return;
    const newThumbs = [...thumbnailImages];
    newThumbs[idx] = mainImage;
    setCurrentMain(clickedImg);
    setCurrentThumbs(newThumbs);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-[#030213]">
        <div className="text-center text-gray-500 dark:text-gray-400">Loading service...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-[#030213]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#030213] dark:text-white mb-4">Service Not Found</h1>
          <Button onClick={() => navigate("/products")}>View All Services</Button>
        </div>
      </div>
    );
  }

  const highlights = [
    { icon: BadgeCheck, label: "ISO Certified" },
    { icon: Clock, label: "Quick Turnaround" },
    { icon: Truck, label: "Pan-India Delivery" },
    { icon: Wrench, label: "Expert Installation" },
  ];

  const whyChooseUs = [
    { icon: Shield, title: "Quality Assured", desc: "Rigorous quality testing on all products with ISO-certified manufacturing processes." },
    { icon: Zap, title: "Fast Delivery", desc: "Industry-leading turnaround times with our optimized supply chain." },
    { icon: Award, title: "Expert Support", desc: "Dedicated project managers and technical assistance from start to finish." },
    { icon: HeadphonesIcon, title: "After-Sales Service", desc: "5-year warranty with responsive after-sales support across India." },
    { icon: Star, title: "Custom Solutions", desc: "Tailored designs to match your exact specifications and aesthetic requirements." },
    { icon: Truck, title: "Nationwide Reach", desc: "Installation network spanning all major cities and Tier-2 locations." },
  ];

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-[#030213] transition-colors">

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#E9FDBF]/60 to-white dark:from-[#0a1a00]/60 dark:to-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left: Info */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <button onClick={() => navigate("/")} className="hover:text-[#7FB706] transition-colors">Home</button>
                <span>/</span>
                <button onClick={() => navigate("/products")} className="hover:text-[#7FB706] transition-colors">Services</button>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">{product.title}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#030213] dark:text-white mb-4 leading-tight">
                {product.title}
              </h1>
              <p className="text-xl sm:text-2xl text-[#7FB706] font-medium mb-5">{product.subtitle}</p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-xl">
                {product.description}
              </p>

              {/* Quick Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-xl px-4 py-3 border border-gray-100 dark:border-white/10"
                  >
                    <h.icon className="w-5 h-5 text-[#7FB706] shrink-0" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{h.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/contact")}>
                  <Phone className="w-4 h-4 mr-2" />
                  Request Quote
                </Button>
                {catalogs.length > 0 && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
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

            {/* Right: Image Gallery */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] mb-4 bg-gray-100 dark:bg-gray-800">
                <ImageWithFallback src={mainImage} alt={product.title} className="w-full h-full object-cover transition-all duration-500" />
                {/* Category badge */}
                {product.category && (
                  <div className="absolute top-4 left-4 bg-[#7FB706] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {product.category}
                  </div>
                )}
              </div>
              {thumbnailImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {thumbnailImages.map((img, idx) => {
                    const isActive = img === mainImage;
                    return (
                      <button
                        key={img + idx}
                        onClick={() => handleSwap(idx)}
                        className={`relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 ${
                          isActive
                            ? "ring-2 ring-[#7FB706] ring-offset-2 ring-offset-white dark:ring-offset-[#030213] shadow-lg"
                            : "opacity-60 hover:opacity-100 border border-gray-200 dark:border-white/10"
                        }`}
                      >
                        <ImageWithFallback src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ KEY FEATURES ═══════════════════ */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#0a0a1a] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
              <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">What Sets Us Apart</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-4">Key Features</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover what makes our {product.title.toLowerCase()} the preferred choice
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.features.map((feature: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-start gap-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-6 hover:bg-[#E9FDBF]/20 dark:hover:bg-[#7FB706]/10 transition-all duration-300 border border-gray-100 dark:border-white/5 hover:border-[#7FB706]/30 dark:hover:border-[#7FB706]/30"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#7FB706]/10 dark:bg-[#7FB706]/15 flex items-center justify-center shrink-0 group-hover:bg-[#7FB706]/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-[#7FB706]" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed pt-1.5">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ SPECIFICATIONS + WHY CHOOSE US ═══════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-[#060620] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Specs */}
            {product.specifications && product.specifications.length > 0 && (
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">Technical Data</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-8">Specifications</h2>
                <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-lg dark:shadow-none border border-gray-100 dark:border-white/10">
                  {product.specifications.map((spec: ProductSpecification, index: number) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center px-6 py-4 ${
                        index % 2 === 0 ? "bg-gray-50/50 dark:bg-white/[0.02]" : ""
                      } ${index < product.specifications.length - 1 ? "border-b border-gray-100 dark:border-white/5" : ""}`}
                    >
                      <span className="font-semibold text-[#030213] dark:text-white text-sm">{spec.label}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Why Choose Us */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">Our Promise</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-8">Why Choose Us</h2>
              <div className="grid gap-4">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start gap-4 bg-white dark:bg-white/5 rounded-xl p-5 border border-gray-100 dark:border-white/10 hover:border-[#7FB706]/20 transition-colors"
                  >
                    <div className="w-11 h-11 bg-[#E9FDBF] dark:bg-[#7FB706]/15 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#7FB706]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#030213] dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ APPLICATIONS ═══════════════════ */}
      {product.applications && product.applications.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030213] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
              <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">Use Cases</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-4">Ideal Applications</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Perfect for various commercial and residential settings
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
              {product.applications.map((app: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-5 sm:px-7 py-3 bg-gradient-to-br from-[#7FB706] to-[#6fa005] text-white rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-[#7FB706]/15 hover:shadow-xl hover:shadow-[#7FB706]/25 hover:scale-105 transition-all"
                >
                  {app}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ OUR PROCESS ═══════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#E9FDBF]/20 to-white dark:from-[#0a0a1a] dark:to-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">How It Works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-4">Our Process</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From inquiry to installation — a seamless experience
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Consultation", desc: "Share your requirements and we'll provide expert guidance.", icon: Phone },
              { step: "02", title: "Custom Design", desc: "Tailored designs matching your specifications and budget.", icon: Wrench },
              { step: "03", title: "Manufacturing", desc: "Precision manufacturing in our ISO-certified facility.", icon: BadgeCheck },
              { step: "04", title: "Installation", desc: "Professional installation with minimal disruption.", icon: Truck },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative group"
              >
                <div className="bg-white dark:bg-[#0a0a1a] rounded-2xl p-6 sm:p-7 border border-gray-100 dark:border-white/5 h-full hover:border-[#7FB706]/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#7FB706]/10 flex items-center justify-center">
                      <p.icon className="w-5 h-5 text-[#7FB706]" />
                    </div>
                    <span className="text-3xl font-black text-[#7FB706]/20">{p.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
                {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[#7FB706]/25" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CATALOGS ═══════════════════ */}
      {catalogs.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-[#060620] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">Resources</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Download Catalogs</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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

      {showCatalogViewer && catalogs.length > 0 && (
        <CatalogViewerModal catalog={catalogs[0]} onClose={() => setShowCatalogViewer(false)} />
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#7FB706] to-[#5a8504] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B5F823] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Contact our team for detailed specifications, pricing, and project consultation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" onClick={() => navigate("/contact")}>
                Request Detailed Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button
                onClick={() => window.open("https://wa.me/919818592113", "_blank")}
                className="inline-flex items-center px-8 py-4 text-lg bg-white text-[#7FB706] rounded-xl hover:bg-gray-100 transition-all hover:scale-105 font-medium shadow-lg"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                WhatsApp Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}