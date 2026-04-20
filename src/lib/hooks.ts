/**
 * React hooks for fetching data from Supabase with demo-data fallback.
 */
import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { Product, Blog, Solution, GalleryImage, HeroImage } from "./database.types";
import {
  demoProducts,
  demoBlogs,
  demoSolutions,
  demoGalleryImages,
} from "./demo-data";

// ── Generic helpers ──────────────────────────────────────────

interface UseDataResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseSingleResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ── Products ─────────────────────────────────────────────────

export function useProducts(featuredOnly = false): UseDataResult<Product> {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      const filtered = featuredOnly
        ? demoProducts.filter((p) => p.is_featured)
        : demoProducts;
      setData(filtered);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (featuredOnly) {
        query = query.eq("is_featured", true);
      }

      const { data: rows, error: err } = await query;
      if (err) throw err;
      setData((rows as Product[]) || []);
    } catch (e: any) {
      console.error("Failed to fetch products:", e);
      setError(e.message);
      // Fallback to demo data on error
      const filtered = featuredOnly
        ? demoProducts.filter((p) => p.is_featured)
        : demoProducts;
      setData(filtered);
    } finally {
      setLoading(false);
    }
  }, [featuredOnly]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useProduct(slug: string | undefined): UseSingleResult<Product> {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);

      if (!isSupabaseConfigured()) {
        const found = demoProducts.find((p) => p.slug === slug) || null;
        setData(found);
        setLoading(false);
        return;
      }

      try {
        const { data: row, error: err } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .single();
        if (err) throw err;
        setData(row as Product);
      } catch (e: any) {
        console.error("Failed to fetch product:", e);
        setError(e.message);
        setData(demoProducts.find((p) => p.slug === slug) || null);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [slug]);

  return { data, loading, error };
}

// ── Solutions ────────────────────────────────────────────────

export function useSolutions(): UseDataResult<Solution> {
  const [data, setData] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData(demoSolutions);
      setLoading(false);
      return;
    }

    try {
      const { data: rows, error: err } = await supabase
        .from("solutions")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setData((rows as Solution[]) || []);
    } catch (e: any) {
      setError(e.message);
      setData(demoSolutions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useSolution(slug: string | undefined): UseSingleResult<Solution> {
  const [data, setData] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);

      if (!isSupabaseConfigured()) {
        setData(demoSolutions.find((s) => s.slug === slug) || null);
        setLoading(false);
        return;
      }

      try {
        const { data: row, error: err } = await supabase
          .from("solutions")
          .select("*")
          .eq("slug", slug)
          .single();
        if (err) throw err;
        setData(row as Solution);
      } catch (e: any) {
        setError(e.message);
        setData(demoSolutions.find((s) => s.slug === slug) || null);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [slug]);

  return { data, loading, error };
}

// ── Blogs ────────────────────────────────────────────────────

export function useBlogs(): UseDataResult<Blog> {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData(demoBlogs);
      setLoading(false);
      return;
    }

    try {
      const { data: rows, error: err } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (err) throw err;
      setData((rows as Blog[]) || []);
    } catch (e: any) {
      setError(e.message);
      setData(demoBlogs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useBlog(slug: string | undefined): UseSingleResult<Blog> {
  const [data, setData] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);

      if (!isSupabaseConfigured()) {
        setData(demoBlogs.find((b) => b.slug === slug) || null);
        setLoading(false);
        return;
      }

      try {
        const { data: row, error: err } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .single();
        if (err) throw err;
        setData(row as Blog);
      } catch (e: any) {
        setError(e.message);
        setData(demoBlogs.find((b) => b.slug === slug) || null);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [slug]);

  return { data, loading, error };
}

// ── Gallery ──────────────────────────────────────────────────

export function useGallery(): UseDataResult<GalleryImage> {
  const [data, setData] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData(demoGalleryImages);
      setLoading(false);
      return;
    }

    try {
      const { data: rows, error: err } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setData((rows as GalleryImage[]) || []);
    } catch (e: any) {
      setError(e.message);
      setData(demoGalleryImages);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ── Admin hooks (all items, including unpublished) ───────────

export function useAdminProducts(): UseDataResult<Product> {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows, error: err } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setData((rows as Product[]) || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useAdminBlogs(): UseDataResult<Blog> {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows, error: err } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setData((rows as Blog[]) || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useAdminSolutions(): UseDataResult<Solution> {
  const [data, setData] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows, error: err } = await supabase
        .from("solutions")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setData((rows as Solution[]) || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useAdminGallery(): UseDataResult<GalleryImage> {
  const [data, setData] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows, error: err } = await supabase
        .from("gallery_images")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setData((rows as GalleryImage[]) || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ── Hero Images ──────────────────────────────────────────────

export function useHeroImages(): UseDataResult<HeroImage> {
  const [data, setData] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      const { data: rows, error: err } = await supabase
        .from("hero_images")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setData((rows as HeroImage[]) || []);
    } catch (e: any) {
      setError(e.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useAdminHeroImages(): UseDataResult<HeroImage> {
  const [data, setData] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows, error: err } = await supabase
        .from("hero_images")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setData((rows as HeroImage[]) || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
