'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ArrowRight, Sparkles, TrendingUp, Zap, Hexagon, 
  ShoppingBag, Star, LayoutGrid, Clock
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';
import { api } from '@/lib/api/client';

export default function MegaMenu() {
  const { isMegaMenuOpen, setMegaMenuOpen } = useStore();
  const menuRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [catsRes, productsRes] = await Promise.all([
          api.categories.getAll(),
          api.products.getAll('?limit=2')
        ]);
        
        const fetchedCats = catsRes.data || catsRes;
        const fetchedProducts = productsRes.data || productsRes;

        setCategories(Array.isArray(fetchedCats) ? fetchedCats.slice(0, 3).map(c => ({
          name: c.name,
          slug: c.slug,
          items: c.children?.map(child => child.name) || ['New Arrivals', 'Best Sellers']
        })) : []);

        setFeaturedProducts(Array.isArray(fetchedProducts) ? fetchedProducts.slice(0, 2).map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.sale_price || p.price,
          image: p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=400&q=80'
        })) : []);

      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isMegaMenuOpen) {
      fetchMenuData();
    }
  }, [isMegaMenuOpen]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === 'Escape') setMegaMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [setMegaMenuOpen]);

  return (
    <AnimatePresence>
      {isMegaMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMegaMenuOpen(false)}
            className="fixed inset-0 top-[80px] bg-black/60 backdrop-blur-sm z-[400]"
          />

          {/* Menu Panel */}
          <motion.div 
            ref={menuRef}
            onMouseLeave={() => setMegaMenuOpen(false)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="hidden lg:block absolute left-0 right-0 top-[80px] bg-surface-2 border-b border-border-custom z-[450] overflow-hidden shadow-lg p-12"
          >
            <div className="max-w-[1920px] mx-auto grid grid-cols-5 gap-12">
              
              {/* Categories Columns */}
              {categories.slice(0, 3).map((cat, idx) => (
                <div key={idx} className="space-y-6">
                  <h4 className="text-sm font-display font-medium uppercase tracking-widest text-brand border-b border-border-custom pb-2">
                    {cat.name}
                  </h4>
                  <ul className="space-y-4">
                    {cat.items.map((item) => (
                      <li key={item}>
                        <Link 
                          href={`/shop?category=${item.toLowerCase().replace(' ', '-')}`}
                          className="text-muted-main hover:text-text-main transition-colors flex items-center group text-sm"
                        >
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 mr-2 text-brand" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Featured Column */}
              <div className="flex flex-col gap-6">
                <h4 className="text-sm font-display font-medium uppercase tracking-widest text-brand border-b border-border-custom pb-2">
                  Featured Pieces
                </h4>
                <div className="flex flex-col gap-4">
                  {loading ? (
                    [...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 animate-pulse">
                        <div className="w-20 h-28 bg-surface-3 rounded-md" />
                        <div className="space-y-2">
                           <div className="h-4 w-32 bg-surface-3 rounded" />
                           <div className="h-3 w-16 bg-surface-3 rounded" />
                        </div>
                      </div>
                    ))
                  ) : (
                    featuredProducts.map((product) => (
                      <Link key={product.id} href={`/product/${product.slug}`} className="group flex items-center gap-4">
                        <div className="relative w-20 h-28 overflow-hidden rounded-md bg-surface-3">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-text-main group-hover:text-brand transition-colors">{product.name}</p>
                          <p className="text-xs text-muted-main font-mono">${product.price}</p>
                        </div>
                      </Link>
                    ))
                  )}
                  <Link href="/shop" className="text-xs font-medium uppercase tracking-tighter hover:text-brand flex items-center gap-2 mt-2">
                    View All Collections <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Promo Column */}
              <div className="relative group overflow-hidden rounded-xl bg-surface-3 aspect-[3/4]">
                <Image 
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80" 
                  alt="Summer Sale" 
                  fill 
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-brand font-bold uppercase tracking-widest mb-2">Summer 2026</p>
                  <h3 className="text-2xl font-display font-medium mb-4 text-text-main">Up to 40% Off</h3>
                  <button className="bg-white text-ink px-6 py-2.5 rounded-full text-xs font-bold hover:bg-brand hover:text-white transition-colors self-start uppercase">
                    Shop Sale
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
