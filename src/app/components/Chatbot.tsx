import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CoreServiceCard } from "./CoreServiceCard";
import type { CoreService } from "../../lib/database.types";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  isProcessing?: boolean;
  showServices?: boolean;
  showSolutions?: boolean;
  showProducts?: boolean;
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are an AI personal assistant acting as a highly professional Sales Manager for Pacific Products & Solutions (B2B interior contracting).
Your tone MUST be warm, human-like, and professional. DO NOT write long paragraphs. Limit responses to 1-3 short sentences. You represent the company with pride.

Our core services: Restroom Cubicles, Exterior Cladding, Locker Systems, Wall Paneling.
Our industry solutions: Corporate Offices, Education, Healthcare, Airports, Retail.
Our products: Standard and customized cubicles, cladding panels, hardware, etc.

YOUR RULES:
1. If asked about "services" or "what you do", output EXACTLY: "[SHOW_SERVICES]" in your response.
2. If asked about "industries", "sectors", or "solutions", output EXACTLY: "[SHOW_SOLUTIONS]" in your response.
3. If asked about "products", "materials", or "items", output EXACTLY: "[SHOW_PRODUCTS]" in your response.
4. ONLY ask for the user's Name and Email/Phone number IF they explicitly ask for a quote, pricing, or want to be contacted. Do NOT ask for contact details during general questions.
5. Once they explicitly provide contact info, say thank you and append exactly "[LEAD_CAPTURED]" at the very end.

Example 1:
User: Do you have any products I can see?
You: Absolutely! As your personal sales manager, I'd love to show you our premium range. Here are our top products. [SHOW_PRODUCTS]

Example 2:
User: I need a quote.
You: I would be delighted to arrange a quote for you. Could you please share your name and email address so I can send the details?

Keep it human, polite, and brief.`;

const INITIAL_MESSAGE: Message = { 
  id: "msg-init", 
  sender: "bot", 
  text: "Hello! I am your AI personal assistant and Sales Manager here at Pacific Products & Solutions. How can I help you today?"
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [services, setServices] = useState<CoreService[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  // Initialize Gemini
  const genAI = useRef(GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null);
  const chatSession = useRef<any>(null);

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

  // Start new chat session
  const startChat = async () => {
    if (!genAI.current) return;
    try {
      const model = genAI.current.getGenerativeModel({ 
        model: "gemini-flash-latest",
        systemInstruction: SYSTEM_PROMPT 
      });
      chatSession.current = model.startChat({
        history: [],
      });
    } catch (err) {
      console.error("Failed to start Gemini chat:", err);
    }
  };

  useEffect(() => {
    startChat();
  }, []);

  const handleRestart = () => {
    setMessages([INITIAL_MESSAGE]);
    setInputValue("");
    startChat();
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

  const handleSendText = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");
    
    // Add user message
    const newUserMsg: Message = { id: `msg-${Date.now()}`, sender: "user", text: userText };
    setMessages(prev => [...prev, newUserMsg]);

    if (!chatSession.current) {
      setMessages(prev => [...prev, { 
        id: `msg-err-${Date.now()}`, 
        sender: "bot", 
        text: "I am currently offline. Please use the contact form." 
      }]);
      return;
    }

    setIsTyping(true);

    try {
      // Send message to Gemini
      const result = await chatSession.current.sendMessage(userText);
      let botResponse = result.response.text();
      let showServices = false;
      let showSolutions = false;
      let showProducts = false;

      // Intercept and strip tags
      if (botResponse.includes("[SHOW_SERVICES]")) {
        showServices = true;
        botResponse = botResponse.replace("[SHOW_SERVICES]", "").trim();
      }
      
      if (botResponse.includes("[SHOW_SOLUTIONS]")) {
        showSolutions = true;
        botResponse = botResponse.replace("[SHOW_SOLUTIONS]", "").trim();
      }

      if (botResponse.includes("[SHOW_PRODUCTS]")) {
        showProducts = true;
        botResponse = botResponse.replace("[SHOW_PRODUCTS]", "").trim();
      }

      if (botResponse.includes("[LEAD_CAPTURED]")) {
        botResponse = botResponse.replace("[LEAD_CAPTURED]", "").trim();
        const historyText = messages.map(m => m.text).join(" | ") + " | " + userText;
        await extractAndSaveLead(historyText);
      }

      setMessages(prev => [...prev, { 
        id: `msg-bot-${Date.now()}`, 
        sender: "bot", 
        text: botResponse,
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
                          href={`/products/${product.slug}`}
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
                  placeholder="Type a message..."
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
