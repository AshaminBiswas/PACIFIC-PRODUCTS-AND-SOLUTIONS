import { createBrowserRouter } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Outlet } from "react-router";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Solutions from "./pages/Solutions";
import SolutionDetail from "./pages/SolutionDetail";
import LocationDetail from "./pages/LocationDetail";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Brochure from "./pages/Brochure";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminHero from "./pages/admin/AdminHero";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919818592113" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1ebe57] transition-all hover:scale-110 hover:shadow-xl group"
        aria-label="Chat with us on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
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
      { path: "solutions", Component: Solutions },
      { path: "solutions/:industry", Component: SolutionDetail },
      { path: "locations/:location", Component: LocationDetail },
      { path: "gallery", Component: Gallery },
      { path: "contact", Component: Contact },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogDetail },
      { path: "brochure", Component: Brochure },
      
      // Additional pages
      { path: "process", Component: About },
      { path: "testimonials", Component: Home },
      { path: "clients", Component: Home },
      { path: "careers", Component: Contact },
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
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
    children: [
      { index: true, Component: AdminOverview },
      { path: "products", Component: AdminProducts },
      { path: "blogs", Component: AdminBlogs },
      { path: "solutions", Component: AdminSolutions },
      { path: "gallery", Component: AdminGallery },
      { path: "hero", Component: AdminHero },
    ],
  },
]);

