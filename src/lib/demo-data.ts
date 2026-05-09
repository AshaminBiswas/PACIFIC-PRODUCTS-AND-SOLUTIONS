/**
 * Hardcoded demo data — used when Supabase isn't configured yet.
 * Once the DB is seeded, the frontend will read from Supabase instead.
 */
import type { Product, Blog, Solution, GalleryImage } from "./database.types";

// ── Products ─────────────────────────────────────────────────
export const demoProducts: Product[] = [
  {
    id: "demo-1",
    slug: "restroom-cubicles",
    title: "Restroom Cubicles",
    subtitle: "Premium Commercial Restroom Solutions",
    description:
      "High-quality, durable restroom cubicle systems designed for heavy-traffic commercial environments. Our cubicles combine functionality with modern aesthetics.",
    category: "Restroom Cubicles",
    image_url:
      "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    is_featured: true,
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    slug: "toilet-cubicles",
    title: "Toilet Cubicles",
    subtitle: "Modern Toilet Partition Systems",
    description:
      "Contemporary toilet cubicle solutions that offer privacy, durability, and style. Perfect for both commercial and residential applications.",
    category: "Restroom Cubicles",
    image_url:
      "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    is_featured: false,
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    slug: "toilet-partitions",
    title: "Toilet Partitions",
    subtitle: "Versatile Washroom Partition Solutions",
    description:
      "Flexible partition systems that maximize space efficiency while providing privacy and comfort in washroom facilities.",
    category: "Restroom Cubicles",
    image_url:
      "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    is_featured: false,
    sort_order: 3,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-4",
    slug: "cubicle-hardware",
    title: "Cubicle Hardware",
    subtitle: "Premium Fittings & Accessories",
    description:
      "High-quality hardware components designed for smooth operation and long-lasting performance in commercial washroom environments.",
    category: "Hardware",
    image_url:
      "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    is_featured: false,
    sort_order: 4,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-5",
    slug: "exterior-cladding",
    title: "Exterior Cladding",
    subtitle: "Weather-Resistant Building Facades",
    description:
      "Premium exterior cladding solutions that protect and enhance building facades with modern architectural finishes and superior weather resistance.",
    category: "Exterior Cladding",
    image_url:
      "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    is_featured: true,
    sort_order: 5,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-6",
    slug: "interior-paneling",
    title: "Interior Paneling",
    subtitle: "Sophisticated Wall Paneling Systems",
    description:
      "Premium interior wall paneling that transforms spaces with style, acoustic benefits, and functional design for modern interiors.",
    category: "Interior Paneling",
    image_url:
      "https://images.unsplash.com/photo-1686100510109-d520e59bf0ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    is_featured: true,
    sort_order: 6,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-7",
    slug: "acrylic-solid-surface",
    title: "Acrylic Solid Surface",
    subtitle: "Premium Surface Solutions",
    description:
      "Seamless acrylic solid surface materials perfect for countertops, vanities, and decorative applications with endless design possibilities.",
    category: "Surfaces",
    image_url:
      "https://images.unsplash.com/photo-1774578342098-66adff9c1fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    is_featured: false,
    sort_order: 7,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ── Solutions ────────────────────────────────────────────────
export const demoSolutions: Solution[] = [
  {
    id: "demo-s1",
    slug: "airports",
    title: "Airport Solutions",
    subtitle: "High-Traffic Washroom Solutions for Aviation Facilities",
    description:
      "Our specialized restroom solutions for airports are designed to handle high traffic volumes while maintaining premium aesthetics and durability.",
    icon_name: "Plane",
    image_url:
      "https://images.unsplash.com/photo-1759497904878-82c9bb21b2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: [
      "Heavy-duty construction for high traffic",
      "Easy maintenance and cleaning",
      "Vandal-resistant hardware",
      "Antimicrobial surface treatment",
      "Quick installation with minimal disruption",
      "Compliance with aviation standards",
    ],
    clients: ["Mumbai International Airport", "Delhi Airport", "Dubai International Airport"],
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-s2",
    slug: "malls",
    title: "Shopping Mall Solutions",
    subtitle: "Stylish and Durable Installations for Retail Spaces",
    description:
      "Transform your mall washrooms into premium experiences with our stylish and durable cubicle systems.",
    icon_name: "ShoppingBag",
    image_url:
      "https://images.unsplash.com/photo-1542883339-f2680a3e3996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: [
      "Contemporary designs matching mall aesthetics",
      "Wide range of colors and finishes",
      "Durable materials for heavy footfall",
      "Low maintenance requirements",
      "Customizable to brand requirements",
      "Quick installation during off-hours",
    ],
    clients: ["Phoenix Market City", "Select City Walk", "Dubai Mall"],
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-s3",
    slug: "offices",
    title: "Corporate Office Solutions",
    subtitle: "Professional Washroom Solutions for Corporate Environments",
    description:
      "Elevate your corporate washrooms with our premium solutions that reflect professionalism and provide comfort.",
    icon_name: "Building2",
    image_url:
      "https://images.unsplash.com/photo-1686100510109-d520e59bf0ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: [
      "Professional and elegant designs",
      "Sound-dampening properties",
      "Premium hardware and finishes",
      "Easy to clean surfaces",
      "Space-efficient layouts",
      "Accessible design options",
    ],
    clients: ["Infosys Bangalore", "TCS Mumbai", "Wipro Hyderabad"],
    sort_order: 3,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-s4",
    slug: "residential",
    title: "Residential Solutions",
    subtitle: "Premium Bathroom Solutions for Luxury Homes",
    description:
      "Bring hotel-like luxury to your home with our premium residential bathroom solutions.",
    icon_name: "Home",
    image_url:
      "https://images.unsplash.com/photo-1774578342098-66adff9c1fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: [
      "Customizable to personal preferences",
      "Premium materials and finishes",
      "Modern and elegant designs",
      "Long-lasting durability",
      "Easy maintenance",
      "Expert installation services",
    ],
    clients: ["Luxury Villas Dubai", "Premium Apartments Mumbai", "High-Rise Towers Bangalore"],
    sort_order: 4,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ── Blogs ────────────────────────────────────────────────────
