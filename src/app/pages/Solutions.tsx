import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router";
import { DynamicIcon } from "../components/DynamicIcon";
import { useSolutions, usePageBanner } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SEO } from "../components/SEO";
import { DEFAULT_KEYWORDS } from "../../lib/seo-data";

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
      <SEO
        title="Industry Solutions"
        description="Tailored interior solutions for corporates, malls, airports, metro stations, hospitals, schools, and commercial infrastructure projects."
        keywords={`${DEFAULT_KEYWORDS}, corporate office interiors, hospital washroom cubicles, airport restroom partitions, mall cladding solutions, commercial interior contractors`}
        canonical="/solutions"
      />
      {/* Hero Banner */}
      {banner?.image_url && (
        <section className="relative w-full aspect-[16/5] min-h-[260px] max-h-[600px] overflow-hidden">
          <ImageWithFallback
            src={banner.image_url}
            alt="Solutions banner"
            className="absolute inset-0 w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </section>
      )}

      {/* Solutions Grid */}
      <section className="py-16 sm:py-24 bg-[#030213] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-400">Loading solutions...</div>
          ) : filteredSolutions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSolutions.map((solution, index) => {

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
                            <DynamicIcon name={solution.icon_name} className="w-6 h-6 text-[#B5F823]" />
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
