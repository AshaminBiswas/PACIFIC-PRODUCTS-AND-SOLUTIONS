/**
 * Vercel Edge Function — NVIDIA NIM API proxy.
 *
 * Uses the Edge Runtime (standard Web APIs) so no external type packages
 * are required. Vercel auto-detects this via `export const config`.
 *
 * Why this exists:
 *   VITE_* env vars are bundled into client JS and visible to anyone who
 *   inspects the bundle. This proxy keeps NVIDIA_API_KEY server-side only.
 *
 * Route: /api/nvidia  (catches all sub-paths via vercel.json rewrite)
 */
export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  // Only POST is needed for NVIDIA chat completions
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "NVIDIA_API_KEY is not configured on the server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Forward the request body as-is to NVIDIA's API, injecting the key
  const body = await req.text();

  try {
    const upstream = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body,
      }
    );

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Upstream request failed", detail: err?.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
