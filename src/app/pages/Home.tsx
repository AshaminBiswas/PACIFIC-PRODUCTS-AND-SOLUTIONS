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
import { Button } from "../components/Button";
import { ServiceCard } from "../components/ServiceCard";
import { ProductCard } from "../components/ProductCard";
import { TestimonialCarousel } from "../components/TestimonialCarousel";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useRef, useState } from "react";
import background from "../../image/hero-background.png"
import background1 from "../../image/second_slider.jpg"
// ─────────────────────────────────────────────────────────────
// BACKGROUND IMAGE SLOT
// When you're ready to add a background image, uncomment the
// <BackgroundImage /> block inside HeroSection below and
// replace the src with your actual image path or URL.
//
function BackgroundImage() {
  return (
    <div className="absolute inset-0 z-0">
      <ImageWithFallback
        src={background1}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover object-center"
      />
      {/* Overlay — adjust opacity to control image visibility */}
     <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────

const stats = [
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 250, suffix: "+", label: "Happy Clients" },
  { value: 15,  suffix: "+", label: "Years Experience" },
  { value: 5,   suffix: "",  label: "Countries Served" },
];

// ── Hero Section (extracted as its own component) ─────────────

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [quoteHovered, setQuoteHovered] = useState(false);
  const [productHovered, setProductHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "var(--navbar-height, 64px)" }}
    >
      {/* Animated blur background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0ffc8]/80 via-white/60 to-[#e6fdb0]/80" />
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

      {/* BACKGROUND IMAGE SLOT (uncomment when ready)
      
      */}

      {/* <BackgroundImage /> */}

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 text-center py-16 sm:py-20 lg:py-0 lg:min-h-[calc(100vh-64px)] lg:flex lg:flex-col lg:items-center lg:justify-center"
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

        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-bold text-[#030213] mb-5 sm:mb-6 leading-[1.08] tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Engineering Excellence in
          <br />
          <motion.span
            className="text-[#7FB706] inline-block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Interior Solutions
          </motion.span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 mb-8 sm:mb-10 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          Premium restroom cubicles, cladding, and paneling solutions for
          architects, builders, and corporate clients worldwide
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-14 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.div
            onHoverStart={() => setQuoteHovered(true)}
            onHoverEnd={() => setQuoteHovered(false)}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto relative overflow-hidden px-8 py-4 text-base font-semibold shadow-lg shadow-[#7FB706]/25 transition-shadow hover:shadow-xl hover:shadow-[#7FB706]/35"
              onClick={() => (window.location.href = "/contact")}
            >
              <span className="relative z-10 flex items-center gap-2">
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
            onHoverStart={() => setProductHovered(true)}
            onHoverEnd={() => setProductHovered(false)}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold backdrop-blur-sm border-[#7FB706]/40 hover:bg-[#7FB706]/5 hover:border-[#7FB706]/30 hover:text-gray-900 transition-all"
              onClick={() => (window.location.href = "/products")}
            >
              <span className="flex items-center gap-2">
                View Products
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

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full max-w-3xl lg:max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group relative"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-white/10 border border-[#7FB706]/12 " />
              <div className="relative py-4 px-3">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7FB706] mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs sm:text-sm text-black font-medium tracking-wide">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 z-10"
      >
       
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-[#7FB706]/40 rounded-full flex justify-center pt-1.5"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-[#7FB706] rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <HeroSection />

      {/* Featured Products */}

      
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] mb-3 sm:mb-4">
              Featured Products
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Explore our range of premium interior solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { title: "Compact Laminate Cubicles",    category: "Restroom Cubicles",  image: "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800", path: "/products/restroom-cubicles" },
              { title: "Aluminum Composite Cladding",  category: "Exterior Cladding",  image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800", path: "/products/exterior-cladding" },
              { title: "Decorative Wall Panels",        category: "Interior Paneling",  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800", path: "/products/interior-paneling" },
            ].map((product, index) => (
              <ProductCard key={index} {...product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button size="lg" variant="outline" onClick={() => (window.location.href = "/products")}>
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] mb-3 sm:mb-4">
              Our Core Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Comprehensive interior contracting solutions engineered for excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Factory,   title: "Restroom Cubicles",  description: "Premium quality toilet cubicles and partitions designed for durability and aesthetic appeal in commercial spaces." },
              { icon: Shield,    title: "Exterior Cladding",  description: "Weather-resistant cladding solutions that protect and enhance building facades with modern architectural finishes." },
              { icon: Lightbulb, title: "Interior Paneling",  description: "Sophisticated interior wall paneling systems that transform spaces with style, functionality, and acoustic benefits." },
              { icon: Target,    title: "Custom Hardware",    description: "High-quality cubicle hardware and fittings engineered for smooth operation and long-lasting performance." },
              { icon: Award,     title: "Quality Assurance",  description: "Rigorous quality control processes ensuring every installation meets international standards and specifications." },
              { icon: Users,     title: "Project Consulting", description: "Expert consultation services to help plan and execute complex interior projects from concept to completion." },
            ].map((service, index) => (
              <ServiceCard key={index} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#030213] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Industries We Serve
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-2">
              Trusted by leading organizations across multiple sectors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Plane,       title: "Airports",    description: "High-traffic washroom solutions for international airports",  image: "https://images.unsplash.com/photo-1759497904878-82c9bb21b2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", path: "/solutions/airports" },
              { icon: ShoppingBag, title: "Malls",       description: "Stylish and durable installations for retail spaces",         image: "https://images.unsplash.com/photo-1542883339-f2680a3e3996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", path: "/solutions/malls" },
              { icon: Building2,   title: "Offices",     description: "Professional solutions for corporate environments",           image: "https://images.unsplash.com/photo-1686100510109-d520e59bf0ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", path: "/solutions/offices" },
              { icon: Home,        title: "Residential", description: "Premium bathroom solutions for luxury homes",                 image: "https://images.unsplash.com/photo-1774578342098-66adff9c1fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", path: "/solutions/residential" },
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
                onClick={() => (window.location.href = industry.path)}
              >
                <div className="relative h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden mb-3 sm:mb-4">
                  <ImageWithFallback
                    src={industry.image}
                    alt={industry.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                    <industry.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#B5F823] mb-1 sm:mb-2" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-1 sm:mb-2">
                  {industry.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#E9FDBF]/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] mb-3 sm:mb-4">
              Our Process
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              A streamlined approach from consultation to installation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Consultation",   description: "We discuss your requirements, space constraints, and design preferences." },
              { step: "02", title: "Design & Quote", description: "Our team creates custom designs and provides a detailed, transparent quote." },
              { step: "03", title: "Manufacturing",  description: "Products are precision-manufactured in our ISO-certified facility." },
              { step: "04", title: "Installation",   description: "Professional installation by our trained team with minimal disruption." },
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pb-8 lg:pb-0"
              >
                <div className="bg-gradient-to-br from-[#E9FDBF] to-white rounded-2xl p-6 sm:p-8 border border-[#7FB706]/20 h-full">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#7FB706]/20 mb-3 sm:mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#030213] mb-2 sm:mb-3">
                    {process.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">{process.description}</p>
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

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] mb-4 sm:mb-6">
                Why Choose Pacific Products?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                With over 15 years of experience, we deliver unmatched quality and
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
                    <span className="text-sm sm:text-base text-gray-700">{point}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8">
                <Button size="lg" onClick={() => (window.location.href = "/about")}>
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
                <div className="text-2xl sm:text-3xl font-bold">15+</div>
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
                onClick={() => (window.location.href = "/contact")}
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button
                onClick={() => window.open("https://wa.me/919876543210", "_blank")}
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