import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router";
import * as Icons from "lucide-react";
import { useSolutions } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function SolutionsPage() {
  const { data: solutions, loading } = useSolutions();
  const [searchParams] = useSearchParams();
  const industryFilter = searchParams.get("industry");

  const filteredSolutions = industryFilter
    ? solutions.filter(s => s.title === industryFilter)
    : solutions;

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
              {industryFilter ? (
                <>
                  <span className="text-[#7FB706]">{industryFilter}</span> Solutions
                </>
              ) : (
                <>
                  Our <span className="text-[#7FB706]">Solutions</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Discover industry-specific applications of our premium interior products, tailored to meet your unique requirements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-[#030213] text-white">
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
                      <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                        <ImageWithFallback
                          src={solution.image_url}
                          alt={solution.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                          <Icon className="w-10 h-10 text-[#B5F823] mb-2" />
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
