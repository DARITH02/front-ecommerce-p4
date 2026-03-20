'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2, LayoutGrid, Filter, RefreshCw } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api/client';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const response = await api.products.getAll();
        const fetchedProducts = response.data || response;
        
        const mappedProducts = Array.isArray(fetchedProducts) ? fetchedProducts.map(p => ({
          ...p,
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: parseFloat(p.sale_price || p.price),
          originalPrice: p.sale_price ? parseFloat(p.price) : null,
          image: p.images?.[0]?.image_url,
          secondaryImage: p.images?.[1]?.image_url || p.images?.[0]?.image_url,
          badge: p.sale_price ? 'Sale' : (p.is_new ? 'New' : null),
          brand: p.brand?.name || 'Editorial'
        })) : [];

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);
  
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="bg-background pt-40 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="mb-20 space-y-4">
         <div className="flex items-center gap-3 text-[10px] text-brand font-black uppercase tracking-[0.4em] mb-4">
            <Link href="/" className="hover:text-text-main transition-colors">Home</Link>
            <span className="w-1 h-1 bg-border-custom rounded-full" />
            <span className="text-text-main">Wishlist Silhouette</span>
         </div>
         <h1 className="text-4xl md:text-8xl font-display font-medium text-text-main uppercase tracking-tighter leading-none">
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

      {/* Recommended for you footer */}
      {products.length > 0 && (
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
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="space-y-4 group">
                   <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-2">
                      <Image src={p.image || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=600&q=80'} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-brand transition-colors">{p.name}</h5>
                </Link>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
