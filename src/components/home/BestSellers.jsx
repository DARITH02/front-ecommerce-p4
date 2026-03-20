'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, Sparkles, TrendingUp, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api/client';
import { resolveImageUrl } from '@/lib/utils';

export default function BestSellers() {
  const [products, setProducts] = useState({ All: [], Fashion: [], Electronics: [], Beauty: [] });
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.products.getAll();
        const productsData = response.data || response;
        
        const mapped = Array.isArray(productsData) ? productsData.map(p => {
          const currentPrice = parseFloat(p.sale_price || p.price);
          const basePrice = parseFloat(p.price);
          const hasPromotion = p.sale_price && parseFloat(p.sale_price) < basePrice;
          
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: currentPrice,
            originalPrice: hasPromotion ? basePrice : null,
            image: resolveImageUrl(p.images?.[0]?.image_url || p.images?.[0]?.image_path || p.image_url || p.image_path || p.image),
            secondaryImage: resolveImageUrl(p.images?.[1]?.image_url || p.images?.[1]?.image_path || p.images?.[0]?.image_url || p.image_url),
            badge: hasPromotion ? 'Sale' : (p.is_new ? 'New' : 'Best Seller'),
            brand: p.brand?.name || (p.brand_id ? `Brand ${p.brand_id}` : 'Exclusive')
          };
        }) : [];

        setProducts({
          All: mapped.slice(0, 8),
          Fashion: mapped.filter(p => p.categories?.some(c => c.slug === 'fashion')).slice(0, 8),
          Electronics: mapped.filter(p => p.categories?.some(c => c.slug === 'electronics')).slice(0, 8),
          Beauty: mapped.filter(p => p.categories?.some(c => c.slug === 'beauty')).slice(0, 8),
        });
        
        // Fallback if filters return empty
        if (mapped.length > 0) {
           setProducts(prev => ({
             ...prev,
             Fashion: prev.Fashion.length ? prev.Fashion : mapped.slice(0, 4),
             Electronics: prev.Electronics.length ? prev.Electronics : mapped.slice(2, 6),
             Beauty: prev.Beauty.length ? prev.Beauty : mapped.slice(4, 8),
           }));
        }

      } catch (error) {
        console.error('Failed to fetch best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const tabs = ['All', 'Fashion', 'Electronics', 'Beauty'];

  return (
    <section className="py-24 bg-surface-2 border-y border-border-custom">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <span className="w-12 h-px bg-brand" />
               <p className="text-xs text-brand font-black uppercase tracking-[0.4em]">Curated Elite</p>
            </div>
            <h2 className="text-5xl md:text-8xl font-display font-medium tracking-tighter text-text-main uppercase leading-[0.85]">
              Best <br />
              Sellers<span className="text-brand">.</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 bg-surface-3 p-2 rounded-2xl border border-border-custom">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                  ? 'bg-brand text-ink shadow-lg shadow-brand/20' 
                  : 'text-muted-main hover:text-text-main'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <AnimatePresence mode='wait'>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-surface-3 animate-pulse" />
              ))
            ) : (
              products[activeTab]?.map((product, idx) => (
                <ProductCard key={`${activeTab}-${product.id}`} product={product} />
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="mt-20 flex justify-center">
          <Link href="/shop" className="group flex items-center gap-6 bg-foreground text-background px-12 py-6 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-brand hover:text-ink transition-all hover:scale-105 shadow-2xl">
            Explore Archive 
            <div className="w-10 h-10 border border-ink/10 rounded-full flex items-center justify-center group-hover:bg-background group-hover:text-foreground transition-all">
               <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
