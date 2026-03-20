'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight, Sparkles, Filter, LayoutGrid, History, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice, resolveImageUrl } from '@/lib/utils';
import { api } from '@/lib/api/client';

const trendingTerms = ['Cashmere Editorial', 'Signature Blazer', 'Onyx Collective', 'Minimalists Tote'];

export default function SearchOverlay() {
  const { isSearchOpen, toggleSearch, recentSearches, addRecentSearch, removeRecentSearch } = useStore();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
       setTimeout(() => inputRef.current?.focus(), 100);
       fetchSuggestions();
    }
  }, [isSearchOpen]);

  const fetchSuggestions = async () => {
    try {
      const response = await api.products.getAll('?limit=3');
      const fetchedProducts = response.data || response;
      
      const mappedSuggestions = Array.isArray(fetchedProducts) ? fetchedProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.sale_price || p.price,
        image: p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=400&q=80'
      })) : [];

      setSuggestions(mappedSuggestions);
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
       addRecentSearch(query.trim());
       // Navigate would go here
       toggleSearch();
    }
  };

  return (
    <AnimatePresence>
       {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[750] bg-surface/90 backdrop-blur-3xl overflow-hidden p-6 md:p-12 lg:p-24"
          >
             <button 
                onClick={toggleSearch}
                className="absolute top-12 right-12 w-16 h-16 bg-surface-3 border border-border-custom rounded-full flex items-center justify-center text-text-main hover:bg-brand hover:text-ink transition-all shadow-2xl z-50 group"
             >
                <X className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
             </button>

             <div className="max-w-7xl mx-auto space-y-24">
                {/* Search Bar */}
                <form onSubmit={handleSubmit} className="relative group border-b border-brand/20 pb-12">
                   <input 
                     ref={inputRef}
                     type="text" 
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="QUERY THE EDITORIAL CORE..." 
                     className="w-full bg-transparent text-5xl md:text-8xl font-display font-medium text-text-main placeholder:text-muted-main focus:outline-none uppercase tracking-tighter"
                   />
                   <div className="flex items-center gap-6 mt-8">
                      <div className="flex items-center gap-3 bg-brand/10 border border-brand/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-brand">
                         <Search className="w-4 h-4" /> Global Index Active
                      </div>
                      <p className="text-sm text-muted-main uppercase tracking-widest font-bold opacity-40 italic">Hit enter to initiate deep scan across the 2.5k collections.</p>
                   </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                   {/* Left: History & Trending */}
                   <div className="space-y-16">
                      <div className="space-y-8">
                         <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-brand border-b border-border-custom pb-4">
                           <History className="w-4 h-4" /> Editorial History
                         </h4>
                         <div className="flex flex-wrap gap-3">
                            {recentSearches.length > 0 ? (
                               recentSearches.map((term, i) => (
                                  <div key={i} className="group flex items-center gap-4 bg-surface-2 border border-border-custom px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-ink transition-all cursor-pointer">
                                     {term}
                                     <button onClick={(e) => { e.stopPropagation(); removeRecentSearch(term); }} className="p-1 hover:bg-ink rounded-full transition-colors group-hover:text-white"><X className="w-3 h-3" /></button>
                                  </div>
                               ))
                            ) : (
                               <p className="text-sm text-muted-main uppercase tracking-widest font-bold opacity-40 italic">Empty Silhouettes</p>
                            )}
                         </div>
                      </div>

                      <div className="space-y-8">
                         <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-brand border-b border-border-custom pb-4">
                           <TrendingUp className="w-4 h-4" /> Trending Scans
                         </h4>
                         <div className="space-y-4">
                            {trendingTerms.map((term, i) => (
                               <button 
                                 key={i}
                                 onClick={() => setQuery(term)}
                                 className="flex items-center justify-between w-full group py-2"
                               >
                                  <span className="text-lg font-display text-text-main group-hover:text-brand transition-colors uppercase tracking-tight">{term}</span>
                                  <ExternalLink className="w-4 h-4 text-muted-main group-hover:text-brand transition-all opacity-0 group-hover:opacity-100" />
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Right: Recommendations */}
                   <div className="lg:col-span-2 space-y-12">
                      <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-brand border-b border-border-custom pb-4">
                        Curated Recommendations
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                         {loading ? (
                           [...Array(3)].map((_, i) => (
                             <div key={i} className="aspect-[3/4] rounded-2xl bg-surface-3 animate-pulse" />
                           ))
                         ) : (
                           suggestions.map((p, idx) => (
                              <Link 
                                key={idx} 
                                href={`/product/${p.slug || p.id}`}
                                onClick={toggleSearch}
                                className="group space-y-4"
                              >
                                 <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border-custom group-hover:scale-105 transition-transform duration-700">
                                    <Image src={resolveImageUrl(p.image)} alt={p.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </div>
                                 <div className="space-y-1">
                                    <h5 className="text-sm font-bold uppercase tracking-widest text-text-main group-hover:text-brand transition-colors truncate">{p.name}</h5>
                                    <p className="text-xs font-mono font-bold text-muted-main">{formatPrice(p.price)}</p>
                                 </div>
                              </Link>
                           ))
                         )}
                      </div>
                      
                      <button className="w-full flex items-center justify-between bg-surface-2 border border-border-custom p-8 rounded-3xl group hover:border-brand/40 transition-all shadow-2xl">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-surface-3 rounded-2xl flex items-center justify-center text-brand text-text-main">
                               <ShoppingBag className="w-8 h-8" />
                            </div>
                            <div className="text-left space-y-1">
                               <h4 className="text-xl font-display text-text-main uppercase tracking-tight">Browse Editorial Hall</h4>
                               <p className="text-[10px] text-muted-main uppercase tracking-[0.3em] font-black">2,500+ Curated Silhouette Artifacts</p>
                            </div>
                         </div>
                         <ArrowRight className="w-8 h-8 text-muted-main group-hover:text-brand group-hover:translate-x-2 transition-all" />
                      </button>
                   </div>
                </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute bottom-12 left-12 opacity-[0.03] select-none pointer-events-none text-9xl font-black italic tracking-tighter uppercase leading-none">QUERY CORE</div>
          </motion.div>
       )}
    </AnimatePresence>
  );
}
