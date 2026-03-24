'use client';

import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, List, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { Link } from '@/i18n/routing';
import FilterSidebar from '@/components/filters/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';
import { cn, resolveImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api/client';

const SORT_OPTIONS = {
  latest:      'Latest',
  'price-low': 'Price: Low → High',
  'price-high':'Price: High → Low',
  alphabetical:'A → Z',
};

export default function ShopPage() {
  const [products, setProducts]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [viewMode, setViewMode]               = useState('grid');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [sortOption, setSortOption]           = useState('latest');
  const [isSortOpen, setIsSortOpen]           = useState(false);
  const [maxPrice, setMaxPrice]               = useState(30000);
  const [activeFilters, setActiveFilters]     = useState({
    price: [0, 30000],
    colors: [],
    sizes: [],
    brands: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.products.getAll();
        const raw = response.data || response;
        const mapped = Array.isArray(raw) ? raw.map(p => {
          const currentPrice = parseFloat(p.sale_price || p.price);
          const basePrice    = parseFloat(p.price);
          const hasPromo     = p.sale_price && parseFloat(p.sale_price) < basePrice;
          return {
            ...p,
            price: currentPrice,
            originalPrice: hasPromo ? basePrice : null,
            image: resolveImageUrl(p.images?.[0]?.image_url || p.images?.[0]?.image_path || p.image_url || p.image),
            secondaryImage: resolveImageUrl(p.images?.[1]?.image_url || p.images?.[0]?.image_url || p.image_url),
            badge: hasPromo ? 'Sale' : (p.is_new ? 'New' : null),
            brand: p.brand?.name || 'Exclusive Selection',
            colors: p.colors || [],
            sizes:  p.sizes  || [],
          };
        }) : [];
        setProducts(mapped);
        if (mapped.length > 0) {
          const highest = Math.ceil(Math.max(...mapped.map(p => p.price)));
          setMaxPrice(highest);
          setActiveFilters(prev => ({ ...prev, price: [0, highest] }));
        }
      } catch (e) {
        console.error('Failed to fetch products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let r = [...products];
    if (activeFilters.colors.length)
      r = r.filter(p => p.colors?.some(c => activeFilters.colors.includes(c.name || c)));
    if (activeFilters.sizes.length)
      r = r.filter(p => p.sizes?.some(s => activeFilters.sizes.includes(s)));
    if (activeFilters.price)
      r = r.filter(p => p.price >= activeFilters.price[0] && p.price <= activeFilters.price[1]);
    switch (sortOption) {
      case 'price-low':    r.sort((a, b) => a.price - b.price); break;
      case 'price-high':   r.sort((a, b) => b.price - a.price); break;
      case 'alphabetical': r.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:             r.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return r;
  }, [products, sortOption, activeFilters]);

  const removeColor = c => setActiveFilters(p => ({ ...p, colors: p.colors.filter(x => x !== c) }));
  const removeSize  = s => setActiveFilters(p => ({ ...p, sizes:  p.sizes.filter(x => x !== s) }));
  const hasChips    = activeFilters.colors.length > 0 || activeFilters.sizes.length > 0;

  return (
    <div className="min-h-screen bg-background text-text-main pt-32 pb-24 transition-colors duration-500">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        {/* ── Header ── */}
        <div className="mb-14">
          <div className="flex items-center gap-2 text-[11px] font-medium text-white/30 tracking-widest uppercase mb-6">
            <Link href="/" className="hover:text-muted-main transition-colors">Home</Link>
            <span>/</span>
            <span className="text-muted-main font-bold">Shop</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-[48px] md:text-[72px] font-bold tracking-[-3px] leading-none">
              All Pieces
            </h1>
            {!loading && (
              <p className="text-[13px] text-muted-main font-medium pb-2 uppercase tracking-widest">
                 {filtered.length} item{filtered.length !== 1 ? 's' : ''} detected
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-10 items-start">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-[220px] shrink-0 sticky top-28">
            <FilterSidebar
              filters={activeFilters}
              onFilterChange={setActiveFilters}
              maxPrice={maxPrice}
            />
          </aside>

          {/* ── Right Column ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Control bar */}
            <div className="flex items-center justify-between gap-4">

              {/* Left: view toggles + mobile filter */}
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/[0.07]">
                  {[
                    { mode: 'grid', Icon: LayoutGrid },
                    { mode: 'list', Icon: List },
                  ].map(({ mode, Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        viewMode === mode
                          ? 'bg-brand text-ink shadow-lg shadow-brand/20'
                          : 'text-muted-main hover:text-text-main hover:bg-surface-3'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                {/* Mobile filter trigger */}
                <button
                  onClick={() => setShowFiltersMobile(true)}
                  className="lg:hidden flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-custom bg-surface-2 text-[12px] font-black uppercase tracking-widest text-muted-main hover:text-brand hover:border-brand/40 transition-all active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Editorial Filters
                </button>
              </div>

              {/* Right: sort */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(v => !v)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-custom bg-surface-2 text-[12px] font-black uppercase tracking-widest text-muted-main hover:text-brand hover:border-brand/40 transition-all active:scale-95"
                >
                  <span className="opacity-40">Sort:</span> {SORT_OPTIONS[sortOption]}
                  <ChevronDown className={cn('w-4 h-4 transition-transform duration-500', isSortOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border-custom bg-surface-2 shadow-2xl z-50 overflow-hidden"
                    >
                      {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => { setSortOption(value); setIsSortOpen(false); }}
                          className={cn(
                            'w-full text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all',
                            sortOption === value
                              ? 'text-brand bg-brand/5'
                              : 'text-muted-main hover:text-text-main hover:bg-surface-3'
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

            {/* Active filter chips */}
            <AnimatePresence>
              {hasChips && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 overflow-hidden"
                >
                  {activeFilters.colors.map(c => (
                    <button
                      key={c}
                      onClick={() => removeColor(c)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-custom bg-surface-2 text-[10px] font-black uppercase tracking-widest text-muted-main hover:text-brand hover:border-brand/40 transition-all"
                    >
                      {c} <X className="w-3.5 h-3.5" />
                    </button>
                  ))}
                  {activeFilters.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => removeSize(s)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-custom bg-surface-2 text-[10px] font-black uppercase tracking-widest text-muted-main hover:text-brand hover:border-brand/40 transition-all"
                    >
                      {s} <X className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product grid */}
            {loading ? (
              <div className={cn(
                'grid gap-5',
                'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
              )}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-3xl skeleton" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-32 rounded-[40px] border border-dashed border-border-custom relative overflow-hidden group/empty">
                <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover/empty:opacity-100 transition-opacity" />
                <p className="text-[14px] font-black uppercase tracking-[0.2em] text-muted-main relative z-10">Editorial Selection Empty</p>
                <button
                  onClick={() => setActiveFilters({ price: [0, maxPrice], colors: [], sizes: [], brands: [] })}
                  className="text-[12px] text-muted-main hover:text-text-main transition-colors relative z-10"
                >
                  <span className="relative z-10 underline underline-offset-8">Purge Search Filters</span>
                </button>
             </div>
            ) : (
              <div className={cn(
                'grid gap-5 transition-all duration-300',
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}>
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} view={viewMode} />
                ))}
              </div>
            )}

            {/* Load more */}
            {!loading && filtered.length > 0 && (
              <div className="pt-8 flex justify-center">
                <button className="flex items-center gap-4 px-12 py-5 rounded-full border border-border-custom bg-surface-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-main hover:text-text-main hover:border-brand/40 transition-all shadow-xl active:scale-95">
                  Expand Collection <ChevronDown className="w-4 h-4 text-brand animate-bounce" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Sheet ── */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-background z-[201] flex flex-col border-l border-border-custom shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-10 py-8 border-b border-border-custom">
                <h3 className="text-2xl font-display font-medium uppercase tracking-tight">Editorial Filters</h3>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-3 hover:bg-brand hover:text-ink transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable filters */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <FilterSidebar
                  filters={activeFilters}
                  onFilterChange={setActiveFilters}
                  maxPrice={maxPrice}
                />
              </div>

              {/* Footer CTA */}
              <div className="px-10 py-8 border-t border-border-custom bg-surface-2/50">
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="w-full py-6 rounded-3xl bg-brand text-ink text-[12px] font-black uppercase tracking-widest hover:bg-ink hover:text-brand transition-all shadow-xl shadow-brand/20 active:scale-95"
                >
                  Reveal {filtered.length} Selection{filtered.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}