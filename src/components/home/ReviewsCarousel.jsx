'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

const reviews = [
  { id: 1, text: "Lumina's attention to detail is unparalleled. The minimalist aesthetic perfectly aligns with my editorial wardrobe.", author: "Alexander Volt", role: "Creative Director", photo: "https://i.pravatar.cc/150?u=1", rating: 5, product: "Editorial Blazer" },
  { id: 2, text: "The quality of the silk was beyond my expectations. Efficient shipping and premium packaging experience.", author: "Sophia Luna", role: "Fashion Blogger", photo: "https://i.pravatar.cc/150?u=2", rating: 5, product: "Silk Slip Dress" },
  { id: 3, text: "A seamless shopping journey from discovery to delivery. Customer service is as premium as their products.", author: "Julian Reed", role: "Designer", photo: "https://i.pravatar.cc/150?u=3", rating: 4, product: "Leather Boots" },
];

export default function ReviewsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((index + 1) % reviews.length);
  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-24 bg-surface mx-auto w-full px-6 md:px-12 relative overflow-hidden">
      <div className="text-center mb-16 space-y-4">
        <p className="text-xs text-brand uppercase tracking-[0.4em] font-bold">Client Voices</p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-text-main uppercase tracking-tight">The Lumina Experience</h2>
      </div>

      <div className="w-11/12 mx-auto relative px-12 md:px-24">
        
        {/* Quote Icon Background */}
        <Quote className="absolute -top-12 left-0 w-32 h-32 text-brand opacity-5 scale-x-[-1]" />

        <div className="relative overflow-hidden min-h-[450px] md:h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className="text-center space-y-8 flex flex-col items-center"
            >
              <div className="flex gap-1 justify-center mb-6">
                {[...Array(reviews[index].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              
              <blockquote className="text-xl sm:text-2xl md:text-4xl font-display font-light text-text-main leading-tight italic max-w-2xl px-4">
                &ldquo;{reviews[index].text}&rdquo;
              </blockquote>

              <div className="flex items-center gap-6 pt-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand/20 p-1">
                   <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image src={reviews[index].photo} alt={reviews[index].author} fill className="object-cover" />
                   </div>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-lg font-display font-medium text-text-main">{reviews[index].author}</p>
                  <p className="text-xs text-muted-main uppercase tracking-widest font-bold">{reviews[index].role} — {reviews[index].product}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4 md:px-0">
          <button 
            onClick={prev} 
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-muted-main hover:text-white hover:border-brand transition-all backdrop-blur-md pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next} 
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-muted-main hover:text-white hover:border-brand transition-all backdrop-blur-md pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-4 mt-12">
          {reviews.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)}
              className={`w-12 h-1 rounded-full transition-all duration-500 ${index === i ? 'bg-brand shadow-lg ' : 'bg-white/5'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
