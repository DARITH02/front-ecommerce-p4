'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Sparkles, X } from 'lucide-react';
import Image from 'next/image';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  return (
    <section className="py-24 bg-brand px-6 md:px-12 max-w-[1920px] mx-auto overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
        
        {/* Left: Copy */}
        <div className="flex-1 space-y-10 text-ink">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 bg-ink/10 border border-ink/20 px-4 py-2 rounded-full">
                <Sparkles className="w-3.5 h-3.5 fill-ink" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Membership</p>
             </div>
             <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter uppercase">
               Get 15% Off Your <br />
               <span className="text-white">First Order.</span>
             </h2>
          </div>
          
          <p className="max-w-md text-lg leading-relaxed font-bold opacity-80 uppercase tracking-widest leading-tight italic">
            Join the Lumina Editorial Circle for early access to curated collections, 
            exclusive events, and seasonal lookbooks.
          </p>
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
               <motion.form 
                 key="form"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 onSubmit={handleSubmit}
                 className="relative group "
               >
                 <input 
                   type="email" 
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Enter your email address" 
                   className="w-full bg-ink/10 border border-ink/20 rounded-full px-10 py-6 text-sm placeholder:text-ink/60 focus:outline-none focus:border-ink/40 transition-all font-bold uppercase tracking-widest"
                 />
                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="absolute right-3 top-1/2 -translate-y-1/2 bg-ink text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-ink transition-all disabled:opacity-50 flex items-center gap-2"
                 >
                   {isLoading ? 'Processing...' : 'SUBSCRIBE'} <Send className="w-4 h-4" />
                 </button>
               </motion.form>
            ) : (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl space-y-4 relative overflow-hidden group shadow-2xl"
               >
                 <div className="flex items-center gap-4 text-ink">
                   <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <CheckCircle className="w-6 h-6" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-2xl font-display font-black uppercase tracking-tight">YOU&apos;RE IN!</h4>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60">Check your inbox for the welcome gift.</p>
                   </div>
                 </div>
                 
                 <div className="bg-ink p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6 border border-white/10 shadow-lg mt-8 group">
                    <div className="text-center sm:text-left">
                       <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold mb-1">Your Unique Code</p>
                       <h3 className="text-white text-3xl font-display font-medium tracking-tighter">LUMINA15OFF</h3>
                    </div>
                    <button className="bg-brand text-ink px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-dim hover:text-white transition-all shadow-lg active:scale-95 group-hover:animate-pulse">
                       COPY & SHOP NOW
                    </button>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Illustration/Image */}
        <div className="flex-1 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
           <Image 
             src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80" 
             alt="Newsletter Background" 
             fill 
             className="object-cover transition-transform duration-[3000ms] group-hover:scale-110 grayscale-[0.5]"
           />
           <div className="absolute inset-0 bg-ink/10 mix-blend-multiply opacity-60" />
           <div className="absolute inset-0 border-[32px] border-ink/5 pointer-events-none" />
        </div>

      </div>

      {/* Background Graphic Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none select-none" />
    </section>
  );
}
