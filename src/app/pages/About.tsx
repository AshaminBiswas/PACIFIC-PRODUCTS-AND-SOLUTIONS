import { motion } from "motion/react";
import { Target, Award, Users, TrendingUp, Factory, Globe } from "lucide-react";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageBanner } from "../../lib/hooks";

// Default fallback banner background
const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

export default function AboutPage() {
  const { data: banner } = usePageBanner("about");

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-[#030213] transition-colors">
      {/* Hero Banner */}
      <section className="relative w-full h-[38vh] min-h-[260px] overflow-hidden">
        <ImageWithFallback
          src={banner?.image_url || DEFAULT_BG}
          alt="About banner"
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            {banner?.title ? (
              banner.title
            ) : (
              <>About <span className="text-[#B5F823]">Pacific Products</span></>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-gray-200 max-w-2xl"
          >
            {banner?.subtitle || "Leading the interior contracting industry with engineering precision, premium quality, and unmatched reliability for over 15 years"}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-[#030213] transition-colors">
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
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-gray-50 dark:bg-[#0a0a1a] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-bold text-[#030213] dark:text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>Founded in 2011, Pacific Products & Solutions emerged from a vision to revolutionize the interior contracting industry in India. What started as a small workshop has grown into a leading manufacturer and supplier of premium restroom cubicles, cladding, and paneling solutions.</p>
                <p>Our journey has been marked by continuous innovation, unwavering commitment to quality, and a deep understanding of our clients' needs. We've had the privilege of working with some of the most prestigious projects across airports, malls, corporate offices, and government institutions.</p>
                <p>Today, we stand as a trusted partner for architects, builders, and contractors who demand nothing but the best. Our state-of-the-art manufacturing facility, skilled workforce, and dedication to excellence ensure that every project we undertake becomes a benchmark of quality.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
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
      <section className="py-24 bg-white dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#030213] dark:text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Award,      title: "Quality Excellence",     description: "We never compromise on quality. Every product undergoes rigorous testing to meet international standards." },
              { icon: Target,     title: "Customer Focus",          description: "Our clients' satisfaction drives our innovation. We listen, understand, and deliver beyond expectations." },
              { icon: Users,      title: "Team Collaboration",      description: "Our skilled team works in perfect harmony to deliver projects on time and within budget." },
              { icon: TrendingUp, title: "Continuous Innovation",   description: "We invest in research and technology to stay ahead of industry trends and deliver cutting-edge solutions." },
              { icon: Factory,    title: "Engineering Precision",   description: "Our manufacturing processes combine traditional craftsmanship with modern engineering precision." },
              { icon: Globe,      title: "Sustainability",          description: "We're committed to eco-friendly practices and sustainable materials for a better tomorrow." },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#E9FDBF]/30 to-white dark:from-[#030213] dark:to-[#0a0a1a] rounded-2xl p-8 border border-[#7FB706]/20 dark:border-white/10"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#7FB706] to-[#B5F823] rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#030213] dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-[#0a0a1a] dark:to-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#030213] dark:text-white mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Meet the professionals who make it all possible</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29ycG9yYXRlJTIwb2ZmaWNlfGVufDF8fHx8MTc3NDc3Mjg3MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Our Team"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="mt-8 text-center">
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                Our team comprises experienced engineers, skilled craftsmen, project managers, and design consultants who bring decades of combined expertise to every project. Together, we're committed to delivering excellence.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
