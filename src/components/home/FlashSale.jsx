'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, ArrowRight, Zap, ShoppingBag, Sparkles, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

const flashProducts = [
  { id: 1, name: 'Minimalist Tote', price: 120, originalPrice: 180, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80', discount: 33 },
  { id: 2, name: 'Editorial Boots', price: 299, originalPrice: 450, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80', discount: 34 },
  { id: 3, name: 'Luxury Suit Set', price: 540, originalPrice: 850, image: 'https://images.unsplash.com/photo-1594932224010-75f430c30225?auto=format&fit=crop&w=400&q=80', discount: 36 },
  { id: 4, name: 'Signature Shades', price: 150, originalPrice: 220, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80', discount: 32 },
  { id: 5, name: 'Editorial Knit', price: 180, originalPrice: 260, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80', discount: 31 },
];

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ dd: 0, hh: 0, mm: 0, ss: 0 });

  useEffect(() => {
    // Set target to 48 hours from now
    const target = new Date().getTime() + (48 * 60 * 60 * 1000);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      
      setTimeLeft({
        dd: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hh: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mm: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        ss: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-brand py-24 relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex flex-col xl:flex-row items-center gap-12 lg:gap-24 relative z-10">
        
        {/* Left Side: Copy & Timer */}
        <div className="flex-1 space-y-10 text-ink">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] font-black opacity-60">Limited Opportunity</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9]">
              Flash Sale Event
            </h2>
          </div>

          <div className="flex gap-4 sm:gap-8">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-ink/10 border border-ink/20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-mono font-bold backdrop-blur-md">
                  {value.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] uppercase tracking-widest mt-2 font-black">{label}</span>
              </div>
            ))}
          </div>

          <p className="max-w-md text-sm leading-relaxed font-medium opacity-80 uppercase tracking-widest">
            Ending soon. Premium editorial collections at exclusive seasonal pricing. 
            Once it&apos;s gone, it&apos;s gone forever.
          </p>

          <Link href="/shop" className="inline-flex items-center gap-4 bg-ink text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-ink/80 transition-all hover:pr-14 group">
            Shop The Sale <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Side: Horizontal Strip */}
        <div className="flex-[2] w-full flex overflow-x-auto gap-6 scrollbar-hide pb-8 -mr-6 md:-mr-12 pl-2">
          {flashProducts.map((product, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-72 group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden p-4 group"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2 mb-4">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Badges */}
                <span className="absolute top-4 left-4 bg-ink text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                  -{product.discount}%
                </span>
                
                {/* Action Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="w-10 h-10 bg-white text-ink rounded-full flex items-center justify-center hover:bg-brand hover:text-white transition-all hover:scale-110">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-white text-ink rounded-full flex items-center justify-center hover:bg-brand hover:text-white transition-all hover:scale-110">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-white text-ink rounded-full flex items-center justify-center hover:bg-brand hover:text-white transition-all hover:scale-110">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <h4 className="text-white font-display font-medium text-lg truncate group-hover:text-ink transition-colors">{product.name}</h4>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-ink font-bold text-xl">${product.price}</span>
                  <span className="text-white/40 line-through text-xs">${product.originalPrice}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Decorative SVG Patterns */}
      <div className="absolute top-0 right-0 py-12 px-24 opacity-10 pointer-events-none uppercase text-ink font-black text-9xl tracking-tighter leading-none select-none">
        FLASH <br /> SALE
      </div>
    </section>
  );
}
