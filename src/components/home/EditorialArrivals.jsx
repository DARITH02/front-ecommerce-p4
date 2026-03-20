'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowRight, ShoppingCart, Sparkles, ShoppingBag, Star, Zap } from 'lucide-react';
import useStore from '@/lib/store/useStore';
import { api } from '@/lib/api/client';
import { resolveImageUrl } from '@/lib/utils';

export default function EditorialArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, setMiniCartOpen } = useStore();

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const response = await api.products.getLatest();
        const fetchedProducts = response.data || response;
        
        const mappedProducts = Array.isArray(fetchedProducts) ? fetchedProducts.map(p => ({
          ...p,
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: parseFloat(p.sale_price || p.price),
          image: resolveImageUrl(p.images?.[0]?.image_url || p.images?.[0]?.image_path || p.image_url || p.image_path || p.image) || 'https://images.unsplash.com/photo-1520903920234-7546ab806509?auto=format&fit=crop&w=600&q=80'
        })).slice(0, 3) : [];

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch editorial arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArrivals();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setMiniCartOpen(true);
  };
  return (
    <section className="py-24 bg-background px-6 md:px-12 w-full mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:h-[800px]">
        
        {/* Left: Editorial Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="lg:flex-[1.5] relative rounded-3xl overflow-hidden group min-h-[500px]"
        >
          <Image 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" 
            alt="Editorial Campaign" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
            <p className="text-brand font-bold text-xs uppercase tracking-[0.4em] mb-4">Editorial Series 2026</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium text-text-main mb-8 tracking-tighter uppercase leading-[0.9]">
              The Modern <br /> Silhouette
            </h2>
            <Link 
              href="/shop" 
              className="group flex items-center gap-4 bg-ink text-white w-fit px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-ink transition-all hover:pr-12"
            >
              Discover The Concept <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Right: Product Selection */}
        <div className="lg:flex-1 flex flex-col justify-between py-4 space-y-8 lg:space-y-0">
          <div className="space-y-4">
            <p className="text-xs text-brand font-bold uppercase tracking-[0.3em]">New Season</p>
            <h3 className="text-3xl font-display font-medium text-text-main uppercase tracking-tight">Curated Arrivals</h3>
            <p className="text-muted-main text-sm max-w-sm leading-relaxed">
              Meticulously selected pieces from our latest global campaign. 
              Designed for longevity, quality, and timeless editorial flair.
            </p>
          </div>

          <div className="space-y-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-surface-2 animate-pulse">
                  <div className="relative w-24 h-32 bg-surface-3 rounded-xl" />
                  <div className="flex-1 space-y-3">
                     <div className="h-5 w-48 bg-surface-3 rounded" />
                     <div className="h-4 w-24 bg-surface-3 rounded" />
                     <div className="h-3 w-32 bg-surface-3 rounded" />
                  </div>
                </div>
              ))
            ) : (
              products.map((product, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-2 transition-colors border border-transparent hover:border-white/5"
                >
                  <Link href={`/product/${product.slug || product.id}`} className="relative w-24 h-32 bg-surface-2 rounded-xl overflow-hidden shrink-0">
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </Link>
                  <div className="flex-1 space-y-2">
                  <Link href={`/product/${product.slug || product.id}`}>
                    <h4 className="text-lg font-display text-text-main group-hover:text-brand transition-colors">{product.name}</h4>
                  </Link>
                    <p className="font-mono text-muted-main text-sm font-bold">${product.price}</p>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand hover:text-text-main transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to cart
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-text-main border-b border-border-custom pb-2 w-fit hover:border-brand transition-colors hover:text-brand flex items-center gap-2">
            See all new arrivals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
