import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, RefreshCw, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { CoreServiceCard } from "./CoreServiceCard";
import type { CoreService } from "../../lib/database.types";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  reasoning?: string;
  isProcessing?: boolean;
  showServices?: boolean;
  showSolutions?: boolean;
  showProducts?: boolean;
};

const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY || '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';

const SYSTEM_PROMPT = `You are Aria — an elite, senior B2B Sales Consultant representing Pacific Products & Solutions, a premier interior infrastructure company specialising in commercial restroom cubicles, exterior cladding, locker systems, and wall panelling across India and the UAE.

## YOUR PERSONA
- Name: Aria, Senior Sales Consultant at Pacific Products & Solutions
- Tone: Executive, warm, precise, and consultative — like a seasoned business development professional
- Style: Concise, confident, and intelligent. Never robotic. Never over-enthusiastic.
- Limit every response to 2–4 short, well-structured sentences unless a list is clearly more helpful.
- Never use filler phrases like "Great question!" or "Absolutely!" — respond with substance.
- Use markdown bold (**text**) sparingly for key product names or features only.
- Always sound like you deeply understand the client's project requirements.

## COMPANY OVERVIEW
Pacific Products & Solutions is a trusted B2B infrastructure partner for large-scale commercial projects. We deliver end-to-end solutions from specification to installation, with a focus on durability, precision engineering, and premium aesthetics.

**Core Service Lines:**
- **Restroom Cubicle Systems** — Compact laminate, phenolic, powder-coated steel, and stainless steel partitions. Designed for high-traffic environments with anti-vandal hardware and concealed fixings.
- **Exterior Cladding** — ACM (Aluminium Composite Material), HPL, and natural stone cladding systems engineered for India's climate. Full fabrication and installation support.
- **Locker Systems** — Metal, phenolic, and laminate lockers for gyms, corporate offices, schools, hospitals, and sports facilities. Available in single, double, and multi-tier configurations.
- **Wall Panelling & Interior Finishes** — Decorative HPL wall panels, acoustic panels, and bespoke interior cladding for corporate and hospitality interiors.

**Industry Verticals:**
- Airports & Transit Hubs (high-traffic, stringent hygiene standards)
- Corporate & IT Campuses (premium aesthetics, fast-track delivery)
- Healthcare & Hospitals (anti-microbial surfaces, privacy compliance)
- Education Institutions (durable, low-maintenance systems)
- Retail & Shopping Malls (brand-aligned finishes)
- Hospitality & Hotels (luxury-grade specifications)
- Sports Stadiums & Gyms (robust, heavy-duty configurations)
- Industrial & Manufacturing Facilities

**Operational Locations:**
Delhi NCR, Mumbai, Bangalore, Ahmedabad, Kolkata, and UAE (Dubai/Gulf region)

**Key Differentiators:**
- In-house manufacturing with ISO quality documentation
- Dedicated project managers for each engagement
- Site measurement, BOQ preparation, and installation by certified teams
- Fast lead times with pan-India logistics
- Full compliance documentation for tenders and government projects

## INTELLIGENT SALES BEHAVIOUR
- If the user mentions a project type (e.g., hospital, airport, school), proactively reference relevant product specifications for that sector.
- If the user asks about pricing or budget, acknowledge that pricing depends on specifications, quantity, material grade, and location — and invite them to share project details.
- If the user mentions a city or region, reference the relevant Pacific office or team.
- If the user asks about timelines, mention that standard lead times range from 2–6 weeks depending on scope.
- If the user asks about materials, explain the options and their respective advantages briefly.
- If the user seems ready to proceed, guide them naturally toward providing contact details.
- If the user expresses doubt or asks for comparisons, address concerns with confidence and evidence of expertise.
- Handle objections professionally — never be defensive. Focus on value, reliability, and partnership.

## STRICT BEHAVIOURAL RULES
1. If asked about "services" or "what you offer" or "what do you do", include EXACTLY: [SHOW_SERVICES] in your response.
2. If asked about "industries", "sectors", "solutions", or "who do you serve", include EXACTLY: [SHOW_SOLUTIONS] in your response.
3. If asked about "products", "materials", "items", "range", or "catalogue", include EXACTLY: [SHOW_PRODUCTS] in your response.
4. ONLY request the user's name and contact (email or phone) if they explicitly ask for a quote, pricing, site visit, or wish to be contacted. Never ask for contact details during general conversation.
5. Once the user provides contact information (name + email or phone), acknowledge professionally and append EXACTLY: [LEAD_CAPTURED] at the very end of your response.
6. Never fabricate specific pricing figures, project references by name, or certification numbers.
7. If you do not know something, say: "I'll have a specialist follow up with the precise details — could I take your contact information?"

## EXAMPLE INTERACTIONS

User: "We're building a 500-bed hospital in Pune. What cubicle systems do you recommend?"
Aria: "For a healthcare environment of that scale, we'd recommend **phenolic compact laminate** cubicles — they're inherently anti-microbial, waterproof, and compliant with hospital hygiene standards. We can also integrate concealed anti-ligature hardware if required. Would you like me to arrange a specification consultation with our technical team?"

User: "What's the price for locker systems?"
Aria: "Pricing varies based on configuration (single-tier, multi-tier), material (metal, HPL, phenolic), quantity, and delivery location. Could you share the approximate number of lockers needed and the project city? That'll allow me to provide a meaningful estimate."

User: "How long does installation take?"
Aria: "For most commercial projects, our standard lead time from order confirmation is 3–6 weeks, covering fabrication, quality checks, logistics, and installation. Complex or large-scale sites may require a dedicated project timeline — we can prepare one as part of your BOQ."

User: "I want a quote."
Aria: "I'd be glad to prepare a detailed quotation for you. Could you share your name, contact number or email, and a brief overview of your project requirements?"`;

