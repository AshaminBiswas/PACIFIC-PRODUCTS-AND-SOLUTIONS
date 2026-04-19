/**
 * Auto-generated–style type definitions for the Supabase database.
 * Mirrors the schema created by supabase-schema.sql.
 */

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
      blogs: {
        Row: Blog;
        Insert: Omit<Blog, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Blog, "id" | "created_at">>;
      };
      solutions: {
        Row: Solution;
        Insert: Omit<Solution, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Solution, "id" | "created_at">>;
      };
      gallery_images: {
        Row: GalleryImage;
        Insert: Omit<GalleryImage, "id" | "created_at">;
        Update: Partial<Omit<GalleryImage, "id" | "created_at">>;
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
