'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingBag, Heart, Star, ChevronRight, 
  ShieldCheck, Truck, ArrowRight, Maximize2
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice } from '@/lib/utils';
import { useState } from 'react';

export default function QuickView({ product, isOpen, onClose }) {
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const { addToCart } = useStore();

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-6xl bg-surface-2 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[850px] border border-white/10"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 w-12 h-12 bg-surface-3 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-ink transition-all shadow-xl"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Image Section */}
            <div className="md:flex-[1.2] lg:flex-[1.4] relative bg-surface-3 group">
               <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
               <div className="absolute top-8 left-8 bg-brand text-ink text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">EDITORIAL SELECTION</div>
            </div>

            {/* Right Information Section */}
            <div className="md:flex-1 p-12 lg:p-16 overflow-y-auto scrollbar-hide space-y-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-gold">
                    <div className="flex">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
                    </div>
                    <span className="text-[10px] text-muted-main uppercase tracking-widest font-black">4.8 Rating • 1.2k Sold</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-display font-medium text-white uppercase tracking-tighter leading-none">{product.name}</h2>
                  <div className="flex items-center gap-6">
                    <span className="text-4xl font-mono font-bold text-white tracking-widest">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                       <span className="text-xl font-mono text-muted-main line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
               </div>

               <p className="text-sm text-muted-main leading-relaxed font-light uppercase tracking-widest italic opacity-80">
                  {product.description || "A meticulously crafted accessory that defines minimalist luxury, meticulously designed for editorial flair and timeless style."}
               </p>

               <div className="space-y-8">
                  {/* Color Selector */}
                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-brand">Select Palette</p>
                     <div className="flex gap-4">
                        {['#E5D3B3', '#36454F', '#9CAF88', '#0D0D0D'].map((color) => (
                           <button 
                             key={color}
                             onClick={() => setSelectedColor(color)}
                             className={cn(
                               "w-10 h-10 rounded-full border-2 transition-all p-1 flex items-center justify-center shadow-lg",
                               selectedColor === color ? "border-brand scale-110" : "border-white/10"
                             )}
                           >
                              <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-brand">Select Silhouette</p>
                     <div className="flex gap-3">
                        {['XXS', 'XS', 'S', 'M', 'L', 'XL'].map((size) => (
                           <button 
                             key={size}
                             onClick={() => setSelectedSize(size)}
                             className={cn(
                               "px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                               selectedSize === size ? "bg-brand text-ink border-brand" : "bg-surface-3 border-white/5 text-muted-main"
                             )}
                           >
                              {size}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* CTA Buttons */}
               <div className="flex flex-col gap-4 pt-10">
                  <button 
                    onClick={() => { addToCart(product); onClose(); }}
                    className="flex-1 bg-brand text-ink py-6 rounded-full text-xs font-black uppercase tracking-[0.25em] hover:bg-brand-dim hover:text-white transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-4 group"
                  >
                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add to Shopping Bag
                  </button>
                  <div className="flex gap-4">
                     <button className="flex-1 bg-surface-3 border border-white/10 text-white rounded-full py-5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-ink transition-all flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" /> Save To Silhouette
                     </button>
                  </div>
                  <Link 
                    href={`/product/${product.id}`} 
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-widest text-muted-main hover:text-white transition-colors flex items-center justify-center gap-2 pt-4 group"
                  >
                    View Comprehensive Piece Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand" />
                  </Link>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
