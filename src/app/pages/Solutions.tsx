import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router";
import * as Icons from "lucide-react";
import { useSolutions, usePageBanner } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

export default function SolutionsPage() {
  const { data: solutions, loading } = useSolutions();
  const { data: banner } = usePageBanner("solutions");
  const [searchParams] = useSearchParams();
  const industryFilter = searchParams.get("industry");

  const filteredSolutions = industryFilter
    ? solutions.filter(s => s.title === industryFilter)
    : solutions;

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">
      {/* Hero Banner */}
      <section className="relative w-full h-[38vh] min-h-[260px] overflow-hidden">
        <ImageWithFallback
          src={banner?.image_url || DEFAULT_BG}
          alt="Solutions banner"
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
            {industryFilter ? (
              <><span className="text-[#B5F823]">{industryFilter}</span> Solutions</>
            ) : banner?.title ? (
              banner.title
            ) : (
              <>Our <span className="text-[#B5F823]">Solutions</span></>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-gray-200 max-w-2xl"
          >
            {banner?.subtitle || "Discover industry-specific applications of our premium interior products, tailored to meet your unique requirements"}
          </motion.p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 sm:py-24 bg-[#030213] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-400">Loading solutions...</div>
          ) : filteredSolutions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSolutions.map((solution, index) => {
                const Icon = (Icons as any)[solution.icon_name || "Building2"] || Icons.Building2;
                return (
                  <motion.div
                    key={solution.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/solutions/${solution.slug}`}
                      className="group block"
                    >
                      <div className="relative h-64 rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-lg group-hover:border-[#7FB706]/30 transition-colors">
                        <ImageWithFallback
                          src={solution.image_url}
                          alt={solution.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 group-hover:bg-[#7FB706]/20 group-hover:border-[#7FB706]/50 transition-colors">
                            <Icon className="w-6 h-6 text-[#B5F823]" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 group-hover:text-[#B5F823] transition-colors">
                        {solution.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-2">
                        {solution.description || solution.subtitle}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400">No solutions available yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
