'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ShoppingBag, Heart, User, Search, 
  Home, LayoutGrid, Sparkles, Languages, Sun, Moon,
  LogOut, Settings, HelpCircle, Archive, Zap, Plus, Minus
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import useStore from '@/lib/store/useStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const storeCategories = [
  { name: 'New Arrivals', items: ['Men\'s Fashion', 'Women\'s Fashion', 'Shoes', 'Accessories', 'Beauty'] },
  { name: 'Clothing', items: ['T-shirts', 'Jackets', 'Trousers', 'Knitwear', 'Dresses', 'Blouses'] },
  { name: 'Accessories', items: ['Bags', 'Belts', 'Wallets', 'Sunglasses', 'Jewelry', 'Watches'] },
  { name: 'Brands', items: ['Lumina Signature', 'Ethereal', 'Onyx Collective', 'Minimalists', 'Editorial'] },
];

const CategoryAccordion = ({ category, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border-custom last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between group"
      >
        <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", isOpen ? "text-brand" : "text-text-main/80")}>
           {category.name}
        </span>
        <div className={cn("w-6 h-6 rounded-md bg-surface-3 flex items-center justify-center transition-transform", isOpen && "rotate-180")}>
           <ChevronRight className="w-3 h-3 text-muted-main" />
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
            <div className="pb-6 pl-4 space-y-4">
               {category.items.map((item) => (
                 <Link 
                   key={item} 
                   href={`/shop?category=${item.toLowerCase().replace(' ', '-')}`}
                   onClick={onClose}
                   className="block text-xs text-muted-main hover:text-text-main transition-colors py-1 flex items-center gap-3 group"
                 >
                   <div className="w-1 h-1 bg-brand/40 rounded-full group-hover:scale-150 transition-transform" />
                   {item}
                 </Link>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function MobileMenu() {
  const { 
    isMobileNavOpen, setMobileNavOpen, 
    cart, wishlist, toggleCart, toggleSearch, isDarkMode, toggleDarkMode 
  } = useStore();

  const onClose = () => setMobileNavOpen(false);

  const primaryNav = [
    { label: 'Shop All', href: '/shop', icon: LayoutGrid },
    { label: 'New Arrivals', href: '/shop?filter=new', icon: Sparkles },
    { label: 'Editorial', href: '/editorial', icon: Archive },
    { label: 'Archives', href: '/archives', icon: Zap },
  ];

  const quickNav = [
    { label: 'Find', icon: Search, action: toggleSearch },
    { label: 'Wishlist', icon: Heart, href: '/wishlist', count: wishlist.length },
    { label: 'Bag', icon: ShoppingBag, href: '/cart', count: cart.length },
  ];

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[550] xl:hidden"
          />

          {/* Panel */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full md:w-[90%] max-w-sm bg-surface z-[600] xl:hidden flex flex-col shadow-3xl overflow-hidden"
          >
            {/* Header: Brand & Close */}
            <div className="px-8 py-6 border-b border-border-custom flex justify-between items-center bg-surface-2/40 backdrop-blur-md">
               <div className="flex flex-col">
                  <h2 className="text-2xl font-display font-medium text-text-main tracking-tighter uppercase leading-none">
                    LUMINA<span className="text-brand">.</span>
                  </h2>
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-main mt-1.5 opacity-60 leading-none">Editorial Artifacts</p>
               </div>
               <button 
                 onClick={onClose} 
                 className="w-10 h-10 bg-surface-3 rounded-full border border-border-custom flex items-center justify-center text-text-main active:scale-95 transition-all group"
               >
                 <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
               
               {/* Grid Quick Dashboard */}
               <div className="p-6 grid grid-cols-3 gap-2">
                  {quickNav.map((item, idx) => (
                    item.action ? (
                      <button 
                        key={idx}
                        onClick={() => { onClose(); item.action(); }}
                        className="flex flex-col items-center justify-center gap-2 py-6 bg-surface-2 rounded-2xl border border-border-custom group active:bg-brand/10 transition-all shadow-sm"
                      >
                         <item.icon className="w-5 h-5 text-muted-main group-hover:text-brand transition-colors" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-muted-main">{item.label}</span>
                      </button>
                    ) : (
                      <Link 
                        key={idx}
                        href={item.href}
                        onClick={onClose}
                        className="flex flex-col items-center justify-center gap-2 py-6 bg-surface-2 rounded-2xl border border-border-custom group relative active:bg-brand/10 transition-all shadow-sm"
                      >
                         <item.icon className="w-5 h-5 text-muted-main group-hover:text-brand transition-colors" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-muted-main">{item.label}</span>
                         {item.count > 0 && (
                            <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg animate-pulse">
                               {item.count}
                            </span>
                         )}
                      </Link>
                    )
                  ))}
               </div>

               {/* Full Detailed Menu Accordions */}
                <div className="p-6">
                   <div className="flex items-center gap-4 mb-6 px-2">
                      <LayoutGrid className="w-4 h-4 text-brand" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-main">Full Store Directory</p>
                   </div>
                   <div className="bg-surface-2/50 rounded-3xl border border-border-custom px-6">
                      {storeCategories.map((cat) => (
                        <CategoryAccordion key={cat.name} category={cat} onClose={onClose} />
                      ))}
                   </div>
                </div>

               {/* Standard Links */}
                <nav className="p-6 space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-main ml-2 mb-4">Editorial Collections</p>
                   {primaryNav.map((item, idx) => (
                     <Link 
                       key={idx} 
                       href={item.href} 
                       onClick={onClose}
                       className="flex items-center justify-between p-5 bg-surface-3/30 rounded-2xl border border-border-custom group transition-all hover:bg-brand hover:border-brand"
                     >
                       <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-text-main group-hover:bg-ink group-hover:text-brand transition-all">
                             <item.icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold uppercase tracking-widest text-text-main group-hover:text-ink">{item.label}</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-muted-main group-hover:text-ink transition-colors" />
                     </Link>
                   ))}
                </nav>

               {/* System Actions & Toggles */}
                <div className="p-6 pt-0 space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-main ml-2 mb-4">Store Identity</p>
                   <button 
                     onClick={toggleDarkMode}
                     className="w-full flex items-center justify-between p-5 bg-surface-2 rounded-2xl border border-border-custom text-xs font-bold uppercase tracking-widest text-text-main active:scale-95 transition-all"
                   >
                      <div className="flex items-center gap-4">
                         {isDarkMode ? <Sun className="w-4 h-4 text-brand" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                         {isDarkMode ? 'Light Aesthetic' : 'Dark Aesthetic'}
                      </div>
                      <div className={cn("w-10 h-6 bg-surface-3 rounded-full relative border border-border-custom p-1 flex items-center", isDarkMode ? "justify-end" : "justify-start")}>
                         <motion.div layout className="w-4 h-4 bg-brand rounded-full shadow-lg" />
                      </div>
                   </button>
                   
                   <div className="flex items-center justify-between p-5 bg-surface-2 rounded-2xl border border-border-custom text-xs font-bold uppercase tracking-widest text-text-main group">
                      <div className="flex items-center gap-4">
                         <Languages className="w-4 h-4 text-brand" />
                         Region: GLOBAL (EN)
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-main group-hover:text-text-main transition-colors" />
                   </div>
                </div>
               {/* Account Preview */}
                <div className="p-6">
                   <div className="p-1 px-1 bg-surface-2 rounded-[2rem] border border-border-custom">
                      <Link href="/account" onClick={onClose} className="flex items-center gap-4 p-5 bg-brand/5 rounded-[1.8rem] border border-brand/10 group hover:bg-brand transition-all">
                         <div className="w-12 h-12 rounded-full bg-brand text-ink flex items-center justify-center group-hover:bg-ink group-hover:text-brand transition-colors">
                            <User className="w-6 h-6" />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-sm font-display font-medium text-text-main group-hover:text-ink uppercase leading-none truncate">Sign In To Lumina</h4>
                            <p className="text-[8px] font-black text-brand group-hover:text-ink uppercase tracking-widest mt-1">Unlock Member Archives</p>
                         </div>
                         <ArrowDownRight className="w-4 h-4 text-brand group-hover:text-ink" />
                      </Link>
                   </div>
                </div>
            </div>

            {/* Standard Footer Control */}
            <div className="p-8 bg-surface-2/90 backdrop-blur-md border-t border-border-custom pt-10">
                <button 
                  onClick={() => { onClose(); toggleCart(); }}
                  className="w-full bg-brand text-ink py-6 rounded-3xl text-sm font-black uppercase tracking-[0.35em] shadow-3xl shadow-brand/20 flex items-center justify-center gap-4 active:scale-95 transition-all relative group overflow-hidden"
                >
                   <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                   <ShoppingBag className="w-5 h-5 relative z-10" />
                   <span className="relative z-10">VIEW BAG ({cart.length})</span>
                </button>
                <p className="text-[10px] text-muted-main text-center mt-6 uppercase tracking-[0.4em] font-black opacity-30">
                   Editorial Fulfillment Since 2025
                </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const ArrowDownRight = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);
