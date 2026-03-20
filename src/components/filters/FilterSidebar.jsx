'use client';

import { useState } from 'react';
import { Search, ChevronDown, Check, Star, X, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Cream', hex: '#FDF5E6' },
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Oatmeal', hex: '#E5D3B3' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Brand', hex: '#FF4D00' },
];

const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

const brands = [
  { name: 'Lumina Signature', count: 24 },
  { name: 'Onyx Collective', count: 18 },
  { name: 'Ethereal', count: 12 },
  { name: 'Editorial', count: 32 },
  { name: 'Minimalists', count: 14 },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border-custom py-8 first:pt-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group"
      >
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand group-hover:text-text-main transition-colors">
          {title}
        </h4>
        <div className={cn("p-1.5 bg-surface-3 rounded-lg border border-border-custom transition-transform duration-500", !isOpen && "-rotate-180")}>
           <ChevronDown className="w-3 h-3 text-muted-main" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8">
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FilterSidebar({ className, filters, onFilterChange, maxPrice = 2000 }) {
  const toggleFilter = (type, value) => {
    onFilterChange(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(v => v !== value) 
        : [...prev[type], value]
    }));
  };

  const handlePriceChange = (index, value) => {
    const val = value === '' ? 0 : parseInt(value);
    const newPrice = [...filters.price];
    newPrice[index] = val;
    onFilterChange(prev => ({
      ...prev,
      price: newPrice
    }));
  };

  return (
    <aside className={cn("flex flex-col gap-0", className)}>
      
      {/* Search within Category */}
      <div className="pb-8 border-b border-border-custom">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search items..." 
            className="w-full bg-surface-2 border border-border-custom px-12 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest focus:outline-none focus:border-brand/40 transition-all placeholder:text-muted-main/40 text-text-main"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main group-focus-within:text-brand transition-colors" />
        </div>
      </div>

      {/* Accordion Sections */}
      <FilterSection title="Price Range">
        <div className="space-y-6">
           <div className="flex justify-between items-center px-2">
             <span className="text-[10px] font-mono font-bold text-muted-main uppercase tracking-widest">$0</span>
             <span className="text-[10px] font-mono font-bold text-text-main uppercase tracking-widest">${maxPrice.toLocaleString()}+</span>
           </div>
           <div className="relative h-6 flex items-center">
              <div className="absolute w-full h-1.5 bg-surface-3 rounded-full" />
              <div className="absolute h-1.5 bg-brand rounded-full shadow-[0_0_15px_rgba(255,77,0,0.3)] transition-all" style={{ left: `${(filters.price[0] / maxPrice) * 100}%`, width: `${((filters.price[1] - filters.price[0]) / maxPrice) * 100}%` }} />
              <input 
                type="range" 
                min="0" 
                max={maxPrice} 
                value={filters.price[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand" 
              />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-3/50 p-4 rounded-2xl border border-border-custom relative group hover:border-brand/20 transition-all">
                 <span className="absolute -top-2 left-4 bg-surface-2 px-2 text-[8px] font-black uppercase text-muted-main">From</span>
                 <div className="flex items-center">
                    <span className="text-sm font-mono font-bold opacity-40 mr-1">$</span>
                    <input 
                       type="number" 
                       value={filters.price[0]}
                       onChange={(e) => handlePriceChange(0, e.target.value)}
                       className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none border-none p-0"
                    />
                 </div>
              </div>
              <div className="bg-surface-3/50 p-4 rounded-2xl border border-border-custom relative group hover:border-brand/20 transition-all">
                 <span className="absolute -top-2 left-4 bg-surface-2 px-2 text-[8px] font-black uppercase text-muted-main">To</span>
                 <div className="flex items-center">
                    <span className="text-sm font-mono font-bold opacity-40 mr-1">$</span>
                    <input 
                       type="number" 
                       value={filters.price[1]}
                       onChange={(e) => handlePriceChange(1, e.target.value)}
                       className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none border-none p-0"
                    />
                 </div>
              </div>
           </div>
        </div>
      </FilterSection>

      <FilterSection title="Colors Palette">
        <div className="grid grid-cols-4 gap-y-6 gap-x-4">
          {colors.map((color) => {
             const isSelected = filters.colors.includes(color.name);
             return (
               <button 
                 key={color.name}
                 onClick={() => toggleFilter('colors', color.name)}
                 className="flex flex-col items-center gap-3 group relative"
               >
                 <div 
                   className={cn(
                     "w-12 h-12 rounded-2xl border-2 transition-all flex items-center justify-center p-1 overflow-hidden",
                     isSelected ? "border-brand scale-110 rotate-3 shadow-xl shadow-brand/20" : "border-border-custom hover:border-foreground/30"
                   )}
                 >
                    <div className="w-full h-full rounded-xl shadow-inner" style={{ backgroundColor: color.hex }} />
                    {isSelected && <Check className={cn("w-4 h-4 absolute z-10", color.name === 'White' ? 'text-ink' : 'text-background')} />}
                 </div>
                 <span className={cn("text-[8px] uppercase tracking-widest transition-colors font-black", isSelected ? "text-brand" : "text-muted-main")}>
                   {color.name}
                 </span>
               </button>
             );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Sizes Grid">
        <div className="grid grid-cols-4 gap-3">
          {sizes.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button 
                key={size}
                onClick={() => toggleFilter('sizes', size)}
                className={cn(
                  "h-12 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center",
                  isSelected ? "bg-brand text-ink border-brand shadow-xl" : "bg-surface-3/50 border-border-custom text-muted-main hover:border-brand/40 hover:text-foreground"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Curated Brands">
        <div className="space-y-4">
          {brands.map((brand) => {
            const isSelected = filters.brands.includes(brand.name);
            return (
              <button 
                key={brand.name}
                onClick={() => toggleFilter('brands', brand.name)}
                className="flex items-center justify-between w-full group py-1"
              >
                <div className="flex items-center gap-4">
                   <div className={cn(
                     "w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center",
                     isSelected ? "bg-brand border-brand rotate-12" : "bg-surface-3 border-border-custom group-hover:border-text-main/30"
                   )}>
                     {isSelected && <Check className="w-3 h-3 text-ink" />}
                   </div>
                   <span className={cn("text-xs transition-colors font-bold uppercase tracking-widest", isSelected ? "text-text-main" : "text-muted-main group-hover:text-text-main")}>
                     {brand.name}
                   </span>
                </div>
                <div className="bg-surface-3 px-2 py-0.5 rounded-md border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                   <span className="text-[9px] font-mono text-white font-bold tracking-tighter">{brand.count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Editorial Rating">
        <div className="space-y-4">
          {[4, 3, 2].map((rating) => (
             <button key={rating} className="flex items-center justify-between group w-full bg-surface-3/30 p-4 rounded-2xl border border-border-custom hover:border-gold/30 transition-all">
                <div className="flex gap-1.5 text-muted-main transition-colors">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-3.5 h-3.5", i < rating ? "fill-gold text-gold" : "opacity-20")} />
                   ))}
                </div>
                <span className="text-[9px] text-muted-main group-hover:text-text-main font-black uppercase tracking-[0.2em]">
                  & {rating}.0+
                </span>
             </button>
          ))}
        </div>
      </FilterSection>

      {/* Global Toggles */}
      <div className="space-y-4 py-8">
         <div className="flex items-center justify-between group cursor-pointer p-4 bg-surface-3/30 rounded-2xl border border-border-custom transition-all hover:bg-surface-3/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-main/60 group-hover:text-brand">Limited Sale Selection</span>
            <div className="w-12 h-6 bg-surface-2 rounded-full relative border border-border-custom transition-colors group-hover:border-brand/40 overflow-hidden">
               <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors" />
               <div className="absolute left-1.5 top-1.5 w-3 h-3 bg-muted-main/40 rounded-full transition-all group-active:scale-125" />
            </div>
         </div>
         <div className="flex items-center justify-between group cursor-pointer p-4 bg-surface-3/30 rounded-2xl border border-border-custom transition-all hover:bg-surface-3/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand group-hover:text-text-main">Active Stock Only</span>
            <div className="w-12 h-6 bg-brand rounded-full relative border border-brand/40 overflow-hidden">
               <div className="absolute inset-0 bg-brand animate-pulse opacity-20" />
               <div className="absolute right-1.5 top-1.5 w-3 h-3 bg-ink rounded-full" />
            </div>
         </div>
      </div>

      {/* Clear Button */}
      <div className="pt-8">
        <button 
          onClick={() => onFilterChange({ price: [0, maxPrice], colors: [], sizes: [], brands: [] })}
          className="w-full bg-surface-3 border border-border-custom py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-muted-main hover:text-text-main hover:border-text-main/20 transition-all active:scale-95 group relative overflow-hidden"
        >
          <span className="relative z-10">Purge Selection</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-text-main/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>

    </aside>
  );
}
