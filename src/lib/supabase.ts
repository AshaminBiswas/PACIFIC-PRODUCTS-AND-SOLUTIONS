import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in your .env file.\n" +
    "The app will run with demo data until credentials are provided."
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

/**
 * Check whether Supabase is properly configured.
 * Returns false when env vars are missing so the app can fall back to demo data.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// ── Storage helpers ───────────────────────────────────────────
const BUCKET = "uploads";

export async function uploadImage(
  file: File,
  folder: string = "images"
): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<boolean> {
  // Extract path from full URL
  const pathMatch = url.match(new RegExp(`${BUCKET}/(.+)$`));
  if (!pathMatch) return false;

  const { error } = await supabase.storage.from(BUCKET).remove([pathMatch[1]]);
  return !error;
}
