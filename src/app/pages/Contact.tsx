import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function ContactPage() {
  const locations = [
    {
      city: "Mumbai (Head Office)",
      address: "Plot No. 123, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra, India",
      phone: "+91 22 1234 5678",
      email: "mumbai@pacificproducts.com",
    },
    {
      city: "Delhi",
      address: "Sector 18, Udyog Vihar, Gurugram - 122015, Haryana, India",
      phone: "+91 11 9876 5432",
      email: "delhi@pacificproducts.com",
    },
    {
      city: "Bangalore",
      address: "Electronic City Phase 1, Bangalore - 560100, Karnataka, India",
      phone: "+91 80 5555 6666",
      email: "bangalore@pacificproducts.com",
    },
    {
      city: "Dubai, UAE",
      address: "Al Quoz Industrial Area 3, Dubai, United Arab Emirates",
      phone: "+971 4 333 4444",
      email: "dubai@pacificproducts.com",
    },
  ];

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
              Get In <span className="text-[#7FB706]">Touch</span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Ready to start your project? Contact our team for expert consultation and detailed quotations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ContactForm />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-[#030213] mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  Get in touch with us through any of the following channels. Our team is ready to assist you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#E9FDBF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#7FB706]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#030213] mb-1">Phone</h4>
                    <p className="text-gray-600">+91 22 1234 5678</p>
                    <p className="text-gray-600">+91 98765 43210 (Sales)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#E9FDBF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#7FB706]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#030213] mb-1">Email</h4>
                    <p className="text-gray-600">info@pacificproducts.com</p>
                    <p className="text-gray-600">sales@pacificproducts.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#E9FDBF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#7FB706]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#030213] mb-1">Head Office</h4>
                    <p className="text-gray-600">
                      Plot No. 123, MIDC Industrial Area<br />
                      Andheri East, Mumbai - 400093<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#E9FDBF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#7FB706]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#030213] mb-1">Business Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-[#7FB706] to-[#6fa005] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Need Quick Assistance?</h3>
                <p className="mb-6">Chat with us on WhatsApp for instant support</p>
                <button
                  onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                  className="inline-flex items-center px-6 py-3 bg-white text-[#7FB706] rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#030213] mb-4">Our Locations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find us across major cities in India and UAE
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#7FB706] hover:shadow-lg transition-all"
              >
                <h3 className="text-2xl font-semibold text-[#030213] mb-4">{location.city}</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#7FB706] flex-shrink-0 mt-1" />
                    <p>{location.address}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#7FB706]" />
                    <p>{location.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#7FB706]" />
                    <p>{location.email}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
