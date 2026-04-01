import { createBrowserRouter } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Outlet } from "react-router";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SolutionDetail from "./pages/SolutionDetail";
import LocationDetail from "./pages/LocationDetail";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "products", Component: Products },
      { path: "products/:slug", Component: ProductDetail },
      { path: "solutions/:industry", Component: SolutionDetail },
      { path: "locations/:location", Component: LocationDetail },
      { path: "gallery", Component: Gallery },
      { path: "contact", Component: Contact },
      
      // Additional pages that would be created
      { path: "process", Component: About }, // Using About as placeholder
      { path: "testimonials", Component: Home }, // Using Home as placeholder
      { path: "clients", Component: Home }, // Using Home as placeholder
      { path: "careers", Component: Contact }, // Using Contact as placeholder
      { path: "blog", Component: Gallery }, // Using Gallery as placeholder
      { path: "privacy", Component: () => (
        <div className="min-h-screen pt-20 py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-5xl font-bold text-[#030213] mb-8">Privacy Policy</h1>
            <div className="prose prose-lg">
              <p className="text-gray-700 mb-4">Last updated: March 29, 2026</p>
              <p className="text-gray-700 mb-4">
                Pacific Products & Solutions ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
              </p>
              <h2 className="text-2xl font-semibold text-[#030213] mt-8 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information that you provide directly to us, including name, email, phone number, and project details when you contact us or request a quote.
              </p>
              <h2 className="text-2xl font-semibold text-[#030213] mt-8 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to respond to your inquiries, provide quotes, and communicate about our products and services.
              </p>
              <h2 className="text-2xl font-semibold text-[#030213] mt-8 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us at info@pacificproducts.com
              </p>
            </div>
          </div>
        </div>
      )},
      { path: "terms", Component: () => (
        <div className="min-h-screen pt-20 py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-5xl font-bold text-[#030213] mb-8">Terms of Service</h1>
            <div className="prose prose-lg">
              <p className="text-gray-700 mb-4">Last updated: March 29, 2026</p>
              <p className="text-gray-700 mb-4">
                Welcome to Pacific Products & Solutions. By accessing our website, you agree to these terms of service.
              </p>
              <h2 className="text-2xl font-semibold text-[#030213] mt-8 mb-4">Use of Website</h2>
              <p className="text-gray-700 mb-4">
                You may use our website for lawful purposes only. You agree not to use our website in any way that could damage or impair our services.
              </p>
              <h2 className="text-2xl font-semibold text-[#030213] mt-8 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on this website, including text, graphics, logos, and images, is the property of Pacific Products & Solutions and protected by copyright laws.
              </p>
              <h2 className="text-2xl font-semibold text-[#030213] mt-8 mb-4">Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms, contact us at info@pacificproducts.com
              </p>
            </div>
          </div>
        </div>
      )},
      { path: "*", Component: NotFound },
    ],
  },
]);
