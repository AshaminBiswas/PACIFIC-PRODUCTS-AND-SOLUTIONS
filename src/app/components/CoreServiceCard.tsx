import { motion } from "motion/react";
import type { CoreService } from "../../lib/database.types";

interface CoreServiceCardProps {
  service: CoreService;
}

export function CoreServiceCard({ service }: CoreServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square md:aspect-[4/5] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={service.image_url}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Dark overlay gradient that becomes completely dark on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:bg-black/70" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <motion.div
          className="relative z-10"
          initial={false}
          animate={{ y: 0 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-[#7FB706] transition-colors duration-300">
            {service.title}
          </h3>
          
          <div className="overflow-hidden">
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 ease-in-out transform translate-y-4 group-hover:translate-y-0">
              {service.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#7FB706] transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
