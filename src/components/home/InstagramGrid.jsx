'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram, ShoppingBag, Eye } from 'lucide-react';

const instaPosts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', likes: '1.2k' },
  { id: 2, image: 'https://images.unsplash.com/photo-1539109132314-d4d8b05774d5?auto=format&fit=crop&w=600&q=80', likes: '2.5k' },
  { id: 3, image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=600&q=80', likes: '800' },
  { id: 4, image: 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=600&q=80', likes: '3.1k' },
  { id: 5, image: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&w=600&q=80', likes: '1.5k' },
  { id: 6, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', likes: '4.2k' },
];

export default function InstagramGrid() {
  return (
    <section className="py-24 bg-surface-2 border-y border-border-custom px-6 md:px-12 max-w-[1920px] mx-auto text-center relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 px-4">
        <div className="flex items-center gap-4 group cursor-pointer hover:text-brand transition-colors">
          <div className="w-14 h-14 bg-surface-3 rounded-2xl flex items-center justify-center text-white group-hover:bg-brand group-hover:text-ink transition-all">
             <Instagram className="w-6 h-6" />
          </div>
          <div className="text-left space-y-1">
             <h4 className="text-xl font-display font-medium text-white uppercase tracking-tight">SHOP THE GRAM</h4>
             <p className="text-xs text-muted-main uppercase tracking-widest font-bold">@LUMINA_STORE • #LUMINAESTHETIC</p>
          </div>
        </div>
        <p className="text-sm font-light text-muted-main max-w-sm text-center md:text-right leading-relaxed italic">
          Follow our global editorial journey and join 50k+ enthusiasts for daily inspiration.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-8 h-auto">
        {instaPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="group relative rounded-2xl overflow-hidden aspect-square lg:aspect-auto"
          >
            <Image 
              src={post.image} 
              alt={`Instagram post ${post.id}`} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-brand/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center justify-center gap-4 text-ink">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                <ShoppingBag className="w-4 h-4 fill-ink" />
                Shop This Look
              </div>
              <div className="w-10 h-10 border border-ink/20 rounded-full flex items-center justify-center group/eye hover:bg-ink hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold opacity-60 mt-4 uppercase tracking-[0.3em]">{post.likes} LIKES</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative Text background */}
      <div className="absolute -bottom-16 left-0 right-0 py-8 opacity-[0.03] select-none pointer-events-none whitespace-nowrap text-[12vw] font-black italic tracking-tighter uppercase leading-none">
        #EDITORIAL #MINIMALIST #LUMINA #AESTHETIC #SHOPTHELOOK
      </div>
    </section>
  );
}
