import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Serverless proxy for the NVIDIA NIM API.
 *
 * Why this exists:
 *   VITE_* env vars are bundled into client JS and visible to anyone who
 *   inspects the bundle. Moving the key to a server-only env var (NVIDIA_API_KEY,
 *   no VITE_ prefix) and injecting it here keeps it completely out of the browser.
 *
 * Route: /api/nvidia (catches all sub-paths via vercel.json rewrite)
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // ── Security ──────────────────────────────────────────────────
  // Only allow POST (NVIDIA chat completions are always POST).
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "NVIDIA_API_KEY is not configured on the server." });
  }

  // ── Determine target path ─────────────────────────────────────
  // req.url will be something like /api/nvidia/v1/chat/completions
  // Strip the /api/nvidia prefix to get /v1/chat/completions
  const subPath = (req.url ?? "").replace(/^\/api\/nvidia/, "") || "/v1/chat/completions";
  const targetUrl = `https://integrate.api.nvidia.com${subPath}`;

  // ── Forward request ───────────────────────────────────────────
  try {
    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      // req.body is already parsed by Vercel as an object — re-stringify it
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err: any) {
    console.error("[NVIDIA proxy] upstream error:", err);
    return res.status(502).json({ error: "Upstream request failed", detail: err?.message });
  }
}
