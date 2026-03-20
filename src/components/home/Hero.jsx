'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, ShoppingBag, MousePointer2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { api } from '@/lib/api/client';
import { resolveImageUrl } from '@/lib/utils';

export default function Hero() {
  const containerRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const [featuredRes, latestRes] = await Promise.all([
          api.products.getFeatured(),
          api.products.getLatest()
        ]);

        const featured = featuredRes.data || featuredRes;
        const latest = latestRes.data || latestRes;

        const mapProduct = (p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand?.name || (p.brand_id ? `Brand ${p.brand_id}` : 'Seasonal Launch'),
          image: resolveImageUrl(p.images?.[0]?.image_url || p.images?.[0]?.image_path || p.image_url || p.image_path || p.image) || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=600&q=80',
          slug: p.slug,
          price: parseFloat(p.sale_price || p.price),
          createdAt: p.created_at,
          updatedAt: p.updated_at
        });

        const mappedFeatured = Array.isArray(featured) ? featured.slice(0, 1).map(mapProduct) : [];
        const mappedLatest = Array.isArray(latest) ? latest.slice(0, 2).map(mapProduct) : [];

        // logic: get two products latest if they are from the same day (created or updated)
        let displayFeatured = mappedFeatured[0];
        let displayLatest = mappedLatest[0];

        if (mappedLatest.length >= 2) {
          const creationDate0 = new Date(mappedLatest[0].createdAt).toDateString();
          const creationDate1 = new Date(mappedLatest[1].createdAt).toDateString();
          
          const updateDate0 = new Date(mappedLatest[0].updatedAt).toDateString();
          const updateDate1 = new Date(mappedLatest[1].updatedAt).toDateString();
          
          if (creationDate0 === creationDate1 || updateDate0 === updateDate1) {
            displayFeatured = mappedLatest[1]; // Use 2nd latest as "Editors Choice" if same day
            displayLatest = mappedLatest[0];   // Use 1st latest as "New Arrival"
          }
        }

        setFeaturedProducts({
          featured: [displayFeatured].filter(Boolean),
          latest: [displayLatest].filter(Boolean)
        });
      } catch (error) {
        console.error('Failed to fetch hero products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background: Video Overlay Placeholder */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-60 grayscale-[0.5] scale-105"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-for-the-camera-34502-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-transparent to-surface" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 pt-20 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          
          {/* Main Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            style={{ opacity }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">New Season 2026 Collection</p>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-[100px] xl:text-[120px] font-display font-black leading-[0.85] tracking-tighter text-text-main uppercase drop-shadow-2xl">
              Elevate <br />
              <span className="text-brand">Your Style</span> <br />
              Daily.
            </h1>

            <p className="max-w-md text-lg text-muted-main leading-relaxed font-light">
              Experience the pinnacle of luxury-minimalist fashion. 
              Meticulously crafted pieces designed for the modern editorial lifestyle.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link 
                href="/shop" 
                className="group relative bg-brand text-ink px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:pr-14 hover:shadow-2xl hover:shadow-brand/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Arrival <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-brand-dim translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              
              <Link 
                href="/lookbook" 
                className="group flex items-center gap-3 text-text-main px-8 py-5 rounded-full border border-border-custom hover:border-brand/40 hover:bg-surface-2 transition-all uppercase tracking-widest text-sm font-medium"
              >
                <Play className="w-5 h-5 fill-current" />
                See Lookbook
              </Link>
            </div>
          </motion.div>

          {/* Floating Product Cards (Parallax) */}
          <div className="flex-1 relative w-full aspect-square lg:aspect-auto h-[600px] hidden lg:block">
            {/* Card 1 */}
            <motion.div 
              style={{ y: y1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute top-0 right-12 w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group border border-border-custom"
            >
              <Image 
                src={featuredProducts.featured?.[0]?.image || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=500&q=80'} 
                alt={featuredProducts.featured?.[0]?.name || "Product 1"} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <Link href={featuredProducts.featured?.[0]?.slug ? `/product/${featuredProducts.featured[0].slug}` : '#'} className="text-brand font-bold text-xs uppercase tracking-widest mb-1 underline-offset-4 hover:underline">Editors Choice</Link>
                <h4 className="text-text-main font-display font-medium text-lg">{featuredProducts.featured?.[0]?.name || 'Signature Silk Blazer'}</h4>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              style={{ y: y2 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="absolute bottom-12 left-24 w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group border border-border-custom backdrop-blur-3xl"
            >
              <Image 
                src={featuredProducts.latest?.[0]?.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80'} 
                alt={featuredProducts.latest?.[0]?.name || "Product 2"} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <Link href={featuredProducts.latest?.[0]?.slug ? `/product/${featuredProducts.latest[0].slug}` : '#'} className="text-brand font-bold text-xs uppercase tracking-widest mb-1 underline-offset-4 hover:underline">New Arrivals</Link>
                <h4 className="text-text-main font-display font-medium text-lg">{featuredProducts.latest?.[0]?.name || 'Urban Leather Collection'}</h4>
              </div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-brand/40 flex items-center justify-center p-4"
            >
              <div className="text-[10px] text-brand font-black text-center uppercase tracking-widest leading-tight">
                Premium Quality • Authentic Fashion • Global Shipping •
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-main animate-pulse">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand to-transparent" />
      </motion.div>
    </section>
  );
}
