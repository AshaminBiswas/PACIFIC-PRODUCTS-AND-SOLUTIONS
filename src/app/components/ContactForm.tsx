import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ContactFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function ContactForm({ onClose, isModal = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    requirement: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        requirement: "",
        message: "",
      });
      if (onClose) onClose();
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isModal && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-[#030213]">Get a Quote</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm mb-2 text-[#030213]">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7FB706] focus:border-transparent bg-white"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm mb-2 text-[#030213]">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7FB706] focus:border-transparent bg-white"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm mb-2 text-[#030213]">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7FB706] focus:border-transparent bg-white"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm mb-2 text-[#030213]">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7FB706] focus:border-transparent bg-white"
            placeholder="Your Company"
          />
        </div>
      </div>

      <div>
        <label htmlFor="requirement" className="block text-sm mb-2 text-[#030213]">
          Product/Service Required
        </label>
        <select
          id="requirement"
          name="requirement"
          value={formData.requirement}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7FB706] focus:border-transparent bg-white"
        >
          <option value="">Select a product/service</option>
          <option value="restroom-cubicles">Restroom Cubicles</option>
          <option value="toilet-partitions">Toilet Partitions</option>
          <option value="exterior-cladding">Exterior Cladding</option>
          <option value="interior-paneling">Interior Paneling</option>
          <option value="cubicle-hardware">Cubicle Hardware</option>
          <option value="acrylic-surface">Acrylic Solid Surface</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm mb-2 text-[#030213]">
          Project Details
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7FB706] focus:border-transparent resize-none bg-white"
          placeholder="Tell us about your project requirements..."
        />
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#E9FDBF] border border-[#7FB706] rounded-xl p-6 text-center"
        >
          <div className="w-16 h-16 bg-[#7FB706] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-[#030213] mb-2">Thank You!</h4>
          <p className="text-gray-600">We'll get back to you within 24 hours.</p>
        </motion.div>
      ) : (
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </Button>
      )}
    </form>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {formContent}
        </motion.div>
      </motion.div>
    );
  }

  return <div className="bg-white rounded-2xl p-8 shadow-lg">{formContent}</div>;
}
