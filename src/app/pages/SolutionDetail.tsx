import { motion } from "motion/react";
import { useParams } from "react-router";
import { Plane, ShoppingBag, Building2, Home } from "lucide-react";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { useSolution } from "../../lib/hooks";
import { DynamicIcon } from "../components/DynamicIcon";

export default function SolutionDetailPage() {
  const { industry } = useParams<{ industry: string }>();
  const { data: solution, loading } = useSolution(industry);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-gray-500">Loading solution...</div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#030213] mb-4">Solution Not Found</h1>
          <Button onClick={() => (window.location.href = "/")}>Back to Home</Button>
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
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7FB706] to-[#B5F823] rounded-xl flex items-center justify-center">
                  <DynamicIcon name={solution.icon_name} className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-[#030213]">{solution.title}</h1>
              </div>
              <p className="text-2xl text-[#7FB706] mb-6">{solution.subtitle}</p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">{solution.description}</p>
              <Button size="lg" onClick={() => (window.location.href = "/contact")}>
                Request Consultation
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              <ImageWithFallback
                src={solution.image_url}
                alt={solution.title}
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Gallery */}
      {solution.additional_images && solution.additional_images.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {solution.additional_images.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${solution.title} gallery ${idx + 1}`}
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
              Specialized solutions designed for {solution.title.toLowerCase()}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solution.features.map((feature: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:bg-[#E9FDBF]/30 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#7FB706] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#030213] mb-4">Trusted By</h2>
            <p className="text-xl text-gray-600">Leading organizations in the industry</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            {solution.clients.map((client: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl px-8 py-6 shadow-lg"
              >
                <p className="text-lg font-semibold text-[#030213]">{client}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#7FB706] to-[#6fa005] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
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