export const demoBlogs: Blog[] = [
  {
    id: "demo-b1",
    slug: "choosing-right-cubicle-material",
    title: "How to Choose the Right Cubicle Material for Your Project",
    excerpt:
      "A comprehensive guide to selecting the best materials for restroom cubicles based on traffic, moisture, and budget requirements.",
    content:
      "## Choosing the Right Material\n\nWhen selecting materials for restroom cubicles, consider these key factors:\n\n### 1. Traffic Volume\nHigh-traffic areas like airports require compact laminate panels that resist wear.\n\n### 2. Moisture Exposure\nWet environments need materials with superior water resistance like HPL or phenolic panels.\n\n### 3. Budget\nBalance quality with cost — PVC is economical, while compact laminate offers premium durability.\n\n### 4. Aesthetics\nModern spaces benefit from sleek finishes available in compact laminate and aluminum options.",
    cover_image_url:
      "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    author: "Pacific Team",
    category: "Guides",
    tags: ["materials", "cubicles", "guide"],
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-b2",
    slug: "sustainable-interior-solutions",
    title: "Sustainable Interior Solutions: Building a Greener Future",
    excerpt:
      "Explore how eco-friendly materials and practices are transforming the interior contracting industry.",
    content:
      "## Sustainability in Interior Solutions\n\nThe construction industry is embracing sustainability. Here's how we contribute:\n\n### Eco-Friendly Materials\nOur panels use recycled content and FSC-certified wood products.\n\n### Energy Efficiency\nProper cladding reduces building energy consumption by up to 30%.\n\n### Waste Reduction\nPrecision manufacturing minimizes material waste on every project.",
    cover_image_url:
      "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    author: "Pacific Team",
    category: "Industry",
    tags: ["sustainability", "green building", "eco-friendly"],
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ── Gallery ──────────────────────────────────────────────────
export const demoGalleryImages: GalleryImage[] = [
  {
    id: "demo-g1",
    title: "Airport Restroom Facility",
    category: "airports",
    location_slug: null,
    placement: "general",
    image_url:
      "https://images.unsplash.com/photo-1759497904878-82c9bb21b2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-g2",
    title: "Shopping Mall Interior",
    category: "malls",
    location_slug: null,
    placement: "general",
    image_url:
      "https://images.unsplash.com/photo-1542883339-f2680a3e3996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-g3",
    title: "Corporate Office Washroom",
    category: "offices",
    location_slug: null,
    placement: "general",
    image_url:
      "https://images.unsplash.com/photo-1686100510109-d520e59bf0ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sort_order: 3,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-g4",
    title: "Luxury Residential Bathroom",
    category: "residential",
    location_slug: null,
    placement: "general",
    image_url:
      "https://images.unsplash.com/photo-1774578342098-66adff9c1fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sort_order: 4,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-g5",
    title: "Commercial Restroom Cubicles",
    category: "offices",
    location_slug: null,
    placement: "general",
    image_url:
      "https://images.unsplash.com/photo-1635493637999-ed6a733d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sort_order: 5,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-g6",
    title: "Retail Space Interior Paneling",
    category: "malls",
    location_slug: null,
    placement: "general",
    image_url:
      "https://images.unsplash.com/photo-1696454822226-3c57759522ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sort_order: 6,
    published: true,
    created_at: new Date().toISOString(),
  },
];
