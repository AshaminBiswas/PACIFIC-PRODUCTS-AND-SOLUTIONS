import { Link } from "react-router";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const productLinks = [
    { name: "Restroom Cubicles", path: "/products/restroom-cubicles" },
    { name: "Toilet Cubicles", path: "/products/toilet-cubicles" },
    { name: "Toilet Partitions", path: "/products/toilet-partitions" },
    { name: "Cubicle Hardware", path: "/products/cubicle-hardware" },
    { name: "Exterior Cladding", path: "/products/exterior-cladding" },
    { name: "Interior Paneling", path: "/products/interior-paneling" },
  ];

  const solutionLinks = [
    { name: "Airports", path: "/solutions/airports" },
    { name: "Malls", path: "/solutions/malls" },
    { name: "Offices", path: "/solutions/offices" },
    { name: "Residential", path: "/solutions/residential" },
  ];

  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Our Process", path: "/process" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Careers", path: "/careers" },
    { name: "Blog", path: "/blog" },
  ];

  const locationLinks = [
    { name: "Delhi", path: "/locations/delhi" },
    { name: "Mumbai", path: "/locations/mumbai" },
    { name: "Bangalore", path: "/locations/bangalore" },
    { name: "Ahmedabad", path: "/locations/ahmedabad" },
    { name: "UAE", path: "/locations/uae" },
  ];

  return (
    <footer className="bg-[#030213] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                <span className="text-[#7FB706]">PACIFIC</span>
              </h3>
              <p className="text-xs tracking-wider text-gray-400">PRODUCTS & SOLUTIONS</p>
            </div>
            <p className="text-gray-400 mb-6">
              Leading provider of premium interior contracting solutions, specializing in restroom cubicles, cladding, and paneling.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#7FB706] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#7FB706] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#7FB706] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#7FB706] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold mb-4 text-[#B5F823]">Products</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#7FB706] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-bold mb-4 text-[#B5F823]">Solutions</h4>
            <ul className="space-y-2">
              {solutionLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#7FB706] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-[#B5F823]">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#7FB706] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Locations */}
          <div>
            <h4 className="font-bold mb-4 text-[#B5F823]">Contact</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-1 text-[#7FB706]" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1 text-[#7FB706]" />
                <span className="text-gray-400 text-sm">info@pacificproducts.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 text-[#7FB706]" />
                <span className="text-gray-400 text-sm">Mumbai, India</span>
              </li>
            </ul>
            <h5 className="font-semibold mb-2 text-sm">Our Locations</h5>
            <ul className="space-y-1">
              {locationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#7FB706] transition-colors text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2026 Pacific Products & Solutions. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-[#7FB706] text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-[#7FB706] text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
