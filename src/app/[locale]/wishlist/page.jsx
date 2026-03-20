'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2, LayoutGrid, Filter } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';

// Mock database to find products by ID
const allProducts = [
  { id: 1, name: 'Editorial Cashmere Scarf', price: 180, originalPrice: 220, brand: 'Editorial', badge: 'Sale', image: 'https://images.unsplash.com/photo-1520903920234-7546ab806509?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Signature Silk Blazer', price: 450, brand: 'Lumina Signature', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Luxury Suit Set', price: 540, originalPrice: 850, brand: 'Onyx Collective', badge: 'Sale', image: 'https://images.unsplash.com/photo-1594932224010-75f430c30225?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Minimalist Tote', price: 120, brand: 'Minimalists', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Editorial Boots', price: 299, brand: 'Editorial', badge: 'New', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Urban Leather Bag', price: 420, brand: 'Onyx Collective', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: 'Minimalist Silk Blouse', price: 150, brand: 'Ethereal', badge: 'New', image: 'https://images.unsplash.com/photo-1539109132314-d4d8b05774d5?auto=format&fit=crop&w=800&q=80' },
  { id: 8, name: 'Signature Shades', price: 80, brand: 'Lumina Signature', badge: 'Essential', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80' },
];

export default function WishlistPage() {
  const { wishlist } = useStore();
  
  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-surface pt-40 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="mb-20 space-y-4">
         <div className="flex items-center gap-3 text-[10px] text-brand font-black uppercase tracking-[0.4em] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-white">Wishlist Silhouette</span>
         </div>
         <h1 className="text-4xl md:text-8xl font-display font-medium text-white uppercase tracking-tighter leading-none">
            Saved <span className="text-brand">Visions.</span>
         </h1>
         <p className="text-sm text-muted-main uppercase tracking-widest font-bold opacity-60 italic max-w-sm">A curated library of your desired editorial pieces, awaiting your final direction.</p>
      </div>

      <AnimatePresence mode="wait">
        {wishlistedProducts.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface-2 p-32 rounded-[60px] border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-10"
          >
             <div className="w-24 h-24 bg-surface-3 rounded-full flex items-center justify-center text-muted-main/20">
                <Heart className="w-12 h-12" />
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-display font-medium text-white uppercase tracking-tight">The library is vacant.</h2>
                <p className="text-sm text-muted-main uppercase tracking-widest font-bold opacity-60">Explore our editorial halls and discover silhouettes worthy of your collection.</p>
             </div>
             <Link 
               href="/shop" 
               className="bg-brand text-ink px-12 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-brand-dim hover:text-white transition-all shadow-xl shadow-brand/20 active:scale-95"
             >
               Browse The Collection
             </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Recommended for you footer (placeholder) */}
      {wishlistedProducts.length > 0 && (
        <div className="mt-32 pt-24 border-t border-white/5">
           <div className="flex justify-between items-end mb-16">
              <div className="space-y-4">
                 <p className="text-xs text-brand font-bold uppercase tracking-[0.3em]">Complementary Core</p>
                 <h2 className="text-3xl font-display font-medium text-white uppercase tracking-tight">Recommendations</h2>
              </div>
              <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-muted-main hover:text-white transition-colors flex items-center gap-3">
                 Explore All <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
              {allProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="space-y-4 cursor-not-allowed">
                   <div className="relative aspect-[3/4] rounded-2xl overflow-hidden grayscale">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                   </div>
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40">{p.name}</h5>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
