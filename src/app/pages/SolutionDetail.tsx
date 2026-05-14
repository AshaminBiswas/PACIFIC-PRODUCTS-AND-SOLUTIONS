import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Users, Building2, Globe, TrendingUp } from "lucide-react";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSolution } from "../../lib/hooks";
import { DynamicIcon } from "../components/DynamicIcon";

export default function SolutionDetailPage() {
  const { industry } = useParams<{ industry: string }>();
  const navigate = useNavigate();
  const { data: solution, loading } = useSolution(industry);
  const [currentMain, setCurrentMain] = useState<string | null>(null);
  const [currentThumbs, setCurrentThumbs] = useState<string[] | null>(null);

  const mainImage = currentMain || solution?.image_url || "";
  const thumbnailImages = currentThumbs || solution?.additional_images?.filter(Boolean).slice(0, 4) || [];

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
        <div className="text-center text-gray-500 dark:text-gray-400">Loading solution...</div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-[#030213]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Solution Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Building2, value: "250+", label: "Projects Delivered" },
    { icon: Users, value: "100+", label: "Happy Clients" },
    { icon: Globe, value: "15+", label: "Cities Covered" },
    { icon: TrendingUp, value: "98%", label: "Client Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] transition-colors">

      {/* ═══════════════════ CINEMATIC HERO BANNER ═══════════════════ */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <ImageWithFallback src={mainImage} alt={solution.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 w-full pb-12 sm:pb-16 lg:pb-20 pt-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-sm text-white/60 mb-6"
            >
              <button onClick={() => navigate("/")} className="hover:text-white transition-colors">Home</button>
              <span>/</span>
              <button onClick={() => navigate("/solutions")} className="hover:text-white transition-colors">Solutions</button>
              <span>/</span>
              <span className="text-white font-medium">{solution.title}</span>
            </motion.div>

            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-5"
              >
                <div className="w-14 h-14 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center">
                  <DynamicIcon name={solution.icon_name} className="w-7 h-7 text-[#B5F823]" />
                </div>
                <span className="text-sm font-bold tracking-widest text-[#B5F823] uppercase">Industry Solution</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 leading-[1.1]"
              >
                {solution.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl"
              >
                {solution.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Get a Free Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <button
                  onClick={() => window.open("https://wa.me/919818592113", "_blank")}
                  className="px-6 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium text-base"
                >
                  WhatsApp Us
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ THUMBNAIL GALLERY ═══════════════════ */}
      {thumbnailImages.length > 0 && (
        <section className="py-8 bg-gray-50 dark:bg-[#0a0a1a] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              {thumbnailImages.map((img, idx) => {
                const isActive = img === mainImage;
                return (
                  <button
                    key={img + idx}
                    onClick={() => handleSwap(idx)}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 ${
                      isActive
                        ? "ring-2 ring-[#7FB706] ring-offset-2 ring-offset-gray-50 dark:ring-offset-[#0a0a1a] shadow-lg scale-[1.02]"
                        : "opacity-50 hover:opacity-90 border border-gray-200 dark:border-white/10 hover:scale-[1.02]"
                    }`}
                  >
                    <ImageWithFallback src={img} alt={`${solution.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ ABOUT THIS SOLUTION ═══════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Left: Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">Overview</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About This Solution
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                  {solution.description}
                </p>
              </div>
            </motion.div>

            {/* Right: Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-[#030213] to-[#1a1a2e] dark:from-white/5 dark:to-white/[0.02] rounded-2xl p-6 sm:p-8 border border-transparent dark:border-white/10">
                <h3 className="text-lg font-bold text-white dark:text-white mb-6">Our Track Record</h3>
                <div className="grid grid-cols-2 gap-5">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="text-center"
                    >
                      <stat.icon className="w-6 h-6 text-[#B5F823] mx-auto mb-2" />
                      <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES — NUMBERED LIST ═══════════════════ */}
      {solution.features && solution.features.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-[#0a0a1a] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
              <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">Capabilities</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                What We Deliver
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Tailored capabilities for the {solution.title.toLowerCase()} sector
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
              {solution.features.map((feature: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className="group flex items-start gap-4 bg-white dark:bg-white/5 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-white/5 hover:border-[#7FB706]/30 dark:hover:border-[#7FB706]/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#7FB706] flex items-center justify-center shrink-0 shadow-md shadow-[#7FB706]/20">
                    <span className="text-sm font-black text-white">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed pt-1.5">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CLIENTS — PILL CLOUD ═══════════════════ */}
      {solution.clients && solution.clients.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030213] transition-colors overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
              <span className="inline-block text-xs font-bold tracking-widest text-[#7FB706] uppercase mb-3">Our Clients</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">Trusted By Industry Leaders</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Partnering with leading organizations across the {solution.title.toLowerCase()} sector
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
              {solution.clients.map((client: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group relative bg-gray-50 dark:bg-white/5 rounded-xl px-5 sm:px-7 py-3.5 sm:py-4 border border-gray-100 dark:border-white/10 hover:border-[#7FB706]/40 dark:hover:border-[#7FB706]/40 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="absolute inset-0 rounded-xl bg-[#7FB706]/0 group-hover:bg-[#7FB706]/5 transition-colors duration-300" />
                  <p className="relative text-sm sm:text-base font-bold text-gray-800 dark:text-white tracking-wide">{client}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA — DARK SPLIT ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Left: Dark content */}
          <div className="bg-[#030213] py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-16 flex items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-lg">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to elevate your <span className="text-[#B5F823]">{solution.title.toLowerCase()}</span> spaces?
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Get in touch with our specialized team for a free consultation and tailored proposal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <button
                  onClick={() => navigate("/solutions")}
                  className="px-6 py-3.5 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  ← View All Solutions
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right: Image */}
          <div className="relative h-64 lg:h-auto min-h-[300px]">
            <ImageWithFallback
              src={mainImage}
              alt={`${solution.title} CTA`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#7FB706]/20 mix-blend-multiply" />
          </div>
        </div>
      </section>
    </div>
  );
}
