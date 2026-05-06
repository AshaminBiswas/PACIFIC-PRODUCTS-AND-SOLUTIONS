import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import {
  Target, Award, Users, TrendingUp, Factory, Globe,
  Shield, Droplets, Flame, CheckCircle2, ArrowRight,
  Sparkles, Zap, Eye, Wrench, DoorOpen, ShowerHead,
  Lock, Cog, Layers, Rocket
} from "lucide-react";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SectorsGrid } from "../components/AboutSectors";
import { usePageBanner } from "../../lib/hooks";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

/* ── Floating particles for hero ── */
function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#B5F823]/40"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

/* ── Stat card with hover tilt ── */
function StatCard({ value, suffix, label, icon: Icon, index }: {
  value: number; suffix: string; label: string; icon: any; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, rotateZ: 1 }}
      className="relative group"
    >
      <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-white/10 text-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#7FB706]/10 to-[#B5F823]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative z-10">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex items-center justify-center shadow-lg shadow-[#7FB706]/20 group-hover:shadow-[#7FB706]/40 transition-shadow">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-4xl font-bold text-[#7FB706] mb-1">
            <AnimatedCounter end={value} suffix={suffix} />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Value card with animated icon ── */
function ValueCard({ icon: Icon, title, desc, index }: {
  icon: any; title: string; desc: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-gray-200/50 dark:border-white/10 overflow-hidden"
    >
      <motion.div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7FB706] to-[#B5F823] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex items-center justify-center mb-5 shadow-lg shadow-[#7FB706]/20"
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>
      <h3 className="text-lg font-bold text-[#030213] dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ── Material feature pill ── */
function MaterialPill({ icon: Icon, label, index }: { icon: any; label: string; index: number; }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.08, y: -2 }}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm"
    >
      <Icon className="w-5 h-5 text-[#7FB706] flex-shrink-0" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </motion.div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */

export default function AboutPage() {
  const navigate = useNavigate();
  const { data: banner } = usePageBanner("about");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const stats = [
    { value: 500, suffix: "+", label: "Projects Delivered", icon: CheckCircle2 },
    { value: 250, suffix: "+", label: "Happy Clients", icon: Users },
    { value: 15, suffix: "+", label: "Years Experience", icon: Award },
    { value: 5, suffix: "", label: "Countries", icon: Globe },
  ];

  const values = [
    { icon: Award, title: "Quality Excellence", desc: "Every product undergoes rigorous testing to meet international standards — no compromises." },
    { icon: Target, title: "Customer Focus", desc: "We listen, understand, and deliver beyond expectations. Your satisfaction drives our innovation." },
    { icon: Users, title: "Team Collaboration", desc: "Our skilled team works in perfect harmony to deliver projects on time and within budget." },
    { icon: TrendingUp, title: "Continuous Innovation", desc: "We invest in R&D and technology to stay ahead of industry trends." },
    { icon: Factory, title: "Engineering Precision", desc: "Traditional craftsmanship meets modern engineering precision in our manufacturing." },
    { icon: Globe, title: "Sustainability", desc: "Committed to eco-friendly practices and sustainable materials for a better tomorrow." },
  ];

  const materialFeatures = [
    { icon: Droplets, label: "Water Resistant" },
    { icon: Flame, label: "Fire Retardant" },
    { icon: Shield, label: "Corrosion Proof" },
    { icon: Zap, label: "Scratch Resistant" },
    { icon: Eye, label: "Premium Aesthetics" },
    { icon: Wrench, label: "Low Maintenance" },
  ];

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative w-full h-[50vh] min-h-[340px] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <ImageWithFallback
            src={banner?.image_url || DEFAULT_BG}
            alt="About banner"
            className="absolute inset-0 w-full h-full object-cover scale-105"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <HeroParticles />
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Since 2011 — Engineering Excellence
          </motion.div> */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl"
          >
            {banner?.title || (<>Building Modern Infrastructure<br />Solutions for <span className="text-[#B5F823]">High-Performance Spaces</span></>)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-gray-200 max-w-2xl"
          >
            {banner?.subtitle || "Premium architectural & infrastructure solutions for modern commercial, institutional, and public environments"}
          </motion.p>
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-16 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => <StatCard key={i} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ INTRO / WHO WE ARE ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3"
              >
                Who We Are
              </motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-6">
                Your Trusted Partner in <span className="text-[#7FB706]">Infrastructure Solutions</span>
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                <p>At Pacific Products & Solutions, we specialize in delivering premium architectural and infrastructure solutions designed for modern commercial, institutional, and public environments. With years of industry expertise, we have established ourselves as a trusted partner for businesses seeking durable, hygienic, aesthetically refined, and performance-driven systems.</p>
                <p>From restroom cubicles and shower cubicles to exterior cladding, locker solutions, custom hardware, and interior architectural systems, we provide end-to-end solutions tailored to the evolving needs of contemporary infrastructure projects.</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Get in Touch <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1761819951977-022b27502018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtYW51ZmFjdHVyaW5nJTIwZmFjdG9yeSUyMGludGVyaW9yfGVufDF8fHx8MTc3NDc3Mjg3MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Manufacturing Facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -bottom-5 -left-5 bg-[#7FB706] text-white rounded-2xl p-5 shadow-xl shadow-[#7FB706]/30"
              >
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ APPROACH ═══ */}
      <section className="py-20 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our Approach</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Engineering Meets Design</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Our approach combines engineering precision, modern design aesthetics, high-quality materials, and professional execution to create spaces that are functional, durable, and visually impactful. Every project is planned with attention to detail, ensuring long-term performance, safety, hygiene, and low maintenance.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materialFeatures.map((f, i) => <MaterialPill key={f.label} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ SECTORS ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">B2B Sectors</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Industries We Proudly Serve</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Trusted by leading organizations across 14+ sectors worldwide</p>
          </motion.div>
          <SectorsGrid />
        </div>
      </section>

      {/* ═══ PRODUCT DURABILITY ═══ */}
      <section className="py-20 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Premium interior solutions"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Built to Last</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-6">Engineered for High-Traffic Environments</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Our products are engineered to withstand high-traffic environments while maintaining premium aesthetics and operational reliability. We use advanced materials and modern manufacturing standards to ensure our systems are resistant to water, fire, corrosion, scratches, and everyday wear — making them ideal for demanding commercial applications.
              </p>
              <div className="space-y-3">
                {["Water, fire & corrosion resistant materials", "Premium aesthetics that endure", "Low-maintenance & operationally reliable", "ISO certified manufacturing processes", "5-year comprehensive product warranty"].map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#7FB706] flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CORE VALUES ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">The Principles That Guide Us</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Every decision, every product, every project is driven by these core values</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => <ValueCard key={v.title} {...v} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="py-20 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our People</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The professionals who make it all possible</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29ycG9yYXRlJTIwb2ZmaWNlfGVufDF8fHx8MTc3NDc3Mjg3MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Our Team"
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-lg max-w-3xl leading-relaxed">
                Our team comprises experienced engineers, skilled craftsmen, project managers, and design consultants who bring decades of combined expertise to every project.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUSTED CLIENTS ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our Clients</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Trusted by Leading Organizations Across India</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Over the years, Pacific Products & Solutions has successfully completed projects for some of the most respected organizations, institutions, and commercial brands across India. Our commitment to quality, professionalism, timely delivery, and customer satisfaction has helped us build long-term relationships with architects, contractors, developers, and corporate clients.
            </p>
          </motion.div>

          {/* Animated Marquee of client logos/names */}
          <div className="relative mt-10">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-gray-50 dark:from-[#0a0a1a] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-gray-50 dark:from-[#0a0a1a] to-transparent pointer-events-none" />
            <motion.div
              className="flex gap-4"
              animate={{ x: ["-0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex gap-4 shrink-0">
                  {[
                    "ATS Bouquet", "VIBGYOR Group of Schools", "Rajasthan Patrika",
                    "Capital Radio Multiplatforma", "PDM University", "MVN University",
                    "INOX", "Indian Oil", "Delhi Metro", "OMAXE", "Cult.Fit", "Eden Gardens Stadium",
                  ].map((name, i) => (
                    <motion.div
                      key={`${setIdx}-${i}`}
                      whileHover={{ scale: 1.08, y: -4 }}
                      className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 backdrop-blur-sm shrink-0 cursor-default group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7FB706]/20 to-[#B5F823]/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#7FB706]">{name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap group-hover:text-[#7FB706] transition-colors">{name}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8 max-w-2xl mx-auto"
          >
            These successful collaborations reflect our capability to execute projects of varying scales across educational institutions, transportation infrastructure, corporate environments, entertainment venues, fitness centers, and large public spaces.
          </motion.p>
        </div>
      </section>

      {/* ═══ CORE SERVICE PORTFOLIO ═══ */}
      <section className="py-20 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Our Core Service Portfolio</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: "Exterior Cladding Solutions", desc: "Modern exterior cladding systems designed to enhance architectural appearance, weather resistance, durability, and structural protection for commercial and institutional buildings." },
              { icon: DoorOpen, title: "Restroom Cubicles & Toilet Partitions", desc: "Premium restroom cubicle systems engineered for hygiene, privacy, durability, and low maintenance in high-traffic public and commercial environments." },
              { icon: ShowerHead, title: "Shower Cubicles", desc: "Modern shower partition systems designed for gyms, sports facilities, wellness centers, hostels, and institutional projects with superior moisture resistance and durability." },
              { icon: Lock, title: "Locker Solutions", desc: "Custom locker systems for schools, offices, gyms, hospitals, and commercial facilities, offering secure storage with modern aesthetics and optimized space utilization." },
              { icon: Cog, title: "Custom Hardware & Accessories", desc: "Precision-engineered hardware solutions designed to complement modern interiors and architectural infrastructure with durability and functionality." },
            ].map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-gray-200/50 dark:border-white/10 overflow-hidden"
              >
                <motion.div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#7FB706] to-[#B5F823] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex items-center justify-center mb-5 shadow-lg shadow-[#7FB706]/20 group-hover:shadow-[#7FB706]/40 transition-shadow"
                >
                  <svc.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-[#030213] dark:text-white mb-2 group-hover:text-[#7FB706] transition-colors">{svc.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 opacity-10"
            >
              <Rocket className="w-16 h-16 text-[#7FB706]" />
            </motion.div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-6">Building Smarter Spaces for the Future</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              At Pacific Products & Solutions, our mission is to continuously innovate and deliver high-quality architectural systems that combine performance, sustainability, and design excellence. We remain committed to helping businesses and institutions create <span className="text-[#7FB706] font-semibold">cleaner, smarter, safer, and more efficient spaces</span> for the future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 bg-gradient-to-br from-[#7FB706] to-[#5a8204] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B5F823] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">We Don't Just Supply Products</h2>
            <p className="text-lg mb-8 opacity-90">
              We deliver complete infrastructure solutions that enhance user experience, improve operational efficiency, and elevate the architectural identity of a space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate("/contact")}>
                Start Your Project <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#7FB706]" onClick={() => navigate("/products")}>
                Explore Solutions
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
