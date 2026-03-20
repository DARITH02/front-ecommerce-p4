'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot, History, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import useStore from '@/lib/store/useStore';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Greetings. I am Lumina's editorial assistant. How may I refine your shopping expertise today?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const { isDarkMode } = useStore();

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    
    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        text: "Excellent choice. Our luxury advisors are analyzing your request and will provide a curated response momentarily." 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[300] w-16 h-16 bg-brand text-ink rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-dim hover:text-white transition-all group active:scale-95 border-4 border-surface"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
               <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
               <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Status Indicator */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-mint border-2 border-surface rounded-full animate-pulse shadow-lg" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95, transformOrigin: 'bottom' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className={cn(
               "fixed z-[350] flex flex-col bg-surface-2 border border-border-custom shadow-3xl overflow-hidden backdrop-blur-3xl transition-all duration-500",
               // Mobile: Full screen/Drawer
               "bottom-0 right-0 left-0 h-[92vh] rounded-t-[3rem] w-full",
               // Desktop: Floating card
               "md:bottom-28 md:right-12 md:left-auto md:w-[420px] md:h-[650px] md:rounded-[2.5rem]"
            )}
          >
            {/* Header: Editorial Identity */}
            <div className="bg-brand p-8 flex items-center justify-between relative overflow-hidden">
               {/* Decorative background circle */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-ink/5 rounded-full -translate-y-16 translate-x-16" />
               
               <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 bg-ink rounded-2xl flex items-center justify-center text-brand shadow-xl">
                     <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                     <h4 className="text-xl md:text-2xl font-display font-medium text-ink uppercase tracking-tight">Editorial Advisor</h4>
                     <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-pulse" />
                        <p className="text-[9px] md:text-[10px] text-ink/60 font-black uppercase tracking-widest leading-none">Global Concierge Active</p>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3 relative z-10">
                  <div className="flex flex-col items-end opacity-40 mr-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-ink mb-1" />
                     <div className="w-1.5 h-1.5 rounded-full bg-ink" />
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-12 h-12 bg-ink/10 rounded-2xl border border-ink/20 flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all active:scale-90"
                  >
                     <X className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-surface-2/50"
            >
               {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-4 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                     <div className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-110",
                        msg.role === 'user' ? "bg-surface-3 text-text-main border border-border-custom" : "bg-brand text-ink"
                     )}>
                        {msg.role === 'user' ? <User className="w-5 h-5 md:w-6 md:h-6" /> : <Bot className="w-5 h-5 md:w-6 md:h-6" />}
                     </div>
                     <div className={cn(
                        "p-6 rounded-[2rem] text-[10px] md:text-sm font-bold md:font-medium uppercase md:normal-case tracking-widest md:tracking-normal leading-relaxed shadow-sm",
                        msg.role === 'user' 
                          ? "bg-surface-3 text-text-main rounded-tr-none border border-border-custom" 
                          : "bg-brand/10 text-text-main rounded-tl-none border border-brand/20 backdrop-blur-md"
                     )}>
                        {msg.text}
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* Footer / Interaction Space */}
            <form onSubmit={handleSend} className="p-8 border-t border-border-custom bg-surface-2/80 backdrop-blur-md space-y-6">
               <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Latest Drops', icon: Sparkles },
                    { label: 'Track Order', icon: Clock },
                    { label: 'Archive Search', icon: History }
                  ].map((tag) => (
                     <button 
                       key={tag.label} 
                       onClick={() => setInput(tag.label)} 
                       type="button" 
                       className="flex items-center gap-2 px-4 py-3 bg-surface-3 border border-border-custom rounded-full text-[9px] font-black uppercase tracking-widest text-muted-main hover:bg-brand hover:text-ink hover:border-brand transition-all active:scale-95"
                     >
                        <tag.icon className="w-3 h-3" />
                        {tag.label}
                     </button>
                  ))}
               </div>

               <div className="relative group">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Refine your request..."
                    className="w-full bg-surface-3 border border-border-custom px-8 py-6 rounded-[2rem] focus:outline-none focus:border-brand/60 focus:ring-4 focus:ring-brand/5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-main placeholder:text-muted-main transition-all"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-2 bottom-2 bg-brand text-ink px-8 rounded-[1.5rem] hover:bg-ink hover:text-brand transition-all flex items-center justify-center group-hover:px-10"
                  >
                     <Send className="w-4 h-4" />
                  </button>
               </div>

               <div className="flex flex-col items-center gap-2 mt-4 opacity-40">
                  <p className="text-[8px] text-muted-main uppercase tracking-[0.4em] font-black leading-none">
                     Lumina Editorial AI • Core V.2.0
                  </p>
                  <div className="w-12 h-0.5 bg-border-custom rounded-full" />
               </div>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