const INITIAL_MESSAGE: Message = { 
  id: "msg-init", 
  sender: "bot", 
  text: "Good day. I'm Aria, your dedicated Sales Consultant at Pacific Products & Solutions. Whether you're specifying cubicle systems, cladding, or locker solutions for a commercial project — I'm here to help. What can I assist you with today?"
};

function ThinkingBlock({ reasoning }: { reasoning: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="w-full pl-8 pr-2 mb-2">
      <div className="border border-gray-200/50 dark:border-white/5 rounded-xl bg-gray-50/50 dark:bg-[#030213]/20 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-purple-400 dark:text-purple-300 animate-pulse" />
            <span>Aria's Thought Process</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pt-1 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 whitespace-pre-line border-t border-gray-200/30 dark:border-white/5 font-mono max-h-[150px] overflow-y-auto custom-scrollbar italic">
                {reasoning}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// We will use standard fetch to communicate with Gemini REST API directly

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [services, setServices] = useState<CoreService[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      if (isSupabaseConfigured()) {
        const [servicesRes, solutionsRes, productsRes] = await Promise.all([
          supabase.from('core_services').select('*').order('sort_order', { ascending: true }),
          supabase.from('solutions').select('*').order('sort_order', { ascending: true }),
          supabase.from('products').select('*').order('sort_order', { ascending: true })
        ]);
        
        if (servicesRes.data) setServices(servicesRes.data);
        if (solutionsRes.data) setSolutions(solutionsRes.data);
        if (productsRes.data) setProducts(productsRes.data);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const startChat = async () => {
    // No-op - REST API doesn't need start chat initialization
  };

  useEffect(() => {
    startChat();
  }, []);

  const handleRestart = () => {
    setMessages([INITIAL_MESSAGE]);
    setInputValue("");
  };

  // Extract email or phone from chat history to save lead
  const extractAndSaveLead = async (fullHistory: string) => {
    if (!isSupabaseConfigured()) return;
    const emailMatch = fullHistory.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
    const email = emailMatch ? emailMatch[1] : "N/A";
    
    try {
      await supabase.from('contact_queries').insert([{
        name: "AI Chatbot Lead",
        email: email,
        phone: email === "N/A" ? "Provided in Chat" : "N/A",
        requirement: "AI Guided Inquiry",
        message: "Contact captured via AI. Review chat logs if available.",
        company: null
      }]);
    } catch (e) {
      console.error("Error saving lead from AI:", e);
    }
  };

  const callNvidiaAPI = async (chatHistory: Message[], newText: string) => {
    if (!NVIDIA_API_KEY) throw new Error("API Key not found");

    // Format chat history for NVIDIA REST API (OpenAI-compatible)
    const messagesPayload: any[] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];
    
    chatHistory.forEach(m => {
      if (m.id === "msg-init") return; // Skip initial greetings to start with a user role
      if (!m.text) return;
      messagesPayload.push({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text
      });
    });

    // Add current user message
    messagesPayload.push({
      role: "user",
      content: newText
    });

    const response = await fetch(
      "/api/nvidia/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
          messages: messagesPayload,
          temperature: 0.6,
          top_p: 0.95,
          max_tokens: 65536,
          reasoning_budget: 16384,
          chat_template_kwargs: { enable_thinking: true }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API call failed: ${errText}`);
    }

    const data = await response.json();
    const botText = data.choices?.[0]?.message?.content;
    const botReasoning = data.choices?.[0]?.message?.reasoning_content;
    if (!botText) {
      throw new Error("No response content returned from NVIDIA API");
    }
    return { text: botText, reasoning: botReasoning };
  };

  const handleSendText = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");
    
    // Add user message
    const newUserMsg: Message = { id: `msg-${Date.now()}`, sender: "user", text: userText };
    setMessages(prev => [...prev, newUserMsg]);

    if (!NVIDIA_API_KEY) {
      setMessages(prev => [...prev, { 
        id: `msg-err-${Date.now()}`, 
        sender: "bot", 
        text: "I am currently offline. Please use the contact form." 
      }]);
      return;
    }

    setIsTyping(true);

    try {
      // Send message to NVIDIA API via Local/Vercel proxy
      const { text: botResponse, reasoning: botReasoning } = await callNvidiaAPI(messages, userText);
      let cleanResponse = botResponse;
      let showServices = false;
      let showSolutions = false;
      let showProducts = false;

      // Intercept and strip tags
      if (cleanResponse.includes("[SHOW_SERVICES]")) {
        showServices = true;
        cleanResponse = cleanResponse.replace("[SHOW_SERVICES]", "").trim();
      }
      
      if (cleanResponse.includes("[SHOW_SOLUTIONS]")) {
        showSolutions = true;
        cleanResponse = cleanResponse.replace("[SHOW_SOLUTIONS]", "").trim();
      }

      if (cleanResponse.includes("[SHOW_PRODUCTS]")) {
        showProducts = true;
        cleanResponse = cleanResponse.replace("[SHOW_PRODUCTS]", "").trim();
      }

      if (cleanResponse.includes("[LEAD_CAPTURED]")) {
        cleanResponse = cleanResponse.replace("[LEAD_CAPTURED]", "").trim();
        const historyText = messages.map(m => m.text).join(" | ") + " | " + userText;
        await extractAndSaveLead(historyText);
      }

      setMessages(prev => [...prev, { 
        id: `msg-bot-${Date.now()}`, 
        sender: "bot", 
        text: cleanResponse,
        reasoning: botReasoning,
        showServices,
        showSolutions,
        showProducts
      }]);
    } catch (error) {
      console.error("AI Chat error:", error);
      setMessages(prev => [...prev, { 
        id: `msg-err-${Date.now()}`, 
        sender: "bot", 
        text: "I am experiencing network issues. Please try again." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendText();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-[340px] sm:w-[420px] h-[550px] mb-4 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#030213] text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#7FB706] rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Pacific AI Assistant</h3>
                  <p className="text-[#B5F823] text-[11px] flex items-center gap-1 font-medium tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7FB706] animate-pulse shadow-[0_0_8px_rgba(127,183,6,0.8)]"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleRestart} title="Restart Chat" className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-[#030213]/50 space-y-5 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  {msg.sender === "bot" && msg.reasoning && (
                    <ThinkingBlock reasoning={msg.reasoning} />
                  )}
                  <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "bot" && (
                       <div className="w-6 h-6 rounded-full bg-[#030213] flex-shrink-0 flex items-center justify-center mr-2 self-end mb-1">
                         <Bot className="w-3.5 h-3.5 text-[#B5F823]" />
                       </div>
                    )}
                    {msg.text && (
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                        msg.sender === "user" 
                          ? "bg-[#7FB706] text-white rounded-br-none" 
                          : "bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-bl-none"
                      }`}>
                        <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                      </div>
                    )}
                  </div>

                  {/* Render Services Inline */}
                  {msg.showServices && services.length > 0 && (
                    <div className="w-full overflow-x-auto flex gap-3 pb-2 pt-1 pl-8 snap-x snap-mandatory scrollbar-hide">
                      {services.map((service, idx) => (
                        <div key={service.id} className="w-[200px] h-[220px] shrink-0 snap-center">
                          <CoreServiceCard service={service} index={idx} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Solutions Inline */}
                  {msg.showSolutions && solutions.length > 0 && (
                    <div className="w-full overflow-x-auto flex gap-3 pb-2 pt-1 pl-8 snap-x snap-mandatory scrollbar-hide">
                      {solutions.map((solution) => (
                        <a 
                          key={solution.id} 
                          href={`/solutions/${solution.slug}`}
                          className="relative w-[180px] h-[140px] shrink-0 snap-center rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm group block bg-[#030213]"
                        >
                           <img src={solution.image_url} alt={solution.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                           <div className="absolute bottom-3 left-4 right-4 text-white text-[13px] font-bold leading-tight group-hover:text-[#B5F823] transition-colors">
                             {solution.title}
                           </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Render Products Inline */}
                  {msg.showProducts && products.length > 0 && (
                    <div className="w-full overflow-x-auto flex gap-3 pb-2 pt-1 pl-8 snap-x snap-mandatory scrollbar-hide">
                      {products.map((product) => (
                        <a 
                          key={product.id} 
                          href={(() => {
                            const catSlug = product.category
                              ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                              : "";
                            return catSlug ? `/products/${catSlug}/${product.slug}` : `/products/${product.slug}`;
                          })()}
                          className="relative w-[180px] h-[140px] shrink-0 snap-center rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm group block bg-white dark:bg-[#030213]"
                        >
                           <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                           <div className="absolute bottom-3 left-4 right-4 text-white text-[13px] font-bold leading-tight drop-shadow-md">
                             {product.title}
                           </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start space-y-3">
                  <div className="w-6 h-6 rounded-full bg-[#030213] flex-shrink-0 flex items-center justify-center mr-2 self-end mb-1">
                    <Bot className="w-3.5 h-3.5 text-[#B5F823]" />
                  </div>
                  <div className="bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                    <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0a0a1a] shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products, services, or your project..."
                  autoFocus
                  disabled={isTyping}
                  className="flex-1 bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white focus:border-[#7FB706] focus:ring-1 focus:ring-[#7FB706] dark:text-white rounded-full px-4 py-2.5 text-sm outline-none transition-all disabled:opacity-50"
                />
                <button 
                  onClick={handleSendText}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 rounded-full bg-[#7FB706] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6fa005] transition-colors shrink-0 shadow-md shadow-[#7FB706]/20"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#7FB706] text-white rounded-full shadow-xl shadow-[#7FB706]/40 hover:bg-[#6fa005] hover:scale-105 transition-all flex items-center justify-center group relative"
          aria-label="Open Chat"
        >
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-[#030213]"></span>
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}
