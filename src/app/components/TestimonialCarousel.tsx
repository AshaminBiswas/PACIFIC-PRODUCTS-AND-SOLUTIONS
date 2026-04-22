"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, MessageSquarePlus } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

// ── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  name: string;
  role: string;
  company: string;
  initials: string;
  color: string;
  tag: string;
  stars: number;
  text: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const testimonials: Testimonial[] = [
  {
    name: "Rajiv Mehta",
    role: "Principal Architect",
    company: "RMD Architects",
    initials: "RM",
    color: "#7FB706",
    tag: "Architecture",
    stars: 5,
    text: "Exceptional craftsmanship on every project. Their marble work for our luxury residential project exceeded every expectation. The team's attention to detail is truly unmatched in the industry.",
  },
  {
    name: "Priya Nair",
    role: "Interior Designer",
    company: "Studio Nair",
    initials: "PN",
    color: "#2D9CDB",
    tag: "Interior Design",
    stars: 5,
    text: "Working with them was an absolute pleasure. The Italian marble selection they curated for my client's penthouse was breathtaking. Delivery was on time and quality was pristine.",
  },
  {
    name: "Aditya Sharma",
    role: "VP Construction",
    company: "Shapoorji Pallonji",
    initials: "AS",
    color: "#F2994A",
    tag: "Corporate",
    stars: 5,
    text: "We've partnered on 8 commercial projects across India. Their consistency and professionalism set the gold standard. From sourcing to installation support, they are simply the best.",
  },
  {
    name: "Kavitha Reddy",
    role: "Project Manager",
    company: "Prestige Group",
    initials: "KR",
    color: "#9B51E0",
    tag: "Real Estate",
    stars: 5,
    text: "The granite flooring they supplied for our 200-unit township project was flawless. Their bulk pricing and quality assurance gave us complete peace of mind throughout the project lifecycle.",
  },
  {
    name: "Suresh Balasubramanian",
    role: "Managing Director",
    company: "SBL Developers",
    initials: "SB",
    color: "#EB5757",
    tag: "Development",
    stars: 5,
    text: "Incredible range of stone options. Found the exact finish we needed for our heritage-inspired hotel lobby. Their team guided us at every step — from design to final polish. Highly recommended.",
  },
];

// ── Mobile hook (safe for SSR) ────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill={i < count ? "#F59E0B" : "#D1D5DB"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ── Card State Helper ─────────────────────────────────────────────────────────

type CardState = "active" | "prev" | "next" | "far-prev" | "far-next" | "hidden";

function getCardState(index: number, current: number, total: number): CardState {
  const diff = (index - current + total) % total;
  if (diff === 0) return "active";
  if (diff === 1) return "next";
  if (diff === total - 1) return "prev";
  if (diff === 2) return "far-next";
  if (diff === total - 2) return "far-prev";
  return "hidden";
}

// ── Card Variants (Framer Motion) ─────────────────────────────────────────────

function getCardVariants(mobile: boolean) {
  return {
    active: {
      x: "-50%",
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: 10,
      transition: { type: "spring" as const, stiffness: 260, damping: 26 },
    },
    prev: {
      x: mobile ? "-50%" : "calc(-50% - 260px)",
      y: mobile ? 16 : 20,
      scale: 0.92,
      rotate: mobile ? 0 : -3,
      opacity: mobile ? 0.3 : 0.55,
      zIndex: 5,
      transition: { type: "spring" as const, stiffness: 260, damping: 26 },
    },
    next: {
      x: mobile ? "-50%" : "calc(-50% + 260px)",
      y: mobile ? 16 : 20,
      scale: 0.92,
      rotate: mobile ? 0 : 3,
      opacity: mobile ? 0.3 : 0.55,
      zIndex: 5,
      transition: { type: "spring" as const, stiffness: 260, damping: 26 },
    },
    "far-prev": {
      x: mobile ? "-50%" : "calc(-50% - 420px)",
      y: mobile ? 28 : 40,
      scale: 0.84,
      rotate: mobile ? 0 : -6,
      opacity: mobile ? 0.1 : 0.2,
      zIndex: 1,
      transition: { type: "spring" as const, stiffness: 260, damping: 26 },
    },
    "far-next": {
      x: mobile ? "-50%" : "calc(-50% + 420px)",
      y: mobile ? 28 : 40,
      scale: 0.84,
      rotate: mobile ? 0 : 6,
      opacity: mobile ? 0.1 : 0.2,
      zIndex: 1,
      transition: { type: "spring" as const, stiffness: 260, damping: 26 },
    },
    hidden: {
      x: "-50%",
      scale: 0.7,
      opacity: 0,
      zIndex: 0,
      transition: { type: "spring" as const, stiffness: 260, damping: 26 },
    },
  };
}

