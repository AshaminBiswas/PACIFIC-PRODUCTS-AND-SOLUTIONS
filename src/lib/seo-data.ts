// ── SEO Constants & Structured Data Factories ─────────────────────────────

export const SITE_NAME = "Pacific Products & Solutions";
export const SITE_URL = "https://pacificproduct.in";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_DESCRIPTION =
  "India's leading B2B interior contracting company specializing in premium restroom cubicles, exterior cladding, wall paneling, locker solutions, and custom hardware for commercial spaces.";
export const DEFAULT_KEYWORDS = 
  "restroom cubicles manufacturer India, toilet partitions Delhi, exterior cladding contractors, HPL cubicle hardware, commercial washroom panels, locker system suppliers, Pacific Products and Solutions, toilet cubicles, locker system, shower cubicles";

// ── Organization Schema ───────────────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/src/image/logo/logo.webp`,
    description: DEFAULT_DESCRIPTION,
    email: "info@pacificproduct.in",
    telephone: "+919818592113",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=100063648025932",
      "https://youtube.com/@pacificcubicles",
      "https://www.linkedin.com/company/pacific-products-and-solutions",
      "https://www.instagram.com/pacificcubicles",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+919818592113",
      contactType: "sales",
      areaServed: ["IN", "AE"],
      availableLanguage: ["English", "Hindi"],
    },
  };
}

// ── LocalBusiness Schema ──────────────────────────────────────────────────

export function localBusinessSchema(location?: {
  city: string;
  address: string;
  phone: string;
  email: string;
  region: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    image: `${SITE_URL}/src/image/logo/logo.webp`,
    url: SITE_URL,
    telephone: location?.phone || "+919818592113",
    email: location?.email || "info@pacificproduct.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: location?.address || "Okhla Industrial Estate",
      addressLocality: location?.city || "New Delhi",
      addressRegion: location?.region || "Delhi",
      addressCountry: "IN",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  };
}

// ── Product Schema ────────────────────────────────────────────────────────

export function productSchema(product: {
  title: string;
  description?: string;
  image_url?: string;
  slug: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `Premium ${product.title} by ${SITE_NAME}`,
    image: product.image_url,
    url: `${SITE_URL}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.category,
    manufacturer: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

// ── FAQPage Schema ────────────────────────────────────────────────────────

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ── BlogPosting Schema ────────────────────────────────────────────────────

export function blogPostSchema(post: {
  title: string;
  content?: string;
  cover_image?: string;
  created_at?: string;
  slug: string;
  excerpt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.cover_image,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.created_at,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/src/image/logo/logo.webp`,
      },
    },
  };
}

// ── BreadcrumbList Schema ─────────────────────────────────────────────────

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ── WebSite Schema (for sitelinks search) ─────────────────────────────────

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
