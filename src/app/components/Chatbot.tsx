import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  isProcessing?: boolean;
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a friendly, professional sales assistant for Pacific Products & Solutions. 
We are India's leading B2B interior contracting company.
Our core services are: Restroom Cubicles, Toilet Partitions, Exterior Cladding, Interior Wall Paneling, Locker Systems, and Cubicle Hardware.
Our industry solutions include: Corporate Offices, Education, Healthcare, Airports & Metro, Retail & Malls, and Sports & Leisure.
Our USP: 12+ years experience, ISO-certified manufacturing, pan-India installation, highly durable and waterproof materials (like Compact Density Laminate), and premium aesthetics.

YOUR GOAL: 
1. Answer the user's questions about our products and services accurately and concisely.
2. Guide them towards requesting a quote or catalog.
3. ALWAYS ask for their Name and Email (or Phone Number) so our sales team can contact them.

CRITICAL INSTRUCTION:
Once the user provides their contact information (an email address or phone number) AND their name, thank them, and append exactly the string "[LEAD_CAPTURED]" at the very end of your response. This acts as a trigger for our system to save their lead. Do NOT use "[LEAD_CAPTURED]" until they have provided contact info.

Keep your responses short, conversational, and helpful.`;

const INITIAL_MESSAGE: Message = { 
  id: "msg-init", 
  sender: "bot", 
  text: "Hi there! 👋 Welcome to Pacific Products & Solutions. I'm your AI assistant. How can I help you today?"
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Initialize Gemini
  const genAI = useRef(GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null);
  const chatSession = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    
    // Simple regex to find emails in the user's recent messages
    const emailMatch = fullHistory.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
    const email = emailMatch ? emailMatch[1] : "N/A";
    
    try {
      await supabase.from('contact_queries').insert([{
        name: "AI Chatbot User", // AI could be prompted to return JSON, but for simplicity we use a generic name
        email: email,
        phone: email === "N/A" ? "Provided in Chat" : "N/A",
        requirement: "General Inquiry (AI Chat)",
        message: "Full Chat History captured. User provided contact info.",
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
        text: "I'm sorry, my AI connection is not configured correctly. Please contact us via the form or WhatsApp." 
      }]);
      return;
    }

    setIsTyping(true);

    try {
      // Send message to Gemini
      const result = await chatSession.current.sendMessage(userText);
      let botResponse = result.response.text();

      // Check if lead was captured
      if (botResponse.includes("[LEAD_CAPTURED]")) {
        botResponse = botResponse.replace("[LEAD_CAPTURED]", "").trim();
        
        // Compile history to find contact info
        const historyText = messages.map(m => m.text).join(" | ") + " | " + userText;
        await extractAndSaveLead(historyText);
      }

      setMessages(prev => [...prev, { 
        id: `msg-bot-${Date.now()}`, 
        sender: "bot", 
        text: botResponse 
      }]);
    } catch (error) {
      console.error("AI Chat error:", error);
      setMessages(prev => [...prev, { 
        id: `msg-err-${Date.now()}`, 
        sender: "bot", 
        text: "I'm having trouble connecting to my brain right now. Please try again in a moment." 
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
            className="bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-[320px] sm:w-[380px] h-[500px] mb-4 flex flex-col overflow-hidden"
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
                <button 
                  onClick={handleRestart} 
                  title="Restart Chat"
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-[#030213]/50 space-y-4">
              {messages.map((msg, index) => (
                <div key={msg.id} className="space-y-3">
                  <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "bot" && (
                       <div className="w-6 h-6 rounded-full bg-[#030213] flex-shrink-0 flex items-center justify-center mr-2 self-end mb-1">
                         <Bot className="w-3.5 h-3.5 text-[#B5F823]" />
                       </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                      msg.sender === "user" 
                        ? "bg-[#7FB706] text-white rounded-br-none" 
                        : "bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}>
                      {/* Very basic markdown parsing for bold text the AI might output */}
                      <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
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
                  placeholder="Ask me anything..."
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
