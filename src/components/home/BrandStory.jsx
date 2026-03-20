'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const Counter = ({ value, label, suffix = '+' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepVal = value / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setCount(Math.min(Math.round(stepVal * currentStep), value));
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="space-y-4">
      <div className="text-5xl md:text-8xl font-display font-medium text-brand tracking-tighter">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-xs text-muted-main uppercase tracking-[0.4em] font-bold">{label}</p>
    </div>
  );
};

export default function BrandStory() {
  return (
    <section className="py-24 bg-surface-2 border-y border-border-custom px-6 md:px-12 w-11/12 mx-auto text-center relative overflow-hidden rounded-3xl">
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <p className="text-xs text-brand uppercase tracking-[0.5em] font-bold">The Lumina Philosophy</p>
        <h2 className="text-4xl md:text-[80px] font-display font-bold text-text-main uppercase leading-[1] tracking-tighter">
          Crafting <span className="text-brand">Timeless</span> <br /> 
          Editorial Legacies.
        </h2>
        
        <p className="text-muted-main text-lg leading-relaxed max-w-2xl mx-auto font-light">
          Lumina Store began as a vision to merge minimalist digital design with superior 
          fabrication and ethical craftsmanship. Every piece is an editorial chapter in a global 
          narrative of intentional luxury and sustainable style.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-24 pt-12 border-t border-white/5 mt-16">
          <Counter value={50000} label="Global Customers" />
          <Counter value={120} label="Countries Reached" />
          <Counter value={98} label="Customer Satisfaction" suffix="%" />
        </div>
      </div>

      {/* Decorative SVG Pattern background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.05] overflow-hidden mix-blend-overlay">
         <div className="text-[20vw] font-black text-white whitespace-nowrap -rotate-6 select-none leading-none -translate-x-12 translate-y-24">
            LUMINA • LUMINA • LUMINA • LUMINA •
         </div>
      </div>
    </section>
  );
}
