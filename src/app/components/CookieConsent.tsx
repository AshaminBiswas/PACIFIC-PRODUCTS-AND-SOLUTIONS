import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Loader2, CheckCircle2, Cookie } from "lucide-react";
import { Link } from "react-router";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const CONSENT_KEY = "pacific_cookie_v2";

// ── Device helpers ────────────────────────────────────────────────────────────

function detectBrowser(ua: string) {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "Unknown";
}
function detectOS(ua: string) {
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}
function detectDevice(ua: string) {
  if (/Mobile|iPhone|Android(?!.*Tablet)/.test(ua)) return "Mobile";
  if (/Tablet|iPad/.test(ua)) return "Tablet";
  return "Desktop";
}

// ── Save to Supabase ──────────────────────────────────────────────────────────

async function saveLead(payload: { consent_given: boolean; email?: string }) {
  if (!isSupabaseConfigured()) return;
  const ua = navigator.userAgent;

  let geo: Record<string, string | null> = {};
  if (payload.consent_given) {
    try {
      const r = await fetch("https://ipapi.co/json/", {
        signal: AbortSignal.timeout(5000),
      });
      if (r.ok) {
        const d = await r.json();
        geo = {
          ip_address: d.ip ?? null,
          country: d.country_name ?? null,
          city: d.city ?? null,
          region: d.region ?? null,
        };
      }
    } catch { /* silent */ }
  }

  try {
    await (supabase as any).from("visitor_leads").insert([{
      ...geo,
      email: payload.email?.trim() || null,
      device_type: detectDevice(ua),
      browser: detectBrowser(ua),
      os: detectOS(ua),
      screen_resolution: `${window.screen.width}×${window.screen.height}`,
      referrer: document.referrer || null,
      consent_given: payload.consent_given,
    }]);
  } catch { /* silent */ }
}

// ── Main Component ────────────────────────────────────────────────────────────

type Step = "consent" | "newsletter" | "done";

export default function CookieConsent() {
  const [step, setStep] = useState<Step | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [saving, setSaving] = useState(false);
  const declineCount = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      const t = setTimeout(() => setStep("consent"), 1600);
      return () => clearTimeout(t);
    }
  }, []);

  // Clean up retry timer on unmount
  useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  const handleDecline = () => {
    // Don't persist to localStorage — popup returns after a delay
    saveLead({ consent_given: false });
    setStep(null);
    declineCount.current += 1;
    // Delay increases slightly each time: 30s → 45s → 60s (cap)
    const delay = Math.min(30_000 + (declineCount.current - 1) * 15_000, 60_000);
    retryTimer.current = setTimeout(() => setStep("consent"), delay);
  };

  const handleAccept = () => {
    saveLead({ consent_given: true });
    setStep("newsletter");
  };

  const validateEmail = (v: string) =>
    !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubscribe = async (skip = false) => {
    if (!skip && !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setSaving(true);
    if (!skip && email.trim()) {
      await saveLead({ consent_given: true, email: email.trim() });
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ consent: true, ts: Date.now() }));
    setSaving(false);
    setStep("done");
    setTimeout(() => setStep(null), 2200);
  };

  return (
    <AnimatePresence mode="wait">
      {step && (
        <motion.div
          key={step}
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="fixed bottom-6 left-4 z-[9998] w-[calc(100%-2rem)] max-w-sm"
        >

          {/* ── Step 1: Cookie Consent ── */}
          {step === "consent" && (
            <div className="rounded-2xl bg-white dark:bg-[#0d0d1f] border border-gray-200 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-hidden">
              {/* Accent bar */}
              <div className="h-[3px] bg-gradient-to-r from-[#7FB706] to-[#B5F823]" />

              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <Cookie className="w-5 h-5 text-[#7FB706] flex-shrink-0" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Cookie Preferences
                    </h3>
                  </div>
                  <button
                    onClick={handleDecline}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed mb-4">
                  We use cookies and similar technologies to improve your browsing experience, analyse site traffic, and personalise content. By clicking{" "}
                  <strong className="text-gray-800 dark:text-gray-200 font-semibold">"Accept All"</strong>, you consent to our use of cookies as described in our{" "}
                  <Link
                    to="/privacy"
                    className="text-[#7FB706] hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/terms"
                    className="text-[#7FB706] hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>
                  .
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={handleDecline}
                    className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 text-xs font-medium transition-all"
                  >
                    Decline
                  </button>
                  <motion.button
                    onClick={handleAccept}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-[1.8] py-2 rounded-lg bg-[#7FB706] hover:bg-[#6fa005] text-white text-xs font-semibold transition-colors shadow-md shadow-[#7FB706]/20"
                  >
                    Accept All
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Newsletter Signup ── */}
          {step === "newsletter" && (
            <div className="rounded-2xl bg-white dark:bg-[#0d0d1f] border border-gray-200 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-hidden">
              <div className="h-[3px] bg-gradient-to-r from-[#7FB706] to-[#B5F823]" />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                    Stay ahead of the curve 🚀
                  </h3>
                  <button
                    onClick={() => handleSubscribe(true)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                    aria-label="Skip"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4">
                  Get our latest product launches, project showcases, and industry insights delivered to your inbox. No spam — unsubscribe anytime.
                </p>

                {/* Email input */}
                <div className="mb-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe(false)}
                    placeholder="Enter your email address"
                    className={`w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border ${
                      emailError
                        ? "border-red-400"
                        : "border-gray-200 dark:border-white/10 focus:border-[#7FB706]"
                    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#7FB706]/30 transition-all`}
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1">{emailError}</p>
                  )}
                </div>

                <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-3">
                  By subscribing you agree to receive marketing emails from Pacific Products &amp; Solutions.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubscribe(true)}
                    disabled={saving}
                    className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs font-medium transition-all disabled:opacity-50"
                  >
                    Maybe later
                  </button>
                  <motion.button
                    onClick={() => handleSubscribe(false)}
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-[1.8] flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#7FB706] hover:bg-[#6fa005] disabled:opacity-60 text-white text-xs font-semibold transition-colors shadow-md shadow-[#7FB706]/20"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        Subscribe
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Success ── */}
          {step === "done" && (
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl bg-white dark:bg-[#0d0d1f] border border-[#7FB706]/30 shadow-xl overflow-hidden"
            >
              <div className="h-[3px] bg-gradient-to-r from-[#7FB706] to-[#B5F823]" />
              <div className="p-5 flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, delay: 0.08 }}
                  className="w-9 h-9 bg-[#7FB706] rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">You're all set!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thanks for subscribing. We'll keep you in the loop.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
