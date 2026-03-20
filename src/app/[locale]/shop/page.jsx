'use client';

import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, List, ChevronDown, Filter, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import FilterSidebar from '@/components/filters/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';
import { cn, resolveImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api/client';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [sortOption, setSortOption] = useState('latest'); // Changed to lowercase for easier matching
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    price: [0, 30000], // Default high max until products are loaded
    colors: [],
    sizes: [],
    brands: [],
  });
  const [maxPrice, setMaxPrice] = useState(30000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.products.getAll();
        const fetchedProducts = response.data || response;
        
        const mappedProducts = Array.isArray(fetchedProducts) ? fetchedProducts.map(p => {
          const currentPrice = parseFloat(p.sale_price || p.price);
          const basePrice = parseFloat(p.price);
          const hasPromotion = p.sale_price && parseFloat(p.sale_price) < basePrice;
          
          return {
            ...p,
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: currentPrice,
            originalPrice: hasPromotion ? basePrice : null,
            image: resolveImageUrl(p.images?.[0]?.image_url || p.images?.[0]?.image_path || p.image_url || p.image_path || p.image),
            secondaryImage: resolveImageUrl(p.images?.[1]?.image_url || p.images?.[1]?.image_path || p.images?.[0]?.image_url || p.image_url),
            badge: hasPromotion ? 'Sale' : (p.is_new ? 'New' : null),
            brand: p.brand?.name || (p.brand_id ? `Brand ${p.brand_id}` : 'Exclusive Selection'),
            colors: p.colors || [], // Ensure colors are present for filtering
            sizes: p.sizes || [],   // Ensure sizes are present
          };
        }) : [];

        setProducts(mappedProducts);
        
        // Calculate max price from products
        if (mappedProducts.length > 0) {
          const highest = Math.ceil(Math.max(...mappedProducts.map(p => p.price)));
          setMaxPrice(highest);
          setActiveFilters(prev => ({ ...prev, price: [0, highest] }));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Basic Filtering (Client-side for now, can be moved to API later)
    if (activeFilters.colors.length > 0) {
      result = result.filter(p => p.colors?.some(c => activeFilters.colors.includes(c.name || c)));
    }
    if (activeFilters.sizes.length > 0) {
      result = result.filter(p => p.sizes?.some(s => activeFilters.sizes.includes(s)));
    }
    if (activeFilters.price) {
      result = result.filter(p => p.price >= activeFilters.price[0] && p.price <= activeFilters.price[1]);
    }

    // Sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'latest':
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return result;
  }, [products, sortOption, activeFilters]);

  const sortLabels = {
    'latest': 'Latest Arrival',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
    'alphabetical': 'Alphabetical',
  };

  return (
    <div className="bg-background pt-32 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="mb-16 space-y-6">
        <div className="flex items-center gap-3 text-[10px] text-muted-main uppercase tracking-[0.3em] font-black">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <span className="w-1 h-1 bg-border-custom rounded-full" />
          <span className="text-text-main">Shop All Collections</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-display font-medium text-text-main uppercase tracking-tighter leading-[0.85]">
          All Pieces<span className="text-brand">.</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[300px] shrink-0">
           <FilterSidebar 
             filters={activeFilters} 
             onFilterChange={setActiveFilters}
             maxPrice={maxPrice}
             className="sticky top-28 h-[calc(100vh-140px)] overflow-y-auto pr-8" 
           />
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 space-y-12">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-2 p-6 rounded-3xl border border-border-custom gap-6 backdrop-blur-xl sticky top-24 z-30 shadow-2xl shadow-black/20">
             <div className="flex items-center gap-6">
                <span className="text-xs text-muted-main uppercase tracking-widest font-bold">
                  Showing <b>{filteredAndSortedProducts.length}</b> result{filteredAndSortedProducts.length !== 1 ? 's' : ''}
                </span>
                
                {/* View Toggles */}
                <div className="h-10 px-1 bg-surface-3 rounded-xl border border-border-custom flex items-center">
                   <button 
                     onClick={() => setViewMode('grid')}
                     className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-foreground text-background shadow-lg scale-105" : "text-muted-main hover:text-foreground")}
                   >
                     <LayoutGrid className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => setViewMode('list')}
                     className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-foreground text-background shadow-lg scale-105" : "text-muted-main hover:text-foreground")}
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
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="w-full flex justify-between items-center bg-surface-3 border border-border-custom px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:border-brand/40 hover:bg-surface-2"
                  >
                    Sort: {sortLabels[sortOption]} <ChevronDown className={cn("w-4 h-4 text-brand transition-transform", isSortOpen && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-surface-2 border border-border-custom rounded-xl overflow-hidden z-50 shadow-3xl"
                      >
                        {Object.entries(sortLabels).map(([value, label]) => (
                          <button
                            key={value}
                            onClick={() => { setSortOption(value); setIsSortOpen(false); }}
                            className={cn(
                              "w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                              sortOption === value ? "bg-brand text-ink" : "text-muted-main hover:bg-surface-3"
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
             </div>
          </div>

          {/* Active Chips placeholder */}
          <div className="flex flex-wrap gap-2">
             {activeFilters.colors.map(color => (
               <div 
                 key={color} 
                 onClick={() => setActiveFilters(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }))}
                 className="bg-brand/10 border border-brand/20 text-brand px-4 py-1.5 rounded-full text-[10px] uppercase font-black flex items-center gap-2 tracking-widest cursor-pointer hover:bg-brand hover:text-ink transition-all"
               >
                 {color} <X className="w-3 h-3" />
               </div>
             ))}
             {activeFilters.sizes.map(size => (
               <div 
                 key={size} 
                 onClick={() => setActiveFilters(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }))}
                 className="bg-surface-3 border border-border-custom text-text-main px-4 py-1.5 rounded-full text-[10px] uppercase font-black flex items-center gap-2 tracking-widest cursor-pointer hover:bg-brand hover:text-ink transition-all"
               >
                 {size} <X className="w-3 h-3" />
               </div>
             ))}
          </div>

          {/* Grid Container */}
          <div className={cn(
             "grid gap-8 lg:gap-12 transition-all duration-500",
             viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          )}>
            {loading ? (
              // Loading Skeleton
              [...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-surface-3 animate-pulse" />
              ))
            ) : (
              filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} view={viewMode} />
              ))
            )}
          </div>

          {/* Load More Fallback / Skeleton placeholder */}
          <div className="pt-12 text-center">
             <button className="group flex items-center gap-4 mx-auto bg-surface-3 border border-border-custom px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.25em] text-text-main hover:bg-brand hover:text-ink transition-all hover:pr-16 active:scale-95 shadow-xl">
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
               className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[200]"
            />
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-surface shadow-3xl z-[201] flex flex-col border-l border-border-custom"
            >
               <div className="flex justify-between items-center p-8 md:p-12 border-b border-border-custom">
                  <h3 className="text-2xl md:text-3xl font-display font-medium text-text-main uppercase tracking-tight">Refine All</h3>
                  <button onClick={() => setShowFiltersMobile(false)} className="p-3 bg-surface-3 rounded-full hover:bg-brand transition-colors group">
                     <X className="w-5 h-5 group-hover:text-ink" />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto px-8 md:px-12 py-12 scrollbar-hide">
                  <FilterSidebar filters={activeFilters} onFilterChange={setActiveFilters} maxPrice={maxPrice} />
               </div>
               <div className="p-8 md:p-12 bg-surface-2 border-t border-border-custom">
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
