import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, User, Bot, CheckCircle2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

type ChatStep = "greeting" | "ask_name" | "ask_contact" | "finished";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", sender: "bot", text: "Hi there! 👋 How can we help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState<ChatStep>("greeting");
  
  // Form Data collected
  const [formData, setFormData] = useState({
    requirement: "",
    name: "",
    contactInfo: ""
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");
    
    // Add user message
    const newUserMsg: Message = { id: `msg-${Date.now()}`, sender: "user", text: userText };
    setMessages(prev => [...prev, newUserMsg]);

    // Handle bot response based on current step
    setTimeout(async () => {
      let botResponse = "";
      
      if (step === "greeting") {
        setFormData(prev => ({ ...prev, requirement: userText }));
        botResponse = "Got it! Could I have your name, please?";
        setStep("ask_name");
      } 
      else if (step === "ask_name") {
        setFormData(prev => ({ ...prev, name: userText }));
        botResponse = `Nice to meet you, ${userText}! Finally, what's your email or phone number so our team can reach out?`;
        setStep("ask_contact");
      } 
      else if (step === "ask_contact") {
        setFormData(prev => ({ ...prev, contactInfo: userText }));
        botResponse = "Thank you! Your inquiry has been sent to our team. We'll be in touch shortly. ✅";
        setStep("finished");
        
        // Submit to backend
        try {
          if (isSupabaseConfigured()) {
            // Check if contactInfo contains '@' to save as email, else phone
            const isEmail = userText.includes('@');
            
            await supabase.from('contact_queries').insert([{
              name: formData.name || "Chatbot User",
              email: isEmail ? userText : "N/A",
              phone: !isEmail ? userText : "N/A",
              requirement: "Chatbot Inquiry",
              message: formData.requirement || "No message",
              company: null
            }]);
          }
          
          // Optionally trigger Web3Forms here if needed, but for free tier Supabase is enough.
        } catch (error) {
          console.error("Chatbot submission error:", error);
        }
      }

      if (botResponse) {
        setMessages(prev => [...prev, { id: `msg-bot-${Date.now()}`, sender: "bot", text: botResponse }]);
      }
    }, 600); // Small delay for realism
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-[320px] sm:w-[360px] h-[450px] mb-4 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#030213] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#7FB706] rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Pacific Support</h3>
                  <p className="text-[#B5F823] text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#7FB706] animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-[#030213] space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "user" 
                      ? "bg-[#7FB706] text-white rounded-br-none" 
                      : "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0a0a1a]">
              {step !== "finished" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white focus:border-[#7FB706] focus:ring-1 focus:ring-[#7FB706] dark:text-white rounded-full px-4 py-2 text-sm outline-none transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 rounded-full bg-[#7FB706] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6fa005] transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 py-2 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7FB706]" /> Chat finished
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#7FB706] text-white rounded-full shadow-lg shadow-[#7FB706]/30 hover:bg-[#6fa005] hover:scale-105 transition-all flex items-center justify-center group"
          aria-label="Open Chat"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}
