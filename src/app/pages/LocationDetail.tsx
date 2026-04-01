import { motion } from "motion/react";
import { useParams } from "react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "../components/Button";

const locationData: Record<string, any> = {
  delhi: {
    city: "Delhi NCR",
    region: "North India",
    address: "Sector 18, Udyog Vihar, Gurugram - 122015, Haryana, India",
    phone: "+91 11 9876 5432",
    email: "delhi@pacificproducts.com",
    description: "Serving the National Capital Region with premium interior contracting solutions for over 10 years. Our Delhi office specializes in large-scale commercial projects.",
    projects: ["Delhi Metro Stations", "DLF Cyber Hub", "Aerocity Hotels"],
  },
  mumbai: {
    city: "Mumbai",
    region: "West India (Head Office)",
    address: "Plot No. 123, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra",
    phone: "+91 22 1234 5678",
    email: "mumbai@pacificproducts.com",
    description: "Our head office and manufacturing facility in Mumbai serves as the hub for all operations across India and international markets.",
    projects: ["Mumbai International Airport", "BKC Corporate Towers", "Phoenix Market City"],
  },
  bangalore: {
    city: "Bangalore",
    region: "South India",
    address: "Electronic City Phase 1, Bangalore - 560100, Karnataka, India",
    phone: "+91 80 5555 6666",
    email: "bangalore@pacificproducts.com",
    description: "Catering to the tech capital of India, our Bangalore office specializes in corporate office solutions and IT park facilities.",
    projects: ["Infosys Campus", "Tech Parks", "UB City Mall"],
  },
  ahmedabad: {
    city: "Ahmedabad",
    region: "West India",
    address: "GIDC Industrial Estate, Ahmedabad - 382424, Gujarat, India",
    phone: "+91 79 4444 3333",
    email: "ahmedabad@pacificproducts.com",
    description: "Serving Gujarat and surrounding states with high-quality interior solutions for commercial and residential projects.",
    projects: ["Ahmedabad Metro", "Torrent Power Campus", "Retail Outlets"],
  },
  uae: {
    city: "Dubai, UAE",
    region: "Middle East",
    address: "Al Quoz Industrial Area 3, Dubai, United Arab Emirates",
    phone: "+971 4 333 4444",
    email: "dubai@pacificproducts.com",
    description: "Expanding our reach across the Middle East, our Dubai office serves clients in UAE, Saudi Arabia, and other GCC countries.",
    projects: ["Dubai International Airport", "Shopping Malls", "Corporate Towers"],
  },
};

export default function LocationPage() {
  const { location } = useParams<{ location: string }>();
  const data = location ? locationData[location] : null;

  if (!data) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#030213] mb-4">Location Not Found</h1>
          <Button onClick={() => (window.location.href = "/contact")}>View All Locations</Button>
        </div>
      </div>
    );
  }

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
            <p className="text-xl text-[#7FB706] mb-4">{data.region}</p>
            <h1 className="text-5xl sm:text-6xl font-bold text-[#030213] mb-6">{data.city}</h1>
            <p className="text-xl text-gray-700 leading-relaxed">{data.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 mb-16"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-[#E9FDBF] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-[#7FB706]" />
                </div>
                <h3 className="font-semibold text-[#030213] mb-2">Address</h3>
                <p className="text-gray-600 text-sm">{data.address}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#E9FDBF] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-[#7FB706]" />
                </div>
                <h3 className="font-semibold text-[#030213] mb-2">Phone</h3>
                <p className="text-gray-600">{data.phone}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#E9FDBF] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#7FB706]" />
                </div>
                <h3 className="font-semibold text-[#030213] mb-2">Email</h3>
                <p className="text-gray-600">{data.email}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#E9FDBF]/30 to-white rounded-2xl p-8 border border-[#7FB706]/20"
            >
              <h2 className="text-3xl font-bold text-[#030213] mb-6">Notable Projects</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {data.projects.map((project: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#7FB706] transition-colors"
                  >
                    <p className="text-center font-semibold text-[#030213]">{project}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="text-center mt-12">
              <Button size="lg" onClick={() => (window.location.href = "/contact")}>
                Schedule a Visit
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
