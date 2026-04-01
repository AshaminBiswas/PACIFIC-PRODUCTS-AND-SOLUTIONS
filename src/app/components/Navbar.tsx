import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./Button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate(); // Added useNavigate hook

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMobileDropdown(null);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    {
      name: "Products",
      path: "/products",
      dropdown: [
        { name: "Restroom Cubicles", path: "/products/restroom-cubicles" },
        { name: "Toilet Cubicles", path: "/products/toilet-cubicles" },
        { name: "Toilet Partitions", path: "/products/toilet-partitions" },
        { name: "Cubicle Hardware", path: "/products/cubicle-hardware" },
        { name: "Exterior Cladding", path: "/products/exterior-cladding" },
        { name: "Interior Paneling", path: "/products/interior-paneling" },
        { name: "Acrylic Solid Surface", path: "/products/acrylic-solid-surface" },
      ],
    },
    {
      name: "Solutions",
      path: "/solutions",
      dropdown: [
        { name: "Airports", path: "/solutions/airports" },
        { name: "Malls", path: "/solutions/malls" },
        { name: "Offices", path: "/solutions/offices" },
        { name: "Residential", path: "/solutions/residential" },
      ],
    },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleMobileDropdown = (name: string) => {
    setActiveMobileDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/95 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl sm:text-2xl font-bold text-[#030213]"
            >
              <span className="text-[#7FB706]">PACIFIC</span>
              <br />
              <span className="text-[10px] sm:text-xs font-normal tracking-wider">
                PRODUCTS & SOLUTIONS
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 py-2 text-sm xl:text-base transition-colors ${
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/")
                      ? "text-[#7FB706]"
                      : "text-[#030213] hover:text-[#7FB706]"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.dropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`block px-4 py-2.5 text-sm transition-colors hover:bg-[#E9FDBF] ${
                            location.pathname === subItem.path
                              ? "text-[#7FB706] bg-[#E9FDBF]"
                              : "text-[#030213]"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Button – desktop */}
          <div className="hidden lg:block flex-shrink-0">
            {/* Updated to use navigate */}
            <Button onClick={() => navigate("/contact")}>
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6 text-[#030213]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-6 h-6 text-[#030213]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 4rem)" }}
            >
              <div className="py-3 px-4 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <>
                        {/* Parent item with toggle */}
                        <button
                          onClick={() => toggleMobileDropdown(item.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                            activeMobileDropdown === item.name
                              ? "bg-[#E9FDBF] text-[#7FB706]"
                              : "hover:bg-gray-50 text-[#030213]"
                          }`}
                        >
                          <span>{item.name}</span>
                          <motion.div
                            animate={{
                              rotate: activeMobileDropdown === item.name ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </button>

                        {/* Accordion sub-items */}
                        <AnimatePresence>
                          {activeMobileDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-1 ml-4 pl-4 border-l-2 border-[#7FB706]/30 space-y-1 pb-2">
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setActiveMobileDropdown(null);
                                    }}
                                    className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                      location.pathname === subItem.path
                                        ? "text-[#7FB706] bg-[#E9FDBF] font-medium"
                                        : "text-gray-600 hover:bg-[#E9FDBF] hover:text-[#7FB706]"
                                    }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          location.pathname === item.path
                            ? "bg-[#E9FDBF] text-[#7FB706]"
                            : "hover:bg-gray-50 text-[#030213]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                {/* CTA inside mobile menu */}
                <div className="pt-3 pb-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate("/contact"); // Updated to use navigate
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}