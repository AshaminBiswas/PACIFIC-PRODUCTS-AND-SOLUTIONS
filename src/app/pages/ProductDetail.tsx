import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { CheckCircle2, Shield, Zap, Award } from "lucide-react";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// 1. Added TypeScript Interfaces for better type safety
interface ProductSpecification {
  label: string;
  value: string;
}

interface Product {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  specifications: ProductSpecification[];
  applications: string[];
}

// 2. Applied the Product type to the data object
const productData: Record<string, Product> = {
  "restroom-cubicles": {
    title: "Restroom Cubicles",
    subtitle: "Premium Commercial Restroom Solutions",
    description: "High-quality, durable restroom cubicle systems designed for heavy-traffic commercial environments. Our cubicles combine functionality with modern aesthetics.",
    image: "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0cm9vbSUyMGN1YmljbGVzJTIwY29tbWVyY2lhbHxlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Moisture-resistant materials",
      "Easy to clean and maintain",
      "Customizable colors and finishes",
      "Heavy-duty hardware",
      "Fire-resistant options available",
      "Quick installation",
    ],
    specifications: [
      { label: "Material", value: "HPL, Compact Laminate, PVC" },
      { label: "Panel Thickness", value: "12mm - 18mm" },
      { label: "Height", value: "1800mm - 2100mm" },
      { label: "Warranty", value: "5 Years" },
    ],
    applications: ["Airports", "Malls", "Corporate Offices", "Hotels", "Educational Institutions"],
  },
  "toilet-cubicles": {
    title: "Toilet Cubicles",
    subtitle: "Modern Toilet Partition Systems",
    description: "Contemporary toilet cubicle solutions that offer privacy, durability, and style. Perfect for both commercial and residential applications.",
    image: "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0cm9vbSUyMGN1YmljbGVzJTIwY29tbWVyY2lhbHxlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Sleek modern designs",
      "Water-resistant construction",
      "Anti-bacterial surface treatment",
      "Multiple finish options",
      "Durable hardware fittings",
      "Easy maintenance",
    ],
    specifications: [
      { label: "Material", value: "Compact Laminate, Aluminum" },
      { label: "Panel Thickness", value: "13mm - 20mm" },
      { label: "Standard Height", value: "1900mm" },
      { label: "Warranty", value: "7 Years" },
    ],
    applications: ["Shopping Centers", "Restaurants", "Gyms", "Public Facilities", "Transportation Hubs"],
  },
  "toilet-partitions": {
    title: "Toilet Partitions",
    subtitle: "Versatile Washroom Partition Solutions",
    description: "Flexible partition systems that maximize space efficiency while providing privacy and comfort in washroom facilities.",
    image: "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0cm9vbSUyMGN1YmljbGVzJTIwY29tbWVyY2lhbHxlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Space-efficient designs",
      "Corrosion-resistant hardware",
      "Impact-resistant panels",
      "Easy installation",
      "Multiple mounting options",
      "Customizable dimensions",
    ],
    specifications: [
      { label: "Material", value: "HPL, Phenolic, Stainless Steel" },
      { label: "Panel Thickness", value: "12mm - 25mm" },
      { label: "Door Width", value: "600mm - 900mm" },
      { label: "Warranty", value: "5 Years" },
    ],
    applications: ["Sports Stadiums", "Convention Centers", "Schools", "Hospitals", "Government Buildings"],
  },
  "cubicle-hardware": {
    title: "Cubicle Hardware",
    subtitle: "Premium Fittings & Accessories",
    description: "High-quality hardware components designed for smooth operation and long-lasting performance in commercial washroom environments.",
    image: "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBjbGFkZGluZyUyMHBhbmVsc3xlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Stainless steel construction",
      "Corrosion-resistant finish",
      "Smooth operation",
      "Heavy-duty hinges",
      "Indicator locks",
      "Self-closing mechanisms",
    ],
    specifications: [
      { label: "Material", value: "304/316 Stainless Steel" },
      { label: "Finish", value: "Satin, Mirror, Black" },
      { label: "Load Capacity", value: "Up to 50kg" },
      { label: "Warranty", value: "3 Years" },
    ],
    applications: ["All Commercial Washrooms", "Public Restrooms", "Educational Facilities", "Healthcare Centers"],
  },
  "exterior-cladding": {
    title: "Exterior Cladding",
    subtitle: "Weather-Resistant Building Facades",
    description: "Premium exterior cladding solutions that protect and enhance building facades with modern architectural finishes and superior weather resistance.",
    image: "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBjbGFkZGluZyUyMHBhbmVsc3xlbnwxfHx8fDE3NzQ3NzI3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Weather-resistant materials",
      "UV protection",
      "Low maintenance",
      "Energy efficient",
      "Fire-rated options",
      "Variety of textures and colors",
    ],
    specifications: [
      { label: "Material", value: "Aluminum Composite, Fiber Cement" },
      { label: "Panel Size", value: "1220mm x 2440mm" },
      { label: "Thickness", value: "3mm - 6mm" },
      { label: "Warranty", value: "10 Years" },
    ],
    applications: ["Commercial Buildings", "Residential Towers", "Industrial Facilities", "Institutional Buildings"],
  },
  "interior-paneling": {
    title: "Interior Paneling",
    subtitle: "Sophisticated Wall Paneling Systems",
    description: "Premium interior wall paneling that transforms spaces with style, acoustic benefits, and functional design for modern interiors.",
    image: "https://images.unsplash.com/photo-1686100510109-d520e59bf0ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZyUyMGludGVyaW9yfGVufDF8fHx8MTc3NDc3Mjc5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Acoustic properties",
      "Easy installation",
      "Wide range of finishes",
      "Durable and scratch-resistant",
      "Eco-friendly options",
      "Fire-resistant variants",
    ],
    specifications: [
      { label: "Material", value: "MDF, WPC, PVC, Wood Veneer" },
      { label: "Panel Size", value: "Customizable" },
      { label: "Thickness", value: "6mm - 18mm" },
      { label: "Warranty", value: "5 Years" },
    ],
    applications: ["Corporate Offices", "Hotels", "Retail Spaces", "Restaurants", "Residential Interiors"],
  },
  "acrylic-solid-surface": {
    title: "Acrylic Solid Surface",
    subtitle: "Premium Surface Solutions",
    description: "Seamless acrylic solid surface materials perfect for countertops, vanities, and decorative applications with endless design possibilities.",
    image: "https://images.unsplash.com/photo-1774578342098-66adff9c1fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNpZGVudGlhbCUyMGJhdGhyb29tJTIwZGVzaWdufGVufDF8fHx8MTc3NDc3Mjc5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Seamless joints",
      "Non-porous surface",
      "Stain resistant",
      "Easy to clean",
      "Thermoformable",
      "Repairable and renewable",
    ],
    specifications: [
      { label: "Material", value: "Acrylic Polymer + Minerals" },
      { label: "Sheet Size", value: "3050mm x 760mm" },
      { label: "Thickness", value: "6mm, 12mm" },
      { label: "Warranty", value: "10 Years" },
    ],
    applications: ["Kitchen Countertops", "Bathroom Vanities", "Reception Desks", "Wall Cladding", "Healthcare Facilities"],
  },
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // 3. Initialize the navigate hook
  const navigate = useNavigate(); 
  
  const product = slug ? productData[slug] : null;

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#030213] mb-4">Product Not Found</h1>
          {/* 4. Swapped window.location for navigate() */}
          <Button onClick={() => navigate("/products")}>View All Products</Button>
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
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-[#030213] mb-4">
                {product.title}
              </h1>
              <p className="text-2xl text-[#7FB706] mb-6">{product.subtitle}</p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-4">
                {/* 5. Swapped window.location for navigate() */}
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Request Quote
                </Button>
                <Button size="lg" variant="outline">
                  Download Catalog
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

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
              What makes our {product.title.toLowerCase()} stand out
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-3 bg-gray-50 rounded-xl p-6 hover:bg-[#E9FDBF]/30 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-[#7FB706] flex-shrink-0 mt-1" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-[#030213] mb-8">Technical Specifications</h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {/* 6. Applied ProductSpecification type */}
                {product.specifications.map((spec: ProductSpecification, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0"
                  >
                    <span className="font-semibold text-[#030213]">{spec.label}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-[#030213] mb-8">Why Choose Us</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Quality Assured",
                    description: "All products undergo rigorous quality testing",
                  },
                  {
                    icon: Zap,
                    title: "Fast Delivery",
                    description: "Quick turnaround time on all orders",
                  },
                  {
                    icon: Award,
                    title: "Expert Support",
                    description: "Technical assistance throughout your project",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-white rounded-xl p-6">
                    <div className="w-12 h-12 bg-[#E9FDBF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-[#7FB706]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#030213] mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#030213] mb-4">Ideal Applications</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Perfect for various commercial and residential settings
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {product.applications.map((app: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-3 bg-gradient-to-br from-[#7FB706] to-[#B5F823] text-white rounded-full font-semibold"
              >
                {app}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#030213] to-[#1a1a2e] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Contact our team for detailed specifications, pricing, and project consultation
            </p>
            {/* 7. Swapped window.location for navigate() */}
            <Button size="lg" variant="secondary" onClick={() => navigate("/contact")}>
              Request Detailed Quote
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}