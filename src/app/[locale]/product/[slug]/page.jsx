'use client';

import { useState, useEffect, use, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingBag, Heart, Share2, Truck, ShieldCheck,
  ChevronDown, Plus, Minus, Maximize2, Play, RefreshCw, ArrowRight, Check
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice, resolveImageUrl } from '@/lib/utils';
import { api } from '@/lib/api/client';
import './product-page.css';

/* ─── Accordion ─── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('border-b border-border-custom transition-colors', open && 'border-foreground/20')}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-7 flex justify-between items-center group text-left"
      >
        <span className={cn('text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300', open ? 'text-foreground' : 'text-foreground/50 group-hover:text-foreground/80')}>
          {title}
        </span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
          <Plus className={cn('w-4 h-4 transition-colors duration-300', open ? 'text-brand' : 'text-foreground/30 group-hover:text-foreground/60')} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-7 text-[13px] text-foreground/40 leading-[1.9] tracking-wide font-light">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Added-to-Cart Ripple ─── */
function AddedBadge({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground text-background rounded-[inherit] font-bold text-sm uppercase tracking-[0.2em]"
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          Added
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Normalize Cloudinary URLs for deduplication (strips /v\d+/ version segment) ─── */
const normalizeCloudinaryUrl = (url) => url?.replace(/\/v\d+\//, '/') ?? url;

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const { addToCart, setMiniCartOpen } = useStore();
  const galleryRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await api.products.getBySlug(slug);
        const data = response.data || response;
        const relatedResponse = await api.products.getAll('?limit=4');
        const relatedData = relatedResponse.data || relatedResponse;

        // Prefer the structured images array (has sort/primary info) first,
        // then fall back to top-level fields to avoid duplicates.
        const structuredUrls = (data.images || [])
          .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
          .map(img => img.image_url || img.image_path || img.url || img.image)
          .filter(Boolean);

        const fallbackUrls = [data.image_url, data.image, data.image_path, data.thumbnail_url].filter(Boolean);

        // Normalize a URL for dedup: strip Cloudinary version segment (/v\d+/)
        const seen = new Set();
        const uniqueImages = [];

        for (const raw of [...structuredUrls, ...fallbackUrls]) {
          const resolved = resolveImageUrl(raw);
          if (!resolved) continue;
          const key = normalizeCloudinaryUrl(resolved);
          if (!seen.has(key)) {
            seen.add(key);
            uniqueImages.push(resolved);
          }
        }

        const currentPrice = parseFloat(data.sale_price || data.price);
        const basePrice = parseFloat(data.price);
        const hasPromotion = data.sale_price && parseFloat(data.sale_price) < basePrice;

        const mappedProduct = {
          ...data,
          brand: data.brand?.name || 'EDITORIAL',
          price: currentPrice,
          originalPrice: hasPromotion ? basePrice : null,
          rating: data.rating || 4.9,
          reviewsCount: data.reviews_count || 342,
          description: data.description || 'Expertly crafted silhouette defined by minimalist precision and premium materials.',
          images: uniqueImages.length > 0 ? uniqueImages : [''],
          colors: data.colors || [
            { name: 'Onyx', hex: '#0D0D0D' },
            { name: 'Ivory', hex: '#F5F0E8' },
            { name: 'Slate', hex: '#8E8E8E' },
          ],
          sizes: data.sizes || ['XS', 'S', 'M', 'L', 'XL']
        };

        // Find and pre-select the primary image
        if (Array.isArray(data.images)) {
          const primaryImg = data.images.find(img => img.is_primary === true || img.is_primary === 1 || img.is_primary === '1');
          if (primaryImg) {
            const primaryRaw = primaryImg.image_url || primaryImg.image_path;
            const primaryResolved = resolveImageUrl(primaryRaw);
            if (primaryResolved) {
              const primaryNorm = normalizeCloudinaryUrl(primaryResolved);
              const finalIdx = uniqueImages.findIndex(u => normalizeCloudinaryUrl(u) === primaryNorm);
              if (finalIdx !== -1) setSelectedImage(finalIdx);
            }
          }
        }

        const mappedRelated = Array.isArray(relatedData) ? relatedData
          .filter(p => p.slug !== slug)
          .map(p => ({ ...p, price: p.sale_price || p.price, image: p.images?.[0]?.image_url || p.image_url }))
          .slice(0, 4) : [];

        setProduct(mappedProduct);
        setRelatedProducts(mappedRelated);
        setSelectedColor(mappedProduct.colors[0]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, `${selectedColor?.name || ''} / ${selectedSize}`, quantity);
    setMiniCartOpen(true);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1800);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full border-t-2 border-brand animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/30 font-bold">Loading Archive</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-foreground/40 text-sm uppercase tracking-widest">Artifact not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Breadcrumb ── */}
      <div className="px-6 md:px-16 pt-32 pb-0">
        <div className="flex items-center gap-3 text-[10px] text-foreground/40 uppercase tracking-[0.35em] font-bold">
          <Link href="/" className="hover:text-foreground/80 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground/80 transition-colors">Archive</Link>
          <span>/</span>
          <span className="text-foreground/60">{product.name}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN PRODUCT GRID
      ══════════════════════════════════════ */}
      <div className="px-6 md:px-16 pt-12 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_580px] gap-12 xl:gap-20 items-start">

          {/* ── Left: Gallery ── */}
          <div className="flex gap-5 sticky top-28" ref={galleryRef}>

            {/* Thumbnail Rail */}
            <div className="hidden md:flex flex-col gap-2.5 w-[72px] shrink-0 max-h-[calc(100vh-14rem)] overflow-y-auto custom-scrollbar pr-2">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'relative w-full aspect-[3/4] rounded-xl overflow-hidden border-[1.5px] transition-all duration-300 shrink-0',
                    selectedImage === idx
                      ? 'border-brand shadow-[0_0_0_3px_rgba(var(--color-brand-rgb),0.15)] opacity-100'
                      : 'border-border-custom opacity-40 hover:opacity-75 hover:border-foreground/20'
                  )}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" sizes="72px" />
                  {selectedImage === idx && (
                    <motion.div
                      layoutId="thumb-active"
                      className="absolute inset-0 ring-[1.5px] ring-brand ring-inset rounded-xl pointer-events-none"
                    />
                  )}
                </motion.button>
              ))}

              {/* Video stub */}
              <button className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-border-custom bg-foreground/5 flex flex-col items-center justify-center gap-1.5 opacity-35 hover:opacity-70 transition-opacity group shrink-0">
                <Play className="w-4 h-4 text-foreground group-hover:text-brand transition-colors fill-current" />
                <span className="text-[7px] font-bold uppercase tracking-widest text-foreground/50">360°</span>
              </button>
            </div>

            {/* Hero Image */}
            <div className="flex-1 relative aspect-[3/4] rounded-3xl overflow-hidden bg-surface-2 border border-border-custom group min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-[4s] ease-out"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
                {discount && (
                  <div className="bg-brand text-ink text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                    -{discount}% off
                  </div>
                )}
                <div className="bg-surface-3/60 backdrop-blur-md text-text-main text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border border-border-custom">
                  Archive Edition
                </div>
              </div>

              {/* Image counter */}
              <div className="absolute top-5 right-5 z-20 bg-background/50 backdrop-blur-xl border border-border-custom px-3 py-1.5 rounded-full">
                <span className="text-[9px] font-mono font-bold text-text-main tracking-[0.2em]">
                  {String(selectedImage + 1).padStart(2, '0')} / {String(product.images.length).padStart(2, '0')}
                </span>
              </div>

              {/* Prev / Next */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                {['prev', 'next'].map(dir => (
                  <button
                    key={dir}
                    onClick={() => setSelectedImage(prev =>
                      dir === 'prev'
                        ? (prev === 0 ? product.images.length - 1 : prev - 1)
                        : (prev + 1) % product.images.length
                    )}
                    className="pointer-events-auto w-10 h-10 rounded-full bg-surface-2/40 backdrop-blur-xl border border-border-custom flex items-center justify-center text-text-main hover:bg-brand hover:text-ink transition-all opacity-0 group-hover:opacity-100 duration-300"
                  >
                    <ChevronDown className={cn('w-4 h-4', dir === 'prev' ? 'rotate-90' : '-rotate-90')} />
                  </button>
                ))}
              </div>

              {/* Fullscreen */}
              <button className="absolute bottom-5 right-5 z-20 w-10 h-10 rounded-full bg-background/40 backdrop-blur-xl border border-border-custom flex items-center justify-center text-foreground hover:bg-brand hover:text-ink transition-all opacity-0 group-hover:opacity-100 duration-300">
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Mobile thumbnail dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden z-20">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn('rounded-full transition-all', selectedImage === idx ? 'w-4 h-1.5 bg-brand' : 'w-1.5 h-1.5 bg-foreground/40')}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Product Details ── */}
          <div className="flex flex-col gap-8 py-2">

            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">{product.brand}</span>
                  <span className="w-px h-3 bg-border-custom" />
                  <span className="text-[9px] text-foreground/30 uppercase tracking-[0.3em] font-bold font-mono">
                    #{product.sku || `ARC-${product.id}`}
                  </span>
                </div>
                {/* Stock pill */}
                <div className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border',
                  product.stock_status === 'instock'
                    ? 'bg-green-500/8 border-green-500/20 text-green-400'
                    : 'bg-red-500/8 border-red-500/20 text-red-400'
                )}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', product.stock_status === 'instock' ? 'bg-green-400' : 'bg-red-400 animate-pulse')} />
                  {product.stock_status === 'instock' ? 'In Stock' : 'Sold Out'}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-display font-medium text-foreground uppercase tracking-[-0.03em] leading-[0.9]">
                {product.name}<span className="text-brand">.</span>
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn('w-3 h-3', i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-foreground/10 text-foreground/10')} />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground/60">{product.rating}</span>
                <span className="text-[10px] text-foreground/25 uppercase tracking-widest">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-5 py-5 border-y border-border-custom">
              <div>
                <p className="text-[9px] text-foreground/30 uppercase tracking-[0.35em] font-bold mb-1.5">Price</p>
                <span className="text-3xl font-mono font-bold text-foreground tracking-[-0.02em]">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.originalPrice && (
                <div className="mb-1">
                  <span className="text-base font-mono text-foreground/25 line-through">{formatPrice(product.originalPrice)}</span>
                </div>
              )}
              {discount && (
                <div className="mb-1 px-2.5 py-1 bg-brand/15 border border-brand/30 rounded-lg">
                  <span className="text-[10px] font-black text-brand uppercase tracking-wider">Save {discount}%</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[13px] text-foreground/40 leading-[1.85] font-light tracking-wide">
              {product.description}
            </p>

            {/* ── Color Selection ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/50">
                  Color — <span className="text-foreground">{selectedColor?.name}</span>
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.name}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={cn(
                      'relative w-10 h-10 rounded-full transition-all duration-300',
                      selectedColor?.name === color.name
                        ? 'ring-2 ring-brand ring-offset-2 ring-offset-surface scale-110'
                        : 'ring-1 ring-white/15 hover:ring-white/40'
                    )}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor?.name === color.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                          style={{ color: color.hex === '#F5F0E8' || color.hex === '#FFFFFF' ? 'var(--ink)' : '#fff' }}
                          strokeWidth={3}
                        />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ── Size Selection ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/50">
                  Size — <span className="text-foreground">{selectedSize}</span>
                </p>
                <button className="text-[9px] font-bold uppercase tracking-widest text-foreground/30 hover:text-brand transition-colors underline underline-offset-4 decoration-border-custom/20">
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'w-14 h-12 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all duration-200',
                      selectedSize === size
                        ? 'bg-foreground text-background border-foreground shadow-lg'
                        : 'bg-transparent border-border-custom text-foreground/40 hover:border-foreground/30 hover:text-foreground/80'
                    )}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ── Quantity + CTA ── */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Qty */}
                <div className="flex items-center bg-surface-3 border border-border-custom rounded-xl h-14 overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-surface-2 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-mono font-bold text-foreground select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-surface-2 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_status !== 'instock'}
                  className="relative flex-1 h-14 rounded-xl bg-brand text-ink font-bold text-sm uppercase tracking-[0.2em] overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-[0_8px_30px_rgba(var(--color-brand-rgb),0.35)]"
                >
                  <span className={cn('flex items-center justify-center gap-2.5 transition-all duration-200', addedFlash && 'opacity-0')}>
                    <ShoppingBag className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                    {product.stock_status === 'instock' ? 'Add to Cart' : 'Sold Out'}
                  </span>
                  <AddedBadge show={addedFlash} />
                </button>

                {/* Wishlist */}
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setWishlisted(w => !w)}
                  className={cn(
                    'w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300',
                    wishlisted
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : 'bg-transparent border-border-custom text-foreground/40 hover:border-foreground/30 hover:text-foreground/70'
                  )}
                >
                  <Heart className={cn('w-5 h-5 transition-all', wishlisted && 'fill-current scale-110')} />
                </motion.button>
              </div>

              {/* Express checkout hint */}
              <p className="text-center text-[10px] text-foreground/20 uppercase tracking-[0.3em] font-medium pt-1">
                Free shipping on orders over $150
              </p>
            </div>

            {/* ── Trust Pills ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'Express worldwide' },
                { icon: ShieldCheck, label: 'Authentic', sub: 'Verified pieces' },
                { icon: RefreshCw, label: '30-Day Return', sub: 'Hassle free' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-surface-3 border border-border-custom hover:border-brand/30 hover:bg-surface-2 transition-all duration-300">
                  <item.icon className="w-5 h-5 text-brand/80" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/70 leading-tight">{item.label}</p>
                    <p className="text-[8px] text-foreground/25 uppercase tracking-wider mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Accordions ── */}
            <div className="mt-2 border-t border-border-custom pt-2">
              <Accordion title="Product Details" defaultOpen>
                Crafted from ultra-premium materials selected for both durability and refined drape. 
                Each piece undergoes a meticulous quality review before release. The structural silhouette 
                is designed to maintain its form through extended wear.
              </Accordion>
              <Accordion title="Sizing & Fit">
                This piece runs true to size. For a relaxed silhouette, consider sizing up.
                Model is 6'1" and wears size M. Chest: 38–40", Waist: 30–32".
              </Accordion>
              <Accordion title="Care Instructions">
                Dry clean preferred. If hand washing, use cold water with a gentle, pH-neutral detergent.
                Lay flat to dry. Do not tumble dry. Iron on low heat with a pressing cloth.
              </Accordion>
              <Accordion title="Delivery & Returns">
                Standard delivery: 3–5 business days. Express: 1–2 days.
                Free returns within 30 days of receipt — items must be unworn with original tags attached.
              </Accordion>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          NARRATIVE SECTION
      ══════════════════════════════════════ */}
      <div className="px-6 md:px-16 mt-40 pt-20 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-28 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-brand/60" />
                <p className="text-[9px] text-brand font-black uppercase tracking-[0.4em]">Design Philosophy</p>
              </div>
              <h3 className="text-4xl md:text-6xl xl:text-7xl font-display font-medium text-foreground uppercase tracking-[-0.03em] leading-[0.9]">
                Perpetual<br />Minimalism<span className="text-brand">.</span>
              </h3>
            </div>
            <div className="space-y-5 max-w-md">
              <p className="text-[13px] text-foreground/35 leading-[1.9] tracking-wide font-light">
                This piece represents the pinnacle of our current archive. Each fiber has been meticulously 
                selected to ensure a silhouette that transcends temporal trends.
              </p>
              <p className="text-[13px] text-foreground/35 leading-[1.9] tracking-wide font-light">
                Developed across our global creative studio, the piece fuses heritage craftsmanship 
                with structural precision built to endure.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-foreground/40 hover:text-foreground transition-colors group"
            >
              Our Story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border-custom order-1 lg:order-2 group">
            <Image
              src={product.images[Math.min(1, product.images.length - 1)]}
              alt="Design narrative"
              fill
              className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand/8 to-transparent mix-blend-overlay" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-background/50 backdrop-blur-xl border border-border-custom rounded-2xl p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/40 mb-1">Collection</p>
                <p className="text-sm font-bold text-foreground uppercase tracking-wide">{product.brand} Archive — SS25</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RELATED PRODUCTS
      ══════════════════════════════════════ */}
      <div className="px-6 md:px-16 mt-40 pt-20 border-t border-white/5 pb-32">
        <div className="flex items-end justify-between mb-14">
          <div className="space-y-3">
            <p className="text-[9px] text-brand font-black uppercase tracking-[0.4em]">You May Also Like</p>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground uppercase tracking-[-0.03em] leading-none">
              Related<span className="text-brand">.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/35 hover:text-foreground transition-colors group"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {relatedProducts.length > 0 ? relatedProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/product/${p.slug || p.id}`} className="group block space-y-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-2 border border-border-custom">
                  <Image
                    src={p.image || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=600&q=80'}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-107 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                  <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                    <div className="bg-surface-3/60 backdrop-blur-xl border border-border-custom rounded-xl py-2.5 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-main">Quick View</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 px-0.5">
                  <h4 className="text-[13px] font-bold text-foreground/80 group-hover:text-foreground transition-colors uppercase tracking-wide truncate leading-tight">{p.name}</h4>
                  <p className="text-[12px] font-mono text-foreground/35 group-hover:text-brand transition-colors">{formatPrice(p.price)}</p>
                </div>
              </Link>
            </motion.div>
          )) : (
            [...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-surface-3 animate-pulse" />
            ))
          )}
        </div>
      </div>

    </div>
  );
}