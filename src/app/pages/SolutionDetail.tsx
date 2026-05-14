import { motion } from "motion/react";
import { useParams } from "react-router";
import { useState } from "react";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { useSolution } from "../../lib/hooks";
import { DynamicIcon } from "../components/DynamicIcon";

export default function SolutionDetailPage() {
  const { industry } = useParams<{ industry: string }>();
  const { data: solution, loading } = useSolution(industry);
  const [currentMain, setCurrentMain] = useState<string | null>(null);
  const [currentThumbs, setCurrentThumbs] = useState<string[] | null>(null);

  // Initialize from solution data
  const mainImage = currentMain || solution?.image_url || "";
  const thumbnailImages = currentThumbs || solution?.additional_images?.filter(Boolean).slice(0, 4) || [];

  const handleSwap = (idx: number) => {
    const clickedImg = thumbnailImages[idx];
    if (clickedImg === mainImage) return; // already showing
    const newThumbs = [...thumbnailImages];
    newThumbs[idx] = mainImage; // put current main into the thumbnail slot
    setCurrentMain(clickedImg);
    setCurrentThumbs(newThumbs);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-transparent dark:bg-[#030213]">
        <div className="text-center text-gray-500 dark:text-gray-400">Loading solution...</div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-transparent dark:bg-[#030213]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Solution Not Found</h1>
          <Button onClick={() => (window.location.href = "/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">
      {/* Hero */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#E9FDBF]/60 to-white dark:from-[#0a0a1a] dark:to-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7FB706] to-[#B5F823] rounded-xl flex items-center justify-center shadow-lg shadow-[#7FB706]/20">
                  <DynamicIcon name={solution.icon_name} className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                  {solution.title}
                </h1>
              </div>
              <p className="text-xl sm:text-2xl text-[#7FB706] mb-6 font-medium">{solution.subtitle}</p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                {solution.description}
              </p>
              <Button size="lg" onClick={() => (window.location.href = "/contact")}>
                Request Consultation
              </Button>
            </motion.div>

            {/* Main Image + Thumbnail Gallery */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              {/* Main large image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] mb-4 bg-gray-100 dark:bg-gray-800">
                <ImageWithFallback
                  src={mainImage}
                  alt={solution.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {/* Thumbnail strip — only show the additional images */}
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
                        <ImageWithFallback
                          src={img}
                          alt={`${solution.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-[#7FB706]/10 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      {solution.features && solution.features.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#0a0a1a] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Specialized solutions designed for {solution.title.toLowerCase()}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {solution.features.map((feature: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 hover:bg-[#E9FDBF]/30 dark:hover:bg-[#7FB706]/10 transition-colors border border-transparent dark:border-white/5"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#7FB706] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clients */}
      {solution.clients && solution.clients.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-[#030213] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Trusted By</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                Leading organizations in the industry
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
              {solution.clients.map((client: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-white/5 rounded-xl px-6 sm:px-8 py-4 sm:py-6 shadow-lg dark:shadow-none border border-transparent dark:border-white/10"
                >
                  <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{client}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#7FB706] to-[#6fa005] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Contact our specialized team for a consultation tailored to your {solution.title.toLowerCase()}
            </p>
            <Button size="lg" variant="secondary" onClick={() => (window.location.href = "/contact")}>
              Schedule Consultation
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
