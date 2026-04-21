/**
 * Auto-generated–style type definitions for the Supabase database.
 * Mirrors the schema created by supabase-schema.sql.
 */

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Partial<Product> & Pick<Product, "slug" | "title">;
        Update: Partial<Product>;
      };
      blogs: {
        Row: Blog;
        Insert: Partial<Blog> & Pick<Blog, "slug" | "title" | "content">;
        Update: Partial<Blog>;
      };
      solutions: {
        Row: Solution;
        Insert: Partial<Solution> & Pick<Solution, "slug" | "title">;
        Update: Partial<Solution>;
      };
      gallery_images: {
        Row: GalleryImage;
        Insert: Partial<GalleryImage> & Pick<GalleryImage, "title" | "image_url">;
        Update: Partial<GalleryImage>;
      };
      hero_images: {
        Row: HeroImage;
        Insert: Partial<HeroImage> & Pick<HeroImage, "url">;
        Update: Partial<HeroImage>;
      };
      core_services: {
        Row: CoreService;
        Insert: Partial<CoreService> & Pick<CoreService, "title" | "image_url">;
        Update: Partial<CoreService>;
      };
      page_banners: {
        Row: PageBanner;
        Insert: Partial<PageBanner> & Pick<PageBanner, "page_slug" | "image_url">;
        Update: Partial<PageBanner>;
      };
      contact_queries: {
        Row: ContactQuery;
        Insert: Partial<ContactQuery> & Pick<ContactQuery, "name" | "email" | "phone">;
        Update: Partial<ContactQuery>;
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
}

// ── Row types ─────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image_url: string;
  additional_images: string[];
  features: string[];
  specifications: { label: string; value: string }[];
  applications: string[];
  is_featured: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Solution {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon_name: string;
  image_url: string;
  additional_images: string[];
  features: string[];
  clients: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface HeroImage {
  id: string;
  url: string;
  description: string;
  sort_order: number;
  created_at: string;
}

export interface CoreService {
  id: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface PageBanner {
  id: string;
  page_slug: string; // 'about' | 'services' | 'solutions' | 'gallery'
  image_url: string;
  title: string;
  subtitle: string;
  created_at: string;
}

export interface ContactQuery {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  requirement: string | null;
  message: string | null;
  status: string;
  created_at: string;
}
