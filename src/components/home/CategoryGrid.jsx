'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowRight, Sparkles } from 'lucide-react';

const categories = [
  { 
    title: 'Women\'s Collection', 
    slug: 'women', 
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    gridArea: 'lg:col-span-2 lg:row-span-2'
  },
  { 
    title: 'Minimalist Accessories', 
    slug: 'accessories', 
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    gridArea: 'lg:col-span-1 lg:row-span-1'
  },
  { 
    title: 'Beauty & Skincare', 
    slug: 'beauty', 
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&w=800&q=80',
    gridArea: 'lg:col-span-1 lg:row-span-1'
  },
  { 
    title: 'Men\'s Editorial', 
    slug: 'men', 
    image: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&w=800&q=80',
    gridArea: 'lg:col-span-2 lg:row-span-1'
  },
  { 
    title: 'Flash Sale', 
    slug: 'sale', 
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    gridArea: 'lg:col-span-1 lg:row-span-1'
  },
  { 
    title: 'Luxury Home', 
    slug: 'home', 
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    gridArea: 'lg:col-span-1 lg:row-span-1'
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-surface max-w-[1920px] mx-auto px-6 md:px-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div className="space-y-4">
          <p className="text-xs text-brand uppercase tracking-[0.3em] font-bold">Curated Selection</p>
          <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white uppercase">Featured Categories</h2>
        </div>
        <Link href="/shop" className="group flex items-center gap-3 text-muted-main hover:text-white transition-colors uppercase tracking-widest text-sm font-medium border-b border-white/10 pb-2">
          Explore All Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:gap-8 h-auto lg:h-[900px]">
        {categories.map((cat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            viewport={{ once: true }}
            className={`relative group overflow-hidden rounded-3xl cursor-pointer ${cat.gridArea} min-h-[300px] lg:min-h-0`}
          >
            <Image 
              src={cat.image} 
              alt={cat.title} 
              fill 
              className="object-cover grayscale-[0.2] transition-all duration-[1.5s] group-hover:scale-110 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end transition-all duration-700 group-hover:via-black/40">
              <p className="text-[10px] text-brand uppercase tracking-[0.4em] mb-3 translate-y-6 group-hover:translate-y-0 transition-transform duration-700 font-black opacity-0 group-hover:opacity-100">Direct Entry</p>
              <h3 className="text-2xl lg:text-4xl font-display font-medium text-white mb-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-700 uppercase leading-none">{cat.title}</h3>
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-all duration-700 bg-white/10 backdrop-blur-xl group-hover:border-brand/50">
                <ArrowRight className="w-6 h-6 group-hover:text-brand transition-colors" />
              </div>
            </div>
            
            <Link href={`/en/category/${cat.slug}`} className="absolute inset-0 z-10" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
