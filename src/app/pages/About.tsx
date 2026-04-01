import { motion } from "motion/react";
import { Target, Award, Users, TrendingUp, Factory, Globe } from "lucide-react";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function AboutPage() {
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
              About <span className="text-[#7FB706]">Pacific Products</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Leading the interior contracting industry with engineering precision, premium quality, and unmatched reliability for over 15 years
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: "+", label: "Projects Delivered" },
              { value: 250, suffix: "+", label: "Happy Clients" },
              { value: 15, suffix: "+", label: "Years Experience" },
              { value: 5, suffix: "", label: "Countries" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-[#7FB706] mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-[#030213] mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2011, Pacific Products & Solutions emerged from a vision to revolutionize the interior contracting industry in India. What started as a small workshop has grown into a leading manufacturer and supplier of premium restroom cubicles, cladding, and paneling solutions.
                </p>
                <p>
                  Our journey has been marked by continuous innovation, unwavering commitment to quality, and a deep understanding of our clients' needs. We've had the privilege of working with some of the most prestigious projects across airports, malls, corporate offices, and government institutions.
                </p>
                <p>
                  Today, we stand as a trusted partner for architects, builders, and contractors who demand nothing but the best. Our state-of-the-art manufacturing facility, skilled workforce, and dedication to excellence ensure that every project we undertake becomes a benchmark of quality.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761819951977-022b27502018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtYW51ZmFjdHVyaW5nJTIwZmFjdG9yeSUyMGludGVyaW9yfGVufDF8fHx8MTc3NDc3Mjg3MHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Manufacturing Facility"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#030213] mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Quality Excellence",
                description: "We never compromise on quality. Every product undergoes rigorous testing to meet international standards.",
              },
              {
                icon: Target,
                title: "Customer Focus",
                description: "Our clients' satisfaction drives our innovation. We listen, understand, and deliver beyond expectations.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Our skilled team works in perfect harmony to deliver projects on time and within budget.",
              },
              {
                icon: TrendingUp,
                title: "Continuous Innovation",
                description: "We invest in research and technology to stay ahead of industry trends and deliver cutting-edge solutions.",
              },
              {
                icon: Factory,
                title: "Engineering Precision",
                description: "Our manufacturing processes combine traditional craftsmanship with modern engineering precision.",
              },
              {
                icon: Globe,
                title: "Sustainability",
                description: "We're committed to eco-friendly practices and sustainable materials for a better tomorrow.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#E9FDBF]/30 to-white rounded-2xl p-8 border border-[#7FB706]/20"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#7FB706] to-[#B5F823] rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#030213] mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#030213] mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the professionals who make it all possible
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29ycG9yYXRlJTIwb2ZmaWNlfGVufDF8fHx8MTc3NDc3Mjg3MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Our Team"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="mt-8 text-center">
              <p className="text-gray-700 text-lg max-w-3xl mx-auto">
                Our team comprises experienced engineers, skilled craftsmen, project managers, and design consultants who bring decades of combined expertise to every project. Together, we're committed to delivering excellence.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
