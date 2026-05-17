import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Shield,
  Users,
  Award,
  Lightbulb,
  Factory,
  Target,
  CheckCircle2,
  Building2,
  ShoppingBag,
  Plane,
  Home,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { ServiceCard } from "../components/ServiceCard";
import { ProductCard } from "../components/ProductCard";
import { TestimonialCarousel } from "../components/TestimonialCarousel";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useRef, useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────

// ── Hero Background Slideshow ─────────────────────────────────

interface HeroSlideshowProps {
  images: { url: string; description: string }[];
  onSlideChange: (index: number) => void;
}

function HeroSlideshow({ images, onSlideChange }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  function goTo(i: number) {
    setCurrent(i);
    onSlideChange(i);
  }

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % images.length;
        onSlideChange(next);
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length, onSlideChange]);

  return (
    <div className="absolute inset-0 z-0">
      {images.map((img, i) => (
        <img
          key={img.url}
          src={img.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
      {/* Base dark overlay */}
      <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" />
      {/* Vignette — darker edges from all sides */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.97) 100%)",
        }}
      />

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/40 hover:bg-white/70 w-2"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}



// ── Hero Section (extracted as its own component) ─────────────

function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [quoteHovered, setQuoteHovered] = useState(false);
  const [productHovered, setProductHovered] = useState(false);
  const { data: heroImages } = useHeroImages();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeDescription =
    heroImages.length > 0 && heroImages[currentSlide]?.description
      ? heroImages[currentSlide].description
      : "Premium restroom cubicles, cladding, and paneling solutions for architects, builders, and corporate clients worldwide";

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-end justify-center overflow-hidden pt-0 sm:pt-16 lg:pt-20"
    >
      {/* Hero Background: slideshow if images exist, else animated gradient */}
      {heroImages.length > 0 ? (
        <HeroSlideshow
          images={heroImages.map((img) => ({ url: img.url, description: img.description }))}
          onSlideChange={setCurrentSlide}
        />
      ) : (
        <motion.div style={{ y }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0ffc8]/80 via-white/60 to-[#e6fdb0]/80 dark:from-[#030213] dark:via-[#030213] dark:to-[#0a0a1a]" />
          <motion.div
            className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(127,183,6,0.35) 0%, rgba(127,183,6,0) 70%)", filter: "blur(48px)" }}
            animate={{ scale: [1, 1.15, 1], x: [0, 24, 0], y: [0, 16, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(181,248,35,0.28) 0%, rgba(181,248,35,0) 70%)", filter: "blur(56px)" }}
            animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 28, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.div
            className="absolute -bottom-32 left-1/3 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(127,183,6,0.22) 0%, rgba(127,183,6,0) 70%)", filter: "blur(40px)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(233,253,191,0.5) 0%, rgba(233,253,191,0) 70%)", filter: "blur(32px)" }}
            animate={{ scaleX: [1, 1.08, 1], scaleY: [1, 1.12, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #7FB706 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #7FB706 0px, transparent 1px, transparent 40px)" }}
          />
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 text-center pb-[20vh]"
      >
        {/* Badge
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#7FB706]/10 border border-[#7FB706]/25 text-[#4a7002] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#7FB706] animate-pulse" />
          Trusted by 250+ clients worldwide
        </motion.div> */}



        {/* Sub-headline — shows current slide description or static fallback */}
        <motion.p
          key={currentSlide}
          className="text-lg sm:text-xl md:text-2xl text-white/95 mb-10 sm:mb-12 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-medium"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 2px 20px rgba(0,0,0,0.7)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeDescription}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-row gap-1.5 sm:gap-4 justify-center items-center mb-6 sm:mb-16 lg:mb-2 w-full px-2 sm:px-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.div
            className="flex-1 sm:flex-none w-full sm:w-auto"
            onHoverStart={() => setQuoteHovered(true)}
            onHoverEnd={() => setQuoteHovered(false)}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size="lg"
              className="w-full relative overflow-hidden px-2 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-base font-semibold shadow-lg shadow-[#7FB706]/25 transition-shadow hover:shadow-xl hover:shadow-[#7FB706]/35"
              onClick={() => navigate("/contact")}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
                Get Quote
                <motion.span
                  animate={{ x: quoteHovered ? 4 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </Button>
          </motion.div>

          <motion.div
            className="flex-1 sm:flex-none w-full sm:w-auto"
            onHoverStart={() => setProductHovered(true)}
            onHoverEnd={() => setProductHovered(false)}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full px-2 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-base font-semibold backdrop-blur-sm border-[#7FB706]/40 hover:bg-[#7FB706]/5 hover:border-[#7FB706]/30 hover:text-gray-900 dark:hover:text-white dark:text-gray-300 transition-all"
              onClick={() => navigate("/products")}
            >
              <span className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
                View Services
                <motion.span
                  animate={{ x: productHovered ? 4 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </motion.span>
              </span>
            </Button>
          </motion.div>
        </motion.div>



      </motion.div>


    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────

import { useProducts, useSolutions, useHeroImages, useCoreServices } from "../../lib/hooks";
import { DynamicIcon } from "../components/DynamicIcon";
import { ImageWithFallback as SolutionImage } from "../components/figma/ImageWithFallback";
import { CoreServiceCard } from "../components/CoreServiceCard";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: allProducts, loading } = useProducts();
  const featuredProducts = allProducts?.filter(p => p.is_featured).slice(0, 3) || [];

  const { data: solutions, loading: loadingSolutions } = useSolutions();
  const { data: coreServices, loading: loadingCoreServices } = useCoreServices();

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <HeroSection />

      {/* Featured Products */}


      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-transparent dark:bg-[#030213] text-gray-900 dark:text-white transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-[#7FB706]">
              Featured Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              Explore our range of premium interior solutions
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading featured services...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  description={product.description || product.subtitle}
                  image={product.image_url}
                  path={`/products/${product.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">No featured services yet. Add some in the Admin panel!</div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button size="lg" variant="outline" onClick={() => navigate("/products")}>
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Our Solutions */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white/40 dark:bg-[#0a0a1a] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-3 sm:mb-4">
              Our Solutions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              Industry-specific solutions tailored to meet your unique requirements
            </p>
          </motion.div>

          {loadingSolutions ? (
            <div className="text-center text-gray-500 py-10">Loading solutions...</div>
          ) : solutions && solutions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {solutions.slice(0, 6).map((solution, index) => (
                  <motion.div
                    key={solution.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8 }}
                    className="group relative flex flex-col bg-white dark:bg-[#0a0a1a] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    onClick={() => navigate(`/solutions/${solution.slug}`)}
                  >
                    {/* Dynamic Hover Glow Border */}
                    <div
                      className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                      style={{ boxShadow: `inset 0 0 0 1.5px #7FB706` }}
                    />

                    {/* Top Section: Image area */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900 z-10">
                      <SolutionImage
                        src={solution.image_url}
                        alt={solution.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                      {/* Brand Green overlay on hover */}
                      <div
                        className="absolute inset-0 bg-[#7FB706] opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay"
                      />

                      {/* Floating Icon */}
                      <div className="absolute bottom-4 left-6 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[#7FB706]/20 group-hover:border-[#7FB706]/50 transition-colors duration-500">
                          <DynamicIcon name={solution.icon_name} className="w-6 h-6 text-[#B5F823]" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section: Content area */}
                    <div className="flex flex-col flex-1 p-6 sm:p-8 z-10 relative bg-white dark:bg-[#0a0a1a]">
                      {/* Title & Arrow */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-[#7FB706]">
                          {solution.title}
                        </h3>
                        <motion.div
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-[#7FB706] group-hover:text-white transition-colors duration-500 shrink-0 mt-1"
                        >
                          <ArrowRight className="w-5 h-5 transform transition-transform duration-500 group-hover:translate-x-1" />
                        </motion.div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-6 line-clamp-3">
                        {solution.subtitle || solution.description}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto pt-5 border-t border-gray-100 dark:border-white/10 flex items-center text-sm font-semibold text-gray-400 group-hover:text-[#7FB706] transition-colors duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#7FB706] to-[#B5F823] group-hover:w-full transition-all duration-700 ease-out" />
                        Explore Solution
                        <ArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {solutions.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mt-8 sm:mt-12"
                >
                  <Button size="lg" variant="outline" onClick={() => navigate("/solutions")}>
                    View All Solutions
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No solutions yet. Add some from the Admin Dashboard!
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#E9FDBF]/30 to-white dark:from-[#0a0a1a] dark:to-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-3 sm:mb-4">
              Our Process
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              A streamlined approach from consultation to installation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Consultation", description: "We discuss your requirements, space constraints, and design preferences." },
              { step: "02", title: "Design & Quote", description: "Our team creates custom designs and provides a detailed, transparent quote." },
              { step: "03", title: "Manufacturing", description: "Products are precision-manufactured in our ISO-certified facility." },
              { step: "04", title: "Installation", description: "Professional installation by our trained team with minimal disruption." },
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pb-8 lg:pb-0"
              >
                <div className="bg-gradient-to-br from-[#E9FDBF] to-white dark:from-[#030213] dark:to-[#0a0a1a] rounded-2xl p-6 sm:p-8 border border-[#7FB706]/20 dark:border-white/10 h-full">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#7FB706]/20 mb-3 sm:mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#030213] dark:text-white mb-2 sm:mb-3">
                    {process.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{process.description}</p>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#7FB706] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#7FB706]/30 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Services */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-transparent dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-3 sm:mb-4">
              Our Core Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              Comprehensive interior contracting solutions engineered for excellence
            </p>
          </motion.div>

          {loadingCoreServices ? (
            <div className="text-center text-gray-500 py-10">Loading core services...</div>
          ) : coreServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {coreServices.map((service, index) => (
                <CoreServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No core services yet. Add some from the Admin Dashboard!
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-transparent dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-4 sm:mb-6">
                Why Choose Pacific Products?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                With over 12 years of experience, we deliver unmatched quality and
                innovation in every project we undertake.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "ISO certified manufacturing processes",
                  "Custom design and engineering capabilities",
                  "Pan-India installation network",
                  "5-year product warranty",
                  "Dedicated after-sales support",
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#7FB706] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8">
                <Button size="lg" onClick={() => navigate("/about")}>
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative mt-6 lg:mt-0"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Modern office interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7FB706]/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#7FB706] text-white rounded-2xl p-4 sm:p-6 shadow-xl">
                <div className="text-2xl sm:text-3xl font-bold">12+</div>
                <div className="text-xs sm:text-sm opacity-90">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#7FB706] to-[#6fa005] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-[#B5F823] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-2">
              Get in touch with our team for a free consultation and detailed quote for your project
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => navigate("/contact")}
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button
                onClick={() => window.open("https://wa.me/919818592113", "_blank")}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white text-[#7FB706] rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 font-medium"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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