// ── Single Card ───────────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  state,
  onClick,
  isMobile,
}: {
  testimonial: Testimonial;
  state: CardState;
  onClick: () => void;
  isMobile: boolean;
}) {
  const isActive = state === "active";
  // FIX: variants are computed from reactive isMobile prop, not a stale window read
  const variants = getCardVariants(isMobile);

  return (
    <motion.div
      className="absolute top-0 left-1/2 w-[min(520px,90vw)] md:w-[420px] cursor-pointer select-none"
      style={{ originX: "50%", originY: "50%" }}
      variants={variants}
      animate={state}
      initial={false}
      onClick={onClick}
      tabIndex={isActive ? 0 : -1}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      whileHover={
        isActive
          ? {
              y: -8,
              scale: 1.015,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
          : {}
      }
    >
      {/* Card surface */}
      <div
        className="relative rounded-2xl p-7 bg-white dark:bg-[#0a0a1a] border border-[#7FB706]/15 dark:border-white/10 overflow-hidden transition-colors"
        style={{
          boxShadow: isActive
            ? "0 24px 60px rgba(127,183,6,0.18), 0 8px 24px rgba(0,0,0,0.08)"
            : "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Green accent bar (slides in when active) */}
        <motion.div
          className="absolute top-0 left-8 right-8 h-[3px] rounded-b-sm"
          style={{
            background: "linear-gradient(90deg, #7FB706, #B5F823)",
            transformOrigin: "left",
          }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.4, delay: isActive ? 0.15 : 0 }}
        />

        {/* Quote mark */}
        <span
          className="block font-serif text-6xl leading-none text-[#7FB706] opacity-25 -mb-2"
          aria-hidden
        >
          "
        </span>

        <StarRating count={testimonial.stars} />

        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 italic mb-6">
          {testimonial.text}
        </p>

        {/* Reviewer footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#7FB706]/10">
          {/* Avatar with hover spin */}
          <motion.div
            className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
            style={{ background: testimonial.color }}
            whileHover={isActive ? { scale: 1.12, rotate: -8 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            {testimonial.initials}
          </motion.div>

          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate transition-colors">
              {testimonial.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors">
              {testimonial.role} · {testimonial.company}
            </p>
          </div>

          {/* Tag pill */}
          <span className="ml-auto shrink-0 bg-[#7FB706]/10 text-[#5a8500] text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
            {testimonial.tag}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Nav Button ────────────────────────────────────────────────────────────────

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous review" : "Next review"}
      className="w-13 h-13 rounded-full bg-white dark:bg-[#0a0a1a] border border-[#7FB706]/30 dark:border-white/10 flex items-center justify-center text-[#5a8500] dark:text-[#7FB706] shadow-sm transition-colors"
      style={{ width: 52, height: 52 }}
      whileHover={{
        scale: 1.12,
        backgroundColor: "#7FB706",
        color: "#ffffff",
        borderColor: "#7FB706",
        boxShadow: "0 6px 20px rgba(127,183,6,0.38)",
      }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "prev" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </motion.button>
  );
}

// ── Dot Indicator ─────────────────────────────────────────────────────────────

function DotIndicator({
  count,
  current,
  onSelect,
}: {
  count: number;
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to review ${i + 1}`}
          className="h-2 rounded-full bg-[#7FB706]/25"
          animate={{ width: i === current ? 28 : 8, opacity: i === current ? 1 : 0.5 }}
          whileHover={{ opacity: 0.85, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          style={{ backgroundColor: i === current ? "#7FB706" : undefined }}
        />
      ))}
    </div>
  );
}

// ── Feedback Form ─────────────────────────────────────────────────────────────

function InteractiveStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < (hovered || value);
        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            aria-label={`Rate ${i + 1} star${i !== 0 ? "s" : ""}`}
            className="focus:outline-none"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 transition-colors duration-150"
              fill={filled ? "#F59E0B" : "none"}
              stroke={filled ? "#F59E0B" : "#9CA3AF"}
              strokeWidth={1.5}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}

function FeedbackForm() {
  const [formData, setFormData] = useState({ name: "", company: "", message: "" });
  const [stars, setStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#030213] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#7FB706] focus:ring-1 focus:ring-[#7FB706] transition-colors text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) { setError("Please select a star rating before submitting."); return; }
    setSubmitting(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const { error: dbError } = await supabase.from("feedback").insert([{
          name: formData.name,
          company: formData.company || null,
          stars,
          message: formData.message,
        }]);
        if (dbError) console.error("Feedback insert error:", dbError);
      } else {
        console.warn("Supabase not configured — feedback not saved.");
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", company: "", message: "" });
        setStars(0);
      }, 4000);
    } catch (err: any) {
      console.error("Feedback error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mt-16 sm:mt-20 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 bg-[#7FB706]/10 border border-[#7FB706]/20 text-[#7FB706] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
          <MessageSquarePlus className="w-3.5 h-3.5" />
          Share Your Experience
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-[#030213] dark:text-white transition-colors">
          Leave a Review
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your feedback helps us serve you better.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center py-6 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#7FB706] flex items-center justify-center shadow-lg shadow-[#7FB706]/25">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#030213] dark:text-white">Thank you!</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your review has been submitted successfully.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Your Rating *
                </label>
                <InteractiveStars value={stars} onChange={setStars} />
              </div>

              {/* Name + Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fb-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="fb-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="fb-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Company <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="fb-company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Your Company"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="fb-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Your Review *
                </label>
                <textarea
                  id="fb-message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                  placeholder="Tell us about your experience with Pacific Products & Solutions..."
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3.5 text-red-600 dark:text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.02, boxShadow: "0 8px 28px rgba(127,183,6,0.35)" } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full py-3.5 rounded-xl bg-[#7FB706] hover:bg-[#6fa005] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main Carousel ─────────────────────────────────────────────────────────────

// FIX: changed from `export default` to named export to match the import in Home.tsx
export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMobile = useIsMobile();

  // Drag / swipe state
  const dragStartX = useRef(0);

  const goTo = useCallback(
    (idx: number) => setCurrent(((idx % total) + total) % total),
    [total]
  );

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // FIX: use functional updater `(prev) => ...` to avoid the stale closure bug
  // where the interval always advanced from the same captured `current` value.
  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4500);
  }, [total, stopTimer]);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [current, startTimer, stopTimer]);

  // Touch / mouse drag handlers
  const handleDragStart = (clientX: number) => {
    dragStartX.current = clientX;
  };

  const handleDragEnd = (clientX: number) => {
    const diff = dragStartX.current - clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden transition-colors">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E9FDBF] via-white to-[#E9FDBF] dark:from-[#0a0a1a] dark:via-[#030213] dark:to-[#0a0a1a] transition-colors" />
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#7FB706] rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#B5F823] rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#7FB706]/10 border border-[#7FB706]/20 text-[#7FB706] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7FB706] inline-block" />
            Client Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-3 transition-colors">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto transition-colors">
            Trusted by architects, builders, and corporate clients across India
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative w-full"
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseUp={(e) => handleDragEnd(e.clientX)}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        >
          {/* Cards track */}
          <div className="relative w-full h-[300px] md:h-[320px]">
            {testimonials.map((t, i) => {
              const state = getCardState(i, current, total);
              return (
                <TestimonialCard
                  key={t.name}
                  testimonial={t}
                  state={state}
                  isMobile={isMobile}
                  onClick={() => {
                    if (i !== current) goTo(i);
                  }}
                />
              );
            })}
          </div>

          {/* Desktop-only nav buttons */}
          <div className="hidden md:flex justify-center gap-3 mt-6">
            <NavButton direction="prev" onClick={() => goTo(current - 1)} />
            <NavButton direction="next" onClick={() => goTo(current + 1)} />
          </div>

          {/* Dots (all screen sizes) */}
          <DotIndicator count={total} current={current} onSelect={goTo} />
        </div>

        {/* Feedback Form */}
        <FeedbackForm />
      </div>
    </section>
  );
}