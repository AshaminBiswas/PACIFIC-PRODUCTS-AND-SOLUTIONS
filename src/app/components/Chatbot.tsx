import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, User, Bot, CheckCircle2, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: string[]; // Quick reply buttons
};

type ChatStep = 
  | "greeting" 
  | "choose_service" 
  | "choose_solution" 
  | "browsing" 
  | "ask_name" 
  | "ask_contact" 
  | "finished";

const INITIAL_MESSAGE: Message = { 
  id: "msg-init", 
  sender: "bot", 
  text: "Hi there! 👋 Welcome to Pacific Products & Solutions. What are you looking for today?",
  options: ["Our Services", "Industry Solutions", "Just Browsing"]
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
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

  // Handle click on a Quick Reply button
  const handleOptionClick = (optionText: string) => {
    // 1. Add User's selection to chat
    const newUserMsg: Message = { id: `msg-${Date.now()}`, sender: "user", text: optionText };
    setMessages(prev => [...prev, newUserMsg]);

    // 2. Determine Bot's response
    setTimeout(() => {
      let nextMsg: Message | null = null;
      let nextStep = step;

      if (step === "greeting") {
        if (optionText === "Our Services") {
          nextMsg = {
            id: `msg-bot-${Date.now()}`, sender: "bot",
            text: "We offer a range of premium interior solutions. Please select one:",
            options: ["Restroom Cubicles", "Toilet Partitions", "Exterior Cladding", "Interior Paneling", "Cubicle Hardware", "Acrylic Solid Surface"]
          };
          nextStep = "choose_service";
        } else if (optionText === "Industry Solutions") {
          nextMsg = {
            id: `msg-bot-${Date.now()}`, sender: "bot",
            text: "We tailor our products for various sectors. Which industry are you in?",
            options: ["Corporate Offices", "Education", "Healthcare", "Airports & Metro", "Retail & Malls", "Sports & Leisure"]
          };
          nextStep = "choose_solution";
        } else {
          nextMsg = {
            id: `msg-bot-${Date.now()}`, sender: "bot",
            text: "No problem! Feel free to explore our site. Click the button below if you change your mind.",
            options: ["Start Over"]
          };
          nextStep = "browsing";
        }
      } 
      else if (step === "choose_service" || step === "choose_solution") {
        setFormData(prev => ({ ...prev, requirement: optionText }));
        nextMsg = {
          id: `msg-bot-${Date.now()}`, sender: "bot",
          text: `Great choice! Our ${optionText} are highly durable and customizable. To share a detailed quote and catalog with you, could I please get your name?`
        };
        nextStep = "ask_name";
      }
      else if (step === "browsing" && optionText === "Start Over") {
        setMessages([INITIAL_MESSAGE]);
        setStep("greeting");
        setFormData({ requirement: "", name: "", contactInfo: "" });
        return; // Early return to avoid appending to history
      }

      if (nextMsg) {
        setMessages(prev => [...prev, nextMsg!]);
        setStep(nextStep);
      }
    }, 600);
  };

  // Handle typing text input (for name and contact info)
  const handleSendText = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");
    
    // Add user message
    const newUserMsg: Message = { id: `msg-${Date.now()}`, sender: "user", text: userText };
    setMessages(prev => [...prev, newUserMsg]);

    // Handle bot response based on current step
    setTimeout(async () => {
      let botResponse = "";
      
      if (step === "ask_name") {
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
            const isEmail = userText.includes('@');
            await supabase.from('contact_queries').insert([{
              name: formData.name || "Chatbot User",
              email: isEmail ? userText : "N/A",
              phone: !isEmail ? userText : "N/A",
              requirement: formData.requirement || "General Inquiry",
              message: "Generated via Chatbot Flow",
              company: null
            }]);
          }
        } catch (error) {
          console.error("Chatbot submission error:", error);
        }
      }

      if (botResponse) {
        setMessages(prev => [...prev, { id: `msg-bot-${Date.now()}`, sender: "bot", text: botResponse }]);
      }
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendText();
    }
  };

  const showTextInput = step === "ask_name" || step === "ask_contact";
  const isFinished = step === "finished" || step === "browsing";

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
                  <h3 className="font-bold text-sm leading-tight">Pacific Support</h3>
                  <p className="text-[#B5F823] text-[11px] flex items-center gap-1 font-medium tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7FB706] animate-pulse shadow-[0_0_8px_rgba(127,183,6,0.8)]"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setMessages([INITIAL_MESSAGE]);
                    setStep("greeting");
                    setFormData({ requirement: "", name: "", contactInfo: "" });
                  }} 
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
              {messages.map((msg, index) => {
                const isLastMsg = index === messages.length - 1;
                return (
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
                        {msg.text}
                      </div>
                    </div>
                    
                    {/* Quick Replies (Only show for the very last message if it has options) */}
                    {isLastMsg && msg.options && msg.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 pl-8 pt-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-[#7FB706] text-[#7FB706] hover:bg-[#7FB706] hover:text-white transition-colors bg-white dark:bg-transparent"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0a0a1a] shrink-0">
              {showTextInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer..."
                    autoFocus
                    className="flex-1 bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white focus:border-[#7FB706] focus:ring-1 focus:ring-[#7FB706] dark:text-white rounded-full px-4 py-2.5 text-sm outline-none transition-all"
                  />
                  <button 
                    onClick={handleSendText}
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 rounded-full bg-[#7FB706] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6fa005] transition-colors shrink-0 shadow-md shadow-[#7FB706]/20"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              ) : isFinished ? (
                <div className="text-center text-sm text-gray-500 py-1.5 flex items-center justify-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#7FB706]" /> 
                  {step === "finished" ? "Inquiry Received" : "Chat Ended"}
                </div>
              ) : (
                <div className="text-center text-[12px] text-gray-400 py-1.5">
                  Please select an option above
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
          className="w-14 h-14 bg-[#7FB706] text-white rounded-full shadow-xl shadow-[#7FB706]/40 hover:bg-[#6fa005] hover:scale-105 transition-all flex items-center justify-center group relative"
          aria-label="Open Chat"
        >
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-[#030213]"></span>
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}
