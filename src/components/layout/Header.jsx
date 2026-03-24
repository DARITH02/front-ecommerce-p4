'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, Heart, User, Search, Menu, X, 
  ChevronDown, Sun, Moon, LayoutGrid
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import useStore from '@/lib/store/useStore';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const { 
    cart, wishlist, toggleCart, toggleSearch, isDarkMode, toggleDarkMode, 
    setMegaMenuOpen, setMobileNavOpen, user, hasHydrated 
  } = useStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  if (isAuthPage) return null;

  const navItems = [
    { label: 'Shop All', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Editorial', href: '/editorial' },
    { label: 'Archives', href: '/archives' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[500] transition-all duration-700 transform-gpu",
        isScrolled ? "bg-background/80 backdrop-blur-3xl shadow-2xl shadow-black/20 h-20 border-b border-border-custom" : "bg-transparent h-28"
      )}
    >
      <div className="max-w-[1920px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        
         {/* Center Logo */}
        <Link 
          href="/" 
          className="flex-col items-center group cursor-pointer hidden md:flex"
        >
          <div className="flex flex-col items-center">
            <h1 className="text-xl sm:text-2xl md:text-5xl font-display font-medium text-text-main uppercase tracking-tighter leading-none group-hover:text-brand transition-colors duration-500">
               LUMINA<span className="text-brand">.</span>
            </h1>
            <p className="text-[8px] md:text-[8px] font-black uppercase tracking-[0.6em] text-muted-main mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">Editorial Artifacts</p>
          </div>
        </Link>



        {/* Left Nav */}
        <nav className="hidden lg:flex items-center gap-12">
           <button 
             onMouseEnter={() => setMegaMenuOpen(true)}
             className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] font-display text-text-main"
           >
             <LayoutGrid className="w-4 h-4 text-brand group-hover:rotate-90 transition-transform duration-500" />
             Shop Selection
           </button>
           {navItems.map((item) => (
             <Link 
               key={item.label} 
               href={item.href}
               className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-main hover:text-brand transition-colors relative group"
             >
               {item.label}
               <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand transition-all duration-500 group-hover:w-full" />
             </Link>
           ))}
        </nav>

        <button 
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden p-3 bg-surface-2 rounded-full border border-border-custom"
        >
           <Menu className="w-5 h-5 text-text-main" />
        </button>

       
        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-8">
           
           {/* Search Trigger */}
           <button 
             onClick={toggleSearch}
             className="hidden md:flex p-3 hover:bg-surface-2 rounded-full transition-all group scale-110"
           >
             <Search className="w-5 h-5 text-text-main group-hover:text-brand transition-all duration-500" />
           </button>

           {/* Theme Toggle */}
           <button 
             onClick={toggleDarkMode}
             className="hidden sm:flex p-3 hover:bg-white/5 rounded-full transition-all group relative overflow-hidden"
           >
              <AnimatePresence mode="wait">
                 {isDarkMode ? (
                    <motion.div key="sun" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} transition={{ duration: 0.3 }}>
                       <Sun className="w-5 h-5 text-gold group-hover:rotate-180 transition-transform duration-700" />
                    </motion.div>
                 ) : (
                    <motion.div key="moon" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} transition={{ duration: 0.3 }}>
                       <Moon className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-700" />
                    </motion.div>
                 )}
              </AnimatePresence>
           </button>

           <div className="h-6 w-px bg-border-custom hidden md:block" />

             {/* Account - Desktop only */}
             <Link href={(mounted && hasHydrated && user) ? "/account" : "/login"} className="hidden lg:flex items-center gap-3 group">
                <div className="w-10 h-10 border border-border-custom rounded-full flex items-center justify-center group-hover:border-brand/40 group-hover:bg-brand/5 transition-all">
                   <User className="w-4 h-4 text-text-main group-hover:text-brand" />
                </div>
                {(!mounted || !hasHydrated || !user) && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main group-hover:text-brand transition-colors hidden xl:block">
                    Join / Login
                  </span>
                )}
             </Link>

           {/* Wishlist - Desktop only */}
           <Link href="/wishlist" className="hidden lg:flex items-center gap-3 relative group">
              <Heart className="w-5 h-5 text-text-main group-hover:text-brand transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-[10px] font-black rounded-full flex items-center justify-center text-white shadow-xl animate-pulse">
                  {wishlist.length}
                </span>
              )}
           </Link>

           {/* Cart - Always visible but larger tap target on mobile */}
           <button 
             onClick={toggleCart}
             className="relative p-3 md:p-4 md:px-8 bg-brand border border-brand text-ink rounded-full flex items-center gap-2 md:gap-3 text-xs font-black uppercase tracking-widest hover:bg-brand-dim hover:text-white transition-all shadow-xl shadow-brand/10 group active:scale-95"
           >
              <ShoppingBag className="w-4 h-4 group-hover:animate-bounce" />
              <span className="hidden md:inline">Bag</span>
              <div className="h-4 w-px bg-ink/20 group-hover:bg-white/20 hidden md:block" />
              <span className="font-mono">{cart.length}</span>
           </button>
        </div>

      </div>
    </header>
  );
}
