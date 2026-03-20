'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShoppingBag, Heart, Share2, Truck, ShieldCheck, 
  ChevronDown, Plus, Minus, Maximize2, Play, RefreshCw, Zap, ArrowLeftRight
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice } from '@/lib/utils';

const productData = {
  id: 1,
  name: 'Editorial Cashmere Scarf',
  brand: 'Editorial Luxury',
  price: 180,
  originalPrice: 240,
  rating: 4.8,
  reviewsCount: 124,
  description: 'A masterpiece of minimalist design, crafted from 100% sustainably sourced Mongolian cashmere. This piece defines the intersection of editorial flair and functional warmth.',
  features: [
    '100% Pure Mongolian Cashmere',
    'Hand-finished editorial edges',
    'Sustainably sourced fibers',
    'Temperature regulating natural weave'
  ],
  images: [
    'https://images.unsplash.com/photo-1520903920234-7546ab806509?auto=format&fit=crop&w=1200&q=100',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=100',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=100'
  ],
  colors: [
    { name: 'Onyx', hex: '#0D0D0D' },
    { name: 'Sand', hex: '#E5D3B3' },
    { name: 'Mist', hex: '#A8B0B5' }
  ],
  sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL']
};

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setMiniCartOpen } = useStore();

  const handleAddToCart = () => {
    addToCart(productData, `${selectedColor.name} / ${selectedSize}`, quantity);
    setMiniCartOpen(true);
  };

  return (
    <div className="bg-surface pt-32 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 text-[10px] text-muted-main uppercase tracking-[0.4em] mb-12 font-black">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span className="w-1 h-1 bg-white/20 rounded-full" />
        <Link href="/shop" className="hover:text-brand transition-colors">Archive</Link>
        <span className="w-1 h-1 bg-white/20 rounded-full" />
        <span className="text-white">{productData.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Image Gallery */}
        <div className="flex-1 space-y-8">
           <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden border border-white/5 bg-surface-2 group">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={selectedImage}
                   initial={{ opacity: 0, scale: 1.1 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                   className="relative w-full h-full"
                 >
                    <Image 
                      src={productData.images[selectedImage]} 
                      alt={productData.name} 
                      fill 
                      className="object-cover"
                      priority
                    />
                 </motion.div>
              </AnimatePresence>
              
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                 <div className="bg-brand text-ink text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Editorial Selection</div>
                 <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/10">Limited Artifact</div>
              </div>

              <button className="absolute bottom-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-ink transition-all shadow-2xl">
                 <Maximize2 className="w-6 h-6" />
              </button>
           </div>

           <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {productData.images.map((img, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setSelectedImage(idx)}
                   className={cn(
                     "relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                     selectedImage === idx ? "border-brand scale-105" : "border-white/5 opacity-50 hover:opacity-100"
                   )}
                 >
                    <Image src={img} alt={`${productData.name} view ${idx}`} fill className="object-cover" />
                 </button>
              ))}
              <div className="relative w-24 aspect-square rounded-2xl overflow-hidden border border-white/5 shrink-0 bg-surface-2 flex items-center justify-center group cursor-pointer">
                 <Play className="w-8 h-8 text-white group-hover:text-brand transition-colors" />
                 <span className="absolute bottom-2 text-[8px] font-black uppercase text-white/50">Motion Play</span>
              </div>
           </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col justify-center space-y-12">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <span className="text-xs font-black uppercase tracking-[0.4em] text-brand">{productData.brand}</span>
                 <div className="h-px w-12 bg-white/10" />
                 <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    <span className="text-[11px] font-black text-white">{productData.rating}</span>
                    <span className="text-[11px] font-bold text-muted-main">({productData.reviewsCount} REVIEWS)</span>
                 </div>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-display font-medium text-white uppercase tracking-tighter leading-none">
                {productData.name}<span className="text-brand">.</span>
              </h1>

              <div className="flex items-center gap-6">
                 <span className="text-4xl font-mono font-bold text-white tracking-widest">{formatPrice(productData.price)}</span>
                 {productData.originalPrice && (
                    <span className="text-xl font-mono text-muted-main line-through opacity-50">{formatPrice(productData.originalPrice)}</span>
                 )}
              </div>
           </div>

           <p className="text-sm text-muted-main leading-relaxed font-light uppercase tracking-widest italic opacity-80 max-w-xl">
              {productData.description}
           </p>

           <div className="space-y-10">
              {/* Color Selection */}
              <div className="space-y-5">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand">Select Palette: <span className="text-white">{selectedColor.name}</span></p>
                 </div>
                 <div className="flex gap-4">
                    {productData.colors.map((color) => (
                       <button 
                         key={color.name}
                         onClick={() => setSelectedColor(color)}
                         className={cn(
                           "w-12 h-12 rounded-full border-2 transition-all p-1 flex items-center justify-center shadow-2xl",
                           selectedColor.name === color.name ? "border-brand scale-110" : "border-white/10 hover:border-white/30"
                         )}
                       >
                          <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                       </button>
                    ))}
                 </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-5">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand">Select Silhouette: <span className="text-white">{selectedSize}</span></p>
                    <button className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-main hover:text-white transition-colors underline decoration-brand/50 underline-offset-4">Dimension Guide</button>
                 </div>
                 <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {productData.sizes.map((size) => (
                       <button 
                         key={size}
                         onClick={() => setSelectedSize(size)}
                         className={cn(
                           "py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                           selectedSize === size ? "bg-brand text-ink border-brand shadow-lg shadow-brand/20" : "bg-surface-3 border-white/5 text-muted-main hover:border-white/20"
                         )}
                       >
                          {size}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Add to Bag Row */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <div className="flex items-center bg-surface-3 border border-white/5 rounded-full p-2 h-16 w-full sm:w-40 justify-between">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                       <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-mono font-bold text-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                       <Plus className="w-4 h-4" />
                    </button>
                 </div>
                 
                 <button 
                   onClick={handleAddToCart}
                   className="flex-1 bg-brand text-ink h-16 rounded-full text-xs font-black uppercase tracking-[0.25em] hover:bg-brand-dim hover:text-white transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-4 group active:scale-95"
                 >
                    <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" /> Add to Shopping Bag
                 </button>

                 <button className="w-16 h-16 bg-surface-3 border border-white/5 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-ink transition-all active:scale-90 group">
                    <Heart className="w-6 h-6 group-hover:fill-current" />
                 </button>
              </div>

              {/* Trust & CTA */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="p-6 bg-surface-2 rounded-3xl border border-white/5 space-y-3 group hover:border-brand/40 transition-all">
                    <Truck className="w-6 h-6 text-brand" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Editorial Delivery</p>
                    <p className="text-[9px] text-muted-main uppercase tracking-widest leading-relaxed">Swift Global Archive Transit. Complimentary for Members.</p>
                 </div>
                 <div className="p-6 bg-surface-2 rounded-3xl border border-white/5 space-y-3 group hover:border-brand/40 transition-all">
                    <RefreshCw className="w-6 h-6 text-brand" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">30-Day Solace</p>
                    <p className="text-[9px] text-muted-main uppercase tracking-widest leading-relaxed">Exquisite Returns & Exchanges for Perpetual Satisfaction.</p>
                 </div>
              </div>
           </div>

           {/* AR Pulse */}
           <div className="p-1 border border-brand/20 rounded-full animate-pulse-slow">
              <button className="w-full py-5 bg-brand/5 backdrop-blur-md rounded-full flex items-center justify-center gap-4 text-brand text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand/10 transition-all border border-brand/10">
                 <Zap className="w-4 h-4" /> Visualize in your space (AR)
              </button>
           </div>
        </div>

      </div>

      {/* Accordions Section */}
      <div className="mt-24 max-w-4xl mx-auto space-y-6">
         {[
           { title: 'Technical Specifications', content: 'Crafted from ultra-premium 450gsm cashmere. Traditional open-weave structure for maximum thermal efficiency and signature editorial drape.' },
           { title: 'Archive Policies', content: 'Each piece is registered with a unique Lumina ID. Dry clean only. Store in a dark, humidity-controlled environment to preserve fiber integrity.' },
           { title: 'Heritage & Origin', content: 'Designed in the Lumina Creative Suite. Fiber sourced from the Gobi Desert. Hand-finished by editorial artisans in our European workshop.' }
         ].map((section, i) => (
           <div key={i} className="border-b border-white/5">
              <button className="w-full py-8 flex justify-between items-center group">
                 <span className="text-xl font-display font-medium text-white uppercase tracking-tight group-hover:text-brand transition-colors">{section.title}</span>
                 <ChevronDown className="w-6 h-6 text-muted-main group-hover:text-brand transition-all" />
              </button>
              <div className="pb-8 text-sm text-muted-main uppercase tracking-widest leading-relaxed opacity-60 font-medium">
                 {section.content}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
