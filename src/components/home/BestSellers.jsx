'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, Sparkles, TrendingUp, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import ProductCard from '@/components/product/ProductCard';

const products = {
  All: [
    { id: 1, name: 'Minimalist Silk Blouse', price: 150, image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=600&q=80', badge: 'Best Seller' },
    { id: 2, name: 'Editorial Leather Bag', price: 299, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80', badge: 'New' },
    { id: 3, name: 'Premium Shades', price: 80, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80', badge: 'Trending' },
    { id: 4, name: 'Modern Wool Coat', price: 420, image: 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=600&q=80', badge: 'Best Seller' },
    { id: 5, name: 'Classic Loafers', price: 210, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80', badge: 'Trending' },
    { id: 6, name: 'Silk Sleepwear', price: 120, image: 'https://images.unsplash.com/photo-1539109132314-d4d8b05774d5?auto=format&fit=crop&w=600&q=80', badge: 'Best Seller' },
    { id: 7, name: 'Minimalist Ring', price: 95, image: 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?auto=format&fit=crop&w=600&q=80', badge: 'New' },
    { id: 8, name: 'Onyx Collective Tee', price: 65, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', badge: 'Latest' },
  ],
  Fashion: [],
  Electronics: [],
  Beauty: [],
};

// Mock population
products.Fashion = products.All.slice(0, 4);
products.Electronics = products.All.slice(2, 6);
products.Beauty = products.All.slice(4, 8);

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <section className="py-24 bg-surface-2 border-y border-border-custom">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="text-center md:text-left space-y-4">
            <p className="text-xs text-brand font-bold uppercase tracking-[0.3em]">Customer Favorites</p>
            <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white uppercase">Best Sellers</h2>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-surface-3 p-1 rounded-full border border-white/5">
            {Object.keys(products).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab ? 'bg-brand text-ink shadow-lg shadow-brand/20' : 'text-muted-main hover:text-white'
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
            {products[activeTab].map((product, idx) => (
              <ProductCard key={`${activeTab}-${product.id}`} product={product} />
            ))}
          </AnimatePresence>
        </div>

        {/* View All */}
        <div className="mt-20 flex justify-center">
          <Link href="/shop" className="group flex items-center gap-4 bg-transparent border border-white/20 px-12 py-5 rounded-full text-xs font-bold uppercase tracking-[0.25em] text-white hover:border-brand hover:text-brand transition-all hover:pr-16">
            View All Collection <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
