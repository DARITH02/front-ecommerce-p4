'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Heart, Plus } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice, resolveImageUrl } from '@/lib/utils';
import QuickView from './QuickView';

export default function ProductCard({ product, view = 'grid' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart, wishlist, toggleWishlist, setMiniCartOpen } = useStore();
  
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setMiniCartOpen(true);
  };

  if (view === 'list') {
    return (
      <motion.div 
        layout
        className="group flex flex-col md:flex-row gap-8 bg-surface-2 border border-border-custom hover:border-brand/40 transition-all p-6 rounded-3xl"
      >
        <div className="relative w-full md:w-72 aspect-[3/4] rounded-2xl overflow-hidden shrink-0">
           <Image 
             src={resolveImageUrl((isHovered && product.secondaryImage) ? product.secondaryImage : (product.image || product.image_url)) || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=800&q=80'} 
             alt={product.name} 
             fill 
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
             className="object-cover transition-all duration-1000"
           />
           <button 
             onClick={() => toggleWishlist(product.id)}
             className={cn(
               "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all",
               isWishlisted ? "bg-brand text-ink" : "bg-surface-3/40 backdrop-blur-md text-foreground hover:bg-brand"
             )}
           >
             <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
           </button>
        </div>

        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <p className="text-[10px] text-brand font-bold uppercase tracking-[0.3em]">{product.brand}</p>
                  <h3 className="text-3xl font-display font-medium text-text-main group-hover:text-brand transition-colors uppercase leading-[1]">
                     {product.name}
                  </h3>
               </div>
               <p className="text-2xl font-mono font-bold text-text-main tracking-tighter">
                 {formatPrice(product.price)}
               </p>
            </div>
            <p className="text-muted-main text-sm leading-relaxed max-w-xl line-clamp-3">
              {product.description || "Experience the pinnacle of luxury-minimalist craftsmanship. Meticulously designed for editorial flair and timeless style."}
            </p>
            
            <div className="flex gap-4">
               {product.colors?.map((color, idx) => (
                 <div key={idx} className="w-6 h-6 rounded-full border border-white/20 p-0.5 group/swatch cursor-pointer">
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                 </div>
               ))}
            </div>
          </div>

          <div className="flex gap-4 pt-8">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-brand text-ink py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-ink hover:text-brand transition-all shadow-xl shadow-brand/10 flex items-center justify-center gap-3"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
            </button>
            <button 
               onClick={() => setIsQuickViewOpen(true)}
               className="w-16 h-16 bg-surface-3 text-foreground border border-border-custom rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group flex flex-col gap-6"
    >
      <div 
        className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-surface-3 shadow-sm border border-border-custom group-hover:border-brand/30 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image 
          src={resolveImageUrl((isHovered && product.secondaryImage) ? product.secondaryImage : (product.image || product.image_url)) || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=800&q=80'} 
          alt={product.name} 
          fill 
          className="object-cover transition-all duration-1000 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {product.badge && (
            <span className={cn(
              "text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest pointer-events-none drop-shadow-lg",
              product.badge === 'Sale' ? 'bg-brand text-ink' : 
              product.badge === 'New' ? 'bg-mint text-ink' : 'bg-gold text-ink'
            )}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Heart Wishlist */}
        <button 
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 opacity-0 group-hover:opacity-100",
            isWishlisted ? "bg-brand text-ink opacity-100" : "bg-surface-3/40 backdrop-blur-md text-foreground hover:bg-brand"
          )}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </button>

        {/* Quick Add Button Slider */}
        <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 z-20">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-background text-text-main py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand hover:text-ink transition-all shadow-2xl flex items-center justify-center gap-2 border border-border-custom"
          >
            <Plus className="w-4 h-4" /> Quick Addition
          </button>
        </div>

        {/* Quick View Trigger Desktop */}
        <div 
          onClick={(e) => { e.stopPropagation(); setIsQuickViewOpen(true); }}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 cursor-pointer"
        >
           <div className="w-12 h-12 bg-surface/20 backdrop-blur-md border border-border-custom rounded-full flex items-center justify-center text-foreground scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
             <Eye className="w-5 h-5" />
           </div>
        </div>
      </div>

      <Link href={`/product/${product.slug || product.id}`} className="space-y-2 group/info cursor-pointer block">
        <div className="flex justify-between items-start gap-4">
           <h4 className="text-xl font-display font-medium text-text-main group-hover/info:text-brand transition-colors line-clamp-1 truncate uppercase tracking-tighter">
             {product.name}
           </h4>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-lg font-mono font-bold text-text-main tracking-tighter">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-xs font-mono text-muted-main line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
      </Link>

      <QuickView 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </motion.div>
  );
}
