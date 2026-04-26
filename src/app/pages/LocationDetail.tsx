import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import {
  MapPin, Phone, Mail, ArrowRight, Clock, Building2,
  CheckCircle2, ChevronLeft, ExternalLink,
} from "lucide-react";
import { Button } from "../components/Button";

// ─── Location Data ────────────────────────────────────────────

const locationData: Record<string, {
  city: string;
  region: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  projects: string[];
  mapSrc: string;
  stats: { label: string; value: string }[];
  services: string[];
  hours: string;
}> = {
  delhi: {
    city: "Delhi NCR",
    region: "North India",
    address: "Sector 18, Udyog Vihar, Gurugram - 122015, Haryana, India",
    phone: "+91 11 9876 5432",
    email: "delhi@pacificproducts.com",
    description:
      "Serving the National Capital Region with premium interior contracting solutions for over 10 years. Our Delhi office specializes in large-scale commercial projects, delivering world-class restroom cubicles, cladding, and paneling solutions to India's most prestigious addresses.",
    projects: ["Delhi Metro Stations", "DLF Cyber Hub", "Aerocity Hotels", "Select Citywalk Mall", "Ambience Mall Gurugram", "Worldmark Aerocity"],
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112130.34005085694!2d76.99403816684724!3d28.514782017772656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5fe8e5c64b1e!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    stats: [
      { label: "Projects Completed", value: "120+" },
      { label: "Years in NCR", value: "10+" },
      { label: "Sq. Ft. Installed", value: "2M+" },
      { label: "Corporate Clients", value: "80+" },
    ],
    services: [
      "Commercial Office Fit-outs",
      "Restroom Cubicles & Partitions",
      "High-Pressure Laminate Cladding",
      "Airport & Metro Installations",
      "Retail Interior Solutions",
      "Hospital & Healthcare Spaces",
    ],
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
  },
  mumbai: {
    city: "Mumbai",
    region: "West India · Head Office",
    address: "Plot No. 123, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra",
    phone: "+91 22 1234 5678",
    email: "mumbai@pacificproducts.com",
    description:
      "Our head office and primary manufacturing facility. The Mumbai hub drives all pan-India operations and international exports, backed by an ISO-certified production line.",
    projects: ["Mumbai International Airport", "BKC Corporate Towers", "Phoenix Market City", "Palladium Mall", "NESCO Complex", "Bandra-Kurla Complex"],
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60340.42786064015!2d72.84784987061093!3d19.113093095744804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c84c4ad0a22d%3A0x5c3a0a4c1a7a1b7e!2sAndheri%20East%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    stats: [
      { label: "Projects Completed", value: "300+" },
      { label: "Years Operating", value: "15+" },
      { label: "Sq. Ft. Installed", value: "5M+" },
      { label: "Enterprise Clients", value: "200+" },
    ],
    services: [
      "Manufacturing & R&D",
      "Large-Scale Commercial Projects",
      "Airport Installations",
      "Luxury Retail Fit-outs",
      "Corporate Campuses",
      "Export & International Projects",
    ],
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
  },
  bangalore: {
    city: "Bangalore",
    region: "South India",
    address: "Electronic City Phase 1, Bangalore - 560100, Karnataka, India",
    phone: "+91 80 5555 6666",
    email: "bangalore@pacificproducts.com",
    description:
      "Catering to the tech capital of India, our Bangalore office specialises in corporate office solutions and IT park facilities for the country's most innovative companies.",
    projects: ["Infosys Campus", "Embassy Tech Village", "UB City Mall", "Manyata Tech Park", "RMZ Infinity", "Prestige Tech Park"],
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62208.08538793374!2d77.6062843!3d12.8399746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b13a3a3a3a3%3A0x1a7a7a7a7a7a7a7a!2sElectronic%20City%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    stats: [
      { label: "Projects Completed", value: "150+" },
      { label: "Years in Bangalore", value: "8+" },
      { label: "Sq. Ft. Installed", value: "3M+" },
      { label: "Tech Clients", value: "90+" },
    ],
    services: [
      "IT Park & Tech Campus Fit-outs",
      "Open Office Partitioning",
      "Restroom Cubicles",
      "Cladding & Wall Paneling",
      "Retail & F&B Interiors",
      "Healthcare Facilities",
    ],
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
  },
  ahmedabad: {
    city: "Ahmedabad",
    region: "West India",
    address: "GIDC Industrial Estate, Ahmedabad - 382424, Gujarat, India",
    phone: "+91 79 4444 3333",
    email: "ahmedabad@pacificproducts.com",
    description:
      "Serving Gujarat and surrounding states with high-quality interior solutions for commercial and residential projects. A key gateway for our western India operations.",
    projects: ["Ahmedabad Metro", "Torrent Power Campus", "One Horizon Center", "Vibrant Gujarat Expo", "Adani Corporate Park", "SG Highway Retail"],
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117875.16048395284!2d72.43965!3d23.020918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    stats: [
      { label: "Projects Completed", value: "90+" },
      { label: "Years in Gujarat", value: "6+" },
      { label: "Sq. Ft. Installed", value: "1.5M+" },
      { label: "Local Clients", value: "60+" },
    ],
    services: [
      "Commercial Interiors",
      "Industrial Facility Fit-outs",
      "Restroom Solutions",
      "Retail Interior Design",
      "Hospitality Projects",
      "Educational Institutions",
    ],
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
  },
  uae: {
    city: "Dubai, UAE",
    region: "Middle East",
    address: "Al Quoz Industrial Area 3, Dubai, United Arab Emirates",
    phone: "+971 4 333 4444",
    email: "dubai@pacificproducts.com",
    description:
      "Expanding our reach across the Middle East, our Dubai office serves clients in UAE, Saudi Arabia, and other GCC countries with world-class interior contracting solutions.",
    projects: ["Dubai International Airport", "Mall of the Emirates", "DIFC Corporate Towers", "Burj Khalifa Lobby", "Dubai Frame", "Expo City Dubai"],
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57840.02!2d55.2308!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f696ef9df4b4d%3A0x2e3e16da3b3b3b3b!2sAl%20Quoz%2C%20Dubai!5e0!3m2!1sen!2sae!4v1713550212891!5m2!1sen!2sae",
    stats: [
      { label: "Projects Completed", value: "70+" },
      { label: "GCC Countries Served", value: "5+" },
      { label: "Sq. Ft. Installed", value: "1M+" },
      { label: "International Clients", value: "45+" },
    ],
    services: [
      "Luxury Commercial Fit-outs",
      "Airport & Transit Hubs",
      "Hotel & Hospitality Interiors",
      "High-End Retail Spaces",
      "Corporate Headquarters",
      "GCC Export & Supply",
    ],
    hours: "Sun–Thu: 9:00 AM – 6:00 PM",
  },
};

