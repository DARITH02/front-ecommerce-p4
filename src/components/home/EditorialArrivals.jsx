'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowRight, ShoppingCart, Sparkles, ShoppingBag, Star, Zap } from 'lucide-react';
import useStore from '@/lib/store/useStore';

const products = [
  { id: 1, name: 'Editorial Cashmere Scarf', price: 180, image: 'https://images.unsplash.com/photo-1520903920234-7546ab806509?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Luxury Oversized Tote', price: 450, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Minimalist Chelsea Boots', price: 320, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80' },
];

export default function EditorialArrivals() {
  const { addToCart, setMiniCartOpen } = useStore();

  const handleAddToCart = (product) => {
    addToCart(product);
    setMiniCartOpen(true);
  };
  return (
    <section className="py-24 bg-surface px-6 md:px-12 max-w-[1920px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:h-[800px]">
        
        {/* Left: Editorial Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="lg:flex-[1.5] relative rounded-3xl overflow-hidden group min-h-[500px]"
        >
          <Image 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" 
            alt="Editorial Campaign" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
            <p className="text-brand font-bold text-xs uppercase tracking-[0.4em] mb-4">Editorial Series 2026</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium text-white mb-8 tracking-tighter uppercase leading-[0.9]">
              The Modern <br /> Silhouette
            </h2>
            <Link 
              href="/shop" 
              className="group flex items-center gap-4 bg-white text-ink w-fit px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-all hover:pr-12"
            >
              Discover The Concept <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Right: Product Selection */}
        <div className="lg:flex-1 flex flex-col justify-between py-4 space-y-8 lg:space-y-0">
          <div className="space-y-4">
            <p className="text-xs text-brand font-bold uppercase tracking-[0.3em]">New Season</p>
            <h3 className="text-3xl font-display font-medium text-white uppercase tracking-tight">Curated Arrivals</h3>
            <p className="text-muted-main text-sm max-w-sm leading-relaxed">
              Meticulously selected pieces from our latest global campaign. 
              Designed for longevity, quality, and timeless editorial flair.
            </p>
          </div>

          <div className="space-y-6">
            {products.map((product, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-2 transition-colors border border-transparent hover:border-white/5"
              >
                <div className="relative w-24 h-32 bg-surface-2 rounded-xl overflow-hidden shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-lg font-display text-white group-hover:text-brand transition-colors">{product.name}</h4>
                  <p className="font-mono text-muted-main text-sm font-bold">${product.price}</p>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/20 pb-2 w-fit hover:border-brand transition-colors hover:text-brand flex items-center gap-2">
            See all new arrivals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
