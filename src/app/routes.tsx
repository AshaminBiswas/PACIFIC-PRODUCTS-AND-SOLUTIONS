import { createBrowserRouter } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Outlet } from "react-router";
import { Suspense, lazy } from "react";
import {
  PageSkeleton,
  ProductsSkeleton,
  ProductDetailSkeleton,
  SolutionsSkeleton,
  GallerySkeleton,
  AboutSkeleton,
  ContactSkeleton,
  BlogSkeleton,
} from "./components/Skeletons";

// ── Lazy-loaded Pages ─────────────────────────────────────────────────────
const Home        = lazy(() => import("./pages/Home"));
const About       = lazy(() => import("./pages/About"));
const Products    = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Solutions   = lazy(() => import("./pages/Solutions"));
const SolutionDetail = lazy(() => import("./pages/SolutionDetail"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const Gallery     = lazy(() => import("./pages/Gallery"));
const Contact     = lazy(() => import("./pages/Contact"));
const Blog        = lazy(() => import("./pages/Blog"));
const BlogDetail  = lazy(() => import("./pages/BlogDetail"));
const Brochure    = lazy(() => import("./pages/Brochure"));
const NotFound    = lazy(() => import("./pages/NotFound"));

// ── Lazy-loaded Admin Pages ───────────────────────────────────────────────
const AdminLogin      = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard  = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOverview   = lazy(() => import("./pages/admin/AdminOverview"));
const AdminProducts   = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBlogs      = lazy(() => import("./pages/admin/AdminBlogs"));
const AdminSolutions  = lazy(() => import("./pages/admin/AdminSolutions"));
const AdminGallery    = lazy(() => import("./pages/admin/AdminGallery"));
const AdminHero       = lazy(() => import("./pages/admin/AdminHero"));
const AdminCoreServices = lazy(() => import("./pages/admin/AdminCoreServices"));
const AdminPageBanners  = lazy(() => import("./pages/admin/AdminPageBanners"));
const AdminContactQueries = lazy(() => import("./pages/admin/AdminContactQueries"));

// ── Layout ────────────────────────────────────────────────────────────────
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
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}

// ── Privacy & Terms (inline, no lazy needed) ──────────────────────────────
function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 py-24 bg-white dark:bg-[#030213] text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-5xl font-bold text-[#030213] dark:text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Last updated: March 29, 2026</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Pacific Products & Solutions ("we", "our", or "us") is committed to protecting your privacy.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">We collect information that you provide directly to us, including name, email, phone number, and project details when you contact us or request a quote.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">We use the information we collect to respond to your inquiries, provide quotes, and communicate about our products and services.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">If you have questions about this Privacy Policy, please contact us at info@pacificproducts.com</p>
        </div>
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen pt-20 py-24 bg-white dark:bg-[#030213] text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-5xl font-bold text-[#030213] dark:text-white mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Last updated: March 29, 2026</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Welcome to Pacific Products & Solutions. By accessing our website, you agree to these terms of service.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Website</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">You may use our website for lawful purposes only. You agree not to use our website in any way that could damage or impair our services.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">All content on this website, including text, graphics, logos, and images, is the property of Pacific Products & Solutions and protected by copyright laws.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
          <p className="text-gray-700 dark:text-gray-300">For questions about these Terms, contact us at info@pacificproducts.com</p>
        </div>
      </div>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<AboutSkeleton />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<ProductsSkeleton />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "products/:slug",
        element: (
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: "solutions",
        element: (
          <Suspense fallback={<SolutionsSkeleton />}>
            <Solutions />
          </Suspense>
        ),
      },
      {
        path: "solutions/:industry",
        element: (
          <Suspense fallback={<SolutionsSkeleton />}>
            <SolutionDetail />
          </Suspense>
        ),
      },
      {
        path: "locations/:location",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <LocationDetail />
          </Suspense>
        ),
      },
      {
        path: "gallery",
        element: (
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<ContactSkeleton />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "blog",
        element: (
          <Suspense fallback={<BlogSkeleton />}>
            <Blog />
          </Suspense>
        ),
      },
      {
        path: "blog/:slug",
        element: (
          <Suspense fallback={<BlogSkeleton />}>
            <BlogDetail />
          </Suspense>
        ),
      },
      {
        path: "brochure",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Brochure />
          </Suspense>
        ),
      },

      // Additional aliased paths
      {
        path: "process",
        element: (
          <Suspense fallback={<AboutSkeleton />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "testimonials",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "clients",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "careers",
        element: (
          <Suspense fallback={<ContactSkeleton />}>
            <Contact />
          </Suspense>
        ),
      },
      { path: "privacy", Component: PrivacyPage },
      { path: "terms",   Component: TermsPage },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <AdminDashboard />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminOverview />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminProducts />
          </Suspense>
        ),
      },
      {
        path: "blogs",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminBlogs />
          </Suspense>
        ),
      },
      {
        path: "solutions",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminSolutions />
          </Suspense>
        ),
      },
      {
        path: "gallery",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminGallery />
          </Suspense>
        ),
      },
      {
        path: "hero",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminHero />
          </Suspense>
        ),
      },
      {
        path: "core-services",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminCoreServices />
          </Suspense>
        ),
      },
      {
        path: "page-banners",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminPageBanners />
          </Suspense>
        ),
      },
      {
        path: "contact-queries",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminContactQueries />
          </Suspense>
        ),
      },
    ],
  },
]);