// ─── Page Component ────────────────────────────────────────────

export default function LocationPage() {
  const { location } = useParams<{ location: string }>();
  const navigate = useNavigate();
  const data = location ? locationData[location] : null;

  if (!data) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-[#030213]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#030213] dark:text-white mb-4">Location Not Found</h1>
          <Button onClick={() => navigate("/contact")}>View All Locations</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] text-[#030213] dark:text-white transition-colors">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(127,183,6,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(181,248,35,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
          animate={{ scale: [1, 1.1, 1], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,#7FB706 0,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,#7FB706 0,transparent 1px,transparent 48px)" }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back link */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/contact")}
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#7FB706] dark:hover:text-[#B5F823] transition-colors mb-10 group text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            All Locations
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            {/* Region badge */}
            <span className="inline-flex items-center gap-2 bg-[#7FB706]/10 border border-[#7FB706]/25 text-[#B5F823] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5F823] animate-pulse" />
              {data.region}
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#030213] dark:text-white leading-tight mb-6">
              {data.city}
              <span className="block text-[#7FB706] mt-1">Office</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
              {data.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <section className="border-y border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a1a] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 dark:divide-white/5">
            {data.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="py-10 px-6 text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-[#7FB706] dark:text-[#B5F823] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Cards + Services ──────────────────────────── */}
      <section className="py-24 bg-white dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-10">
                Contact <span className="text-[#7FB706]">Information</span>
              </h2>

              <div className="space-y-5">
                {[
                  { icon: MapPin, label: "Address", value: data.address, href: undefined },
                  { icon: Phone, label: "Phone", value: data.phone, href: `tel:${data.phone}` },
                  { icon: Mail, label: "Email", value: data.email, href: `mailto:${data.email}` },
                  { icon: Clock, label: "Business Hours", value: data.hours, href: undefined },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div
                    key={label}
                    className="flex items-start gap-5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl p-5 hover:border-[#7FB706]/30 hover:bg-[#7FB706]/5 dark:hover:bg-white/[0.06] transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#7FB706]/10 border border-[#7FB706]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7FB706]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[#B5F823]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-widest mb-1">{label}</p>
                      {href ? (
                        <a href={href} className="text-gray-700 dark:text-gray-300 hover:text-[#7FB706] dark:hover:text-[#B5F823] transition-colors font-medium leading-relaxed">
                          {value}
                        </a>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-[#7FB706]/15 to-[#7FB706]/5 border border-[#7FB706]/25 rounded-3xl p-7">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#B5F823]/10 rounded-full blur-3xl" />
                <h3 className="text-xl font-bold text-[#030213] dark:text-white mb-2 relative z-10">Need Instant Support?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm relative z-10">Chat directly with our {data.city} team on WhatsApp</p>
                <button
                  onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                  className="relative z-10 inline-flex items-center px-6 py-3 bg-[#7FB706] text-white font-semibold rounded-xl hover:bg-[#8cc70a] shadow-lg shadow-[#7FB706]/25 transition-all hover:scale-105 active:scale-95 text-sm"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </button>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-10">
                Services <span className="text-[#7FB706]">Offered</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {data.services.map((service, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-xl p-4 hover:border-[#7FB706]/30 hover:bg-[#7FB706]/5 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#7FB706] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-snug">{service}</span>
                  </motion.div>
                ))}
              </div>

              {/* Notable Projects */}
              <div>
                <h3 className="text-xl font-bold text-[#030213] dark:text-white mb-5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#7FB706]" />
                  Notable Projects
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.projects.map((project, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      className="bg-gradient-to-br from-[#7FB706]/10 to-transparent border border-[#7FB706]/15 rounded-xl p-3 text-center hover:border-[#7FB706]/40 hover:from-[#7FB706]/20 transition-all duration-300 group"
                    >
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#030213] dark:group-hover:text-white transition-colors leading-tight">
                        {project}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────── */}
      <section className="relative border-t border-gray-100 dark:border-white/5">
        <div className="h-[440px] sm:h-[520px] w-full relative overflow-hidden">
          {/* Overlay label */}
          <div className="absolute top-6 left-6 z-20 bg-white/90 dark:bg-[#030213]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl">
            <MapPin className="w-5 h-5 text-[#7FB706] dark:text-[#B5F823]" />
            <div>
              <p className="text-[#030213] dark:text-white font-semibold text-sm">{data.city}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{data.region}</p>
            </div>
          </div>
          <iframe
            src={data.mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale opacity-70 hover:opacity-90 transition-opacity duration-500"
            title={`${data.city} Office Location`}
          />
          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white dark:from-[#030213] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#7FB706] to-[#5a8c04] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#B5F823] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-white/80 mb-10">
              Our {data.city} team is ready to help. Get a free consultation and detailed quote today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold shadow-xl shadow-black/20"
                onClick={() => navigate("/contact")}
              >
                Schedule a Visit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(data.address)}`, "_blank")}
                className="inline-flex items-center justify-center px-8 py-4 text-white border-2 border-white/40 rounded-xl font-semibold hover:bg-white/10 hover:border-white/70 transition-all duration-300 text-lg gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Open in Maps
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
