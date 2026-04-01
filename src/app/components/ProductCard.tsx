import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  path: string;
}

export function ProductCard({ title, description, image, path }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(127, 183, 6, 0.15)" }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group"
    >
      <div className="relative h-56 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-[#030213]">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <Link
          to={path}
          className="inline-flex items-center space-x-2 text-[#7FB706] hover:text-[#6fa005] transition-colors group/link"
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
