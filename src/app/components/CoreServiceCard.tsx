import { motion } from "motion/react";
import type { CoreService } from "../../lib/database.types";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface CoreServiceCardProps {
  service: CoreService;
  index: number;
}

export function CoreServiceCard({ service, index }: CoreServiceCardProps) {
  // Pad the index with a leading zero (e.g., "01", "02")
  const paddedNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-white dark:bg-[#0a0a1a] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      {/* Dynamic Hover Glow Border */}
      <div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: `inset 0 0 0 1.5px #7FB706` }}
      />

      {/* Top Section: Image area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900 z-10">
        <img
          src={service.image_url}
          alt={service.title}
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Subtle dark gradient overlay to make the overlay text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        
        {/* Brand Green overlay on hover */}
        <div 
          className="absolute inset-0 bg-[#7FB706] opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay"
        />

        {/* Large stylized number */}
        <div className="absolute top-4 right-6 pointer-events-none transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-x-1 group-hover:translate-y-1">
          <span className="text-6xl font-black text-white/30 group-hover:text-[#7FB706] transition-colors duration-500 select-none drop-shadow-lg">
            {paddedNumber}
          </span>
        </div>

        {/* Floating status tag inside image */}
        <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-white/10 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 transition-transform duration-500 group-hover:translate-x-1">
          <span className="w-2 h-2 rounded-full bg-[#B5F823] animate-pulse shadow-[0_0_8px_#B5F823]" />
          <span className="text-xs font-semibold tracking-wider text-white uppercase">
            Available
          </span>
        </div>
      </div>

      {/* Bottom Section: Content area */}
      <div className="flex flex-col flex-1 p-6 sm:p-8 z-10 relative bg-white dark:bg-[#0a0a1a]">
        
        {/* Title & Arrow */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-[#7FB706]">
            {service.title}
          </h3>
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-[#7FB706] group-hover:text-white transition-colors duration-500 shrink-0 mt-1"
          >
            <ArrowRight className="w-5 h-5 transform transition-transform duration-500 group-hover:translate-x-1" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-6">
          {service.description}
        </p>

        {/* Footer Features */}
        <div className="mt-auto pt-5 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-4 relative overflow-hidden">
          {/* Animated border top */}
          <div 
            className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#7FB706] to-[#B5F823] group-hover:w-full transition-all duration-700 ease-out"
          />
          
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-[#7FB706]" />
            Premium Quality
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-[#7FB706]" />
            Expert Setup
          </div>
        </div>
      </div>
    </motion.div>
  );
}
