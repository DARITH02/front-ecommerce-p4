'use client';

import { useState } from 'react';
import { LayoutGrid, List, ChevronDown, Filter, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import FilterSidebar from '@/components/filters/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const shopProducts = [
  { id: 1, name: 'Editorial Cashmere Scarf', price: 180, originalPrice: 220, brand: 'Editorial', badge: 'Sale', image: 'https://images.unsplash.com/photo-1520903920234-7546ab806509?auto=format&fit=crop&w=800&q=80', secondaryImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Signature Silk Blazer', price: 450, brand: 'Lumina Signature', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Luxury Suit Set', price: 540, originalPrice: 850, brand: 'Onyx Collective', badge: 'Sale', image: 'https://images.unsplash.com/photo-1594932224010-75f430c30225?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Minimalist Tote', price: 120, brand: 'Minimalists', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Editorial Boots', price: 299, brand: 'Editorial', badge: 'New', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', secondaryImage: 'https://images.unsplash.com/photo-1533659011278-f32775798953?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Urban Leather Bag', price: 420, brand: 'Onyx Collective', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: 'Minimalist Silk Blouse', price: 150, brand: 'Ethereal', badge: 'New', image: 'https://images.unsplash.com/photo-1539109132314-d4d8b05774d5?auto=format&fit=crop&w=800&q=80' },
  { id: 8, name: 'Signature Shades', price: 80, brand: 'Lumina Signature', badge: 'Essential', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80' },
];

export default function ShopPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [sortOption, setSortOption] = useState('Latest');

  return (
    <div className="bg-surface pt-32 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="mb-16 space-y-6">
        <div className="flex items-center gap-3 text-[10px] text-muted-main uppercase tracking-[0.3em] font-black">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="text-white">Shop All Collections</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-display font-medium text-white uppercase tracking-tighter leading-[0.85]">
          All Pieces<span className="text-brand">.</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[300px] shrink-0">
           <FilterSidebar className="sticky top-28 h-[calc(100vh-140px)] overflow-y-auto pr-8" />
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 space-y-12">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-2 p-6 rounded-3xl border border-white/5 gap-6 backdrop-blur-xl sticky top-24 z-30 shadow-2xl shadow-black/20">
             <div className="flex items-center gap-6">
                <span className="text-xs text-muted-main uppercase tracking-widest font-bold">
                  Showing <b>{shopProducts.length}</b> result{shopProducts.length !== 1 ? 's' : ''}
                </span>
                
                {/* View Toggles */}
                <div className="h-10 px-1 bg-surface-3 rounded-xl border border-white/5 flex items-center">
                   <button 
                     onClick={() => setViewMode('grid')}
                     className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-ink shadow-lg scale-105" : "text-muted-main hover:text-white")}
                   >
                     <LayoutGrid className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => setViewMode('list')}
                     className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-ink shadow-lg scale-105" : "text-muted-main hover:text-white")}
                   >
                     <List className="w-4 h-4" />
                   </button>
                </div>
             </div>

             <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setShowFiltersMobile(true)}
                  className="flex-1 sm:hidden flex items-center justify-center gap-4 bg-brand text-ink py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand/30 active:scale-95 transition-all group"
                >
                  <div className="flex flex-col gap-1 transition-transform group-active:scale-90">
                     <div className="w-5 h-0.5 bg-ink rounded-full" />
                     <div className="w-5 h-0.5 bg-ink rounded-full" />
                     <div className="w-3 h-0.5 bg-ink rounded-full" />
                  </div>
                  Refine Collection
                </button>

               <div className="relative group flex-1 sm:w-48">
                  <button className="w-full flex justify-between items-center bg-surface-3 border border-white/10 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group-hover:border-brand/40 group-hover:bg-surface-2">
                    Sort: {sortOption} <ChevronDown className="w-4 h-4 text-brand" />
                  </button>
                  {/* Dropdown would go here */}
               </div>
             </div>
          </div>

          {/* Active Chips placeholder */}
          <div className="flex flex-wrap gap-2">
             <div className="bg-brand/10 border border-brand/20 text-brand px-4 py-1.5 rounded-full text-[10px] uppercase font-black flex items-center gap-2 tracking-widest cursor-pointer hover:bg-brand hover:text-white transition-all">
               $0 - $500 <X className="w-3 h-3" />
             </div>
             <div className="bg-white/5 border border-white/10 text-white px-4 py-1.5 rounded-full text-[10px] uppercase font-black flex items-center gap-2 tracking-widest cursor-pointer hover:bg-red-500 hover:text-white transition-all">
               Cream <X className="w-3 h-3" />
             </div>
          </div>

          {/* Grid Container */}
          <div className={cn(
             "grid gap-8 lg:gap-12 transition-all duration-500",
             viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          )}>
            {shopProducts.map((product) => (
               <ProductCard key={product.id} product={product} view={viewMode} />
            ))}
          </div>

          {/* Load More Fallback / Skeleton placeholder */}
          <div className="pt-12 text-center">
             <button className="group flex items-center gap-4 mx-auto bg-surface-3 border border-white/5 px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-brand hover:text-ink transition-all hover:pr-16 active:scale-95 shadow-xl">
               Load Next Collection <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
             </button>
          </div>
        </div>

      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowFiltersMobile(false)}
               className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200]"
            />
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-surface shadow-3xl z-[201] flex flex-col border-l border-white/5"
            >
               <div className="flex justify-between items-center p-8 md:p-12 border-b border-white/5">
                  <h3 className="text-2xl md:text-3xl font-display font-medium text-white uppercase tracking-tight">Refine All</h3>
                  <button onClick={() => setShowFiltersMobile(false)} className="p-3 bg-surface-3 rounded-full hover:bg-brand transition-colors group">
                     <X className="w-5 h-5 group-hover:text-ink" />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto px-8 md:px-12 py-12 scrollbar-hide">
                  <FilterSidebar />
               </div>
               <div className="p-8 md:p-12 bg-surface-2 border-t border-white/5">
                  <button onClick={() => setShowFiltersMobile(false)} className="bg-brand text-ink w-full py-5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                     Apply All Selection
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
