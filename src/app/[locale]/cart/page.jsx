'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Trash2, Heart, Plus, Minus, MoveRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice } from '@/lib/utils';
import { useState } from 'react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, toggleWishlist, wishlist } = useStore();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 25;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;

  const freeShippingThreshold = 200;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const applyCoupon = (e) => {
    e.preventDefault();
    if (coupon.toUpperCase() === 'LUMINA15OFF') {
      setAppliedCoupon({ code: 'LUMINA15OFF', discount: subtotal * 0.15 });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-surface pt-48 pb-24 px-6 md:px-12 flex flex-col items-center justify-center text-center min-h-screen">
        <div className="w-32 h-32 bg-surface-2 rounded-full flex items-center justify-center mb-8 border border-white/5 animate-bounce">
          <ShoppingBag className="w-12 h-12 text-brand" />
        </div>
        <h1 className="text-4xl md:text-7xl font-display font-medium text-white uppercase tracking-tighter mb-4 leading-none">Your bag is empty<span className="text-brand">.</span></h1>
        <p className="max-w-md text-lg text-muted-main leading-relaxed font-light mb-12 uppercase tracking-widest leading-tight italic">Experience our editorial collection and add pieces that define your minimalist silhouette.</p>
        <Link href="/shop" className="group flex items-center gap-4 bg-brand text-ink px-12 py-6 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-dim hover:text-white transition-all hover:pr-16 active:scale-95 shadow-xl shadow-brand/20">
          Start Shopping Everywhere <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface pt-40 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="mb-16 space-y-4">
        <Link href="/shop" className="flex items-center gap-2 text-[10px] text-brand font-black uppercase tracking-[0.3em] hover:text-white transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Collections
        </Link>
        <div className="flex items-end justify-between border-b border-white/5 pb-12">
          <h1 className="text-5xl md:text-8xl font-display font-medium text-white uppercase tracking-tighter leading-none">Shopping Bag</h1>
          <p className="text-sm text-muted-main font-bold uppercase tracking-widest hidden md:block">Items <b>({cart.length})</b></p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
        
        {/* Left: Cart Items */}
        <div className="flex-1 space-y-12">
           
           {/* Free Shipping Alert */}
           <div className="bg-surface-2 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                 <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-display font-medium text-white uppercase tracking-tight">
                       {subtotal >= freeShippingThreshold 
                         ? 'Unlocked: Complimentary Priority Shipping' 
                         : `Add ${formatPrice(freeShippingThreshold - subtotal)} for Free Shipping`}
                    </h3>
                    <p className="text-xs text-muted-main uppercase tracking-widest font-bold opacity-60">Premium global delivery on orders above {formatPrice(freeShippingThreshold)}</p>
                 </div>
                 <div className="w-full md:w-64 h-3 bg-surface-3 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={cn("h-full transition-all duration-1000", progress === 100 ? "bg-mint shadow-[0_0_20px_rgba(0,212,165,0.4)]" : "bg-brand shadow-[0_0_20px_rgba(255,77,0,0.4)]")}
                    />
                 </div>
              </div>
              <div className="absolute inset-0 bg-brand/5 rotate-12 translate-x-1/2 scale-150 blur-[100px]" />
           </div>

           {/* Table Header */}
           <div className="hidden md:grid grid-cols-12 gap-8 text-[10px] text-muted-main font-black uppercase tracking-[0.4em] border-b border-white/5 pb-6">
              <div className="col-span-6">Piece / Collection</div>
              <div className="col-span-2 text-center">Edition / Variant</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total Price</div>
           </div>

           {/* Item Rows */}
           <div className="space-y-8">
              <AnimatePresence>
                 {cart.map((item) => (
                    <motion.div 
                      key={`${item.id}-${item.variant}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center group bg-surface-2/50 hover:bg-surface-2 p-6 rounded-3xl border border-transparent hover:border-white/5 transition-all duration-300"
                    >
                       {/* Piece */}
                       <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                          <Link href={`/product/${item.id}`} className="relative w-28 h-36 rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-700">
                             <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </Link>
                          <div className="space-y-2">
                             <p className="text-[10px] text-brand font-black uppercase tracking-widest">{item.brand || 'Lumina Editorial'}</p>
                             <h4 className="text-xl font-display font-medium text-white uppercase tracking-tight group-hover:text-brand transition-colors line-clamp-1">{item.name}</h4>
                             <div className="flex gap-4 pt-4">
                                <button 
                                  onClick={() => removeFromCart(item.id, item.variant)}
                                  className="text-[9px] font-black uppercase tracking-widest text-muted-main hover:text-red-500 flex items-center gap-2 group/remove"
                                >
                                   <Trash2 className="w-3.5 h-3.5" /> Remove Piece
                                </button>
                                <button 
                                  onClick={() => toggleWishlist(item.id)}
                                  className={cn(
                                    "text-[9px] font-black uppercase tracking-widest flex items-center gap-2",
                                    wishlist.includes(item.id) ? "text-brand" : "text-muted-main hover:text-white"
                                  )}
                                >
                                   <Heart className={cn("w-3.5 h-3.5", wishlist.includes(item.id) ? "fill-brand" : "")} /> Save For Later
                                </button>
                             </div>
                          </div>
                       </div>

                       {/* Variant */}
                       <div className="col-span-1 md:col-span-2 text-center">
                          <span className="text-xs font-bold font-mono text-white/60 tracking-widest uppercase">{item.variant || 'Standard'}</span>
                       </div>

                       {/* Qty */}
                       <div className="col-span-1 md:col-span-2 flex justify-center">
                          <div className="flex items-center gap-4 bg-surface-3 border border-white/5 p-1.5 rounded-2xl w-fit">
                             <button onClick={() => updateQuantity(item.id, item.variant, -1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:text-ink transition-all">
                                <Minus className="w-3 h-3" />
                             </button>
                             <span className="text-sm font-mono font-bold w-6 text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, item.variant, 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:text-ink transition-all">
                                <Plus className="w-3 h-3" />
                             </button>
                          </div>
                       </div>

                       {/* Price */}
                       <div className="col-span-1 md:col-span-2 text-right">
                          <p className="text-2xl font-mono font-bold text-white tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-[10px] text-muted-main font-bold mt-1 uppercase tracking-widest">{formatPrice(item.price)} each</p>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>

           {/* Coupon & Upsell */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
              <form onSubmit={applyCoupon} className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-brand">Voucher / Access Code</p>
                 <div className="relative group">
                    <input 
                      type="text" 
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="ENTER CODE"
                      className="w-full bg-surface-2 border border-white/10 px-8 py-5 rounded-2xl text-xs font-bold focus:outline-none focus:border-brand/40 uppercase tracking-[0.2em]"
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-white text-ink px-8 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all">
                       Apply
                    </button>
                 </div>
                 {appliedCoupon && (
                    <div className="flex items-center gap-2 text-mint text-[10px] font-bold uppercase tracking-widest">
                       LUMINA15OFF Code Applied! You saved {formatPrice(appliedCoupon.discount)}
                    </div>
                 )}
              </form>

              <div className="bg-surface-3/30 border border-white/5 p-8 rounded-3xl space-y-4 border-dashed">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Complete Your Edit</h4>
                 <div className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-16 h-20 bg-surface-2 rounded-xl group-hover:scale-105 transition-transform" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-white uppercase tracking-widest">Editorial Shoe Horn</p>
                       <p className="text-xs font-mono font-bold text-brand">$25.00</p>
                       <button className="text-[9px] font-black uppercase tracking-widest text-muted-main hover:text-white transition-colors border-b border-white/10">Add To Bag</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full lg:w-[420px] sticky top-32">
           <div className="bg-surface-2 rounded-3xl border border-white/5 p-10 space-y-10 shadow-2xl shadow-black/40">
              <h3 className="text-2xl font-display font-medium text-white uppercase tracking-tight pb-8 border-b border-white/5">Order Overview</h3>
              
              <div className="space-y-6">
                 <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                    <span className="text-muted-main">Subtotal</span>
                    <span className="text-white font-mono tracking-tighter">{formatPrice(subtotal)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                    <span className="text-muted-main">Priority Shipping</span>
                    <span className={cn("font-mono tracking-tighter", shipping === 0 ? "text-mint" : "text-white")}>
                      {shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}
                    </span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                    <span className="text-muted-main">Estimated Taxes</span>
                    <span className="text-white font-mono tracking-tighter">{formatPrice(taxes)}</span>
                 </div>
                 {appliedCoupon && (
                    <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-mint border-b border-mint/10 pb-6">
                       <span>Member Discount</span>
                       <span className="font-mono tracking-tighter">-{formatPrice(appliedCoupon.discount)}</span>
                    </div>
                 )}
              </div>

              <div className="pt-8 border-t border-white/10">
                 <div className="flex justify-between items-center mb-10">
                    <span className="text-lg font-display font-medium text-white uppercase tracking-widest">Total Investment</span>
                    <span className="text-4xl font-mono font-black text-white tracking-widest">
                       {formatPrice(total - (appliedCoupon?.discount || 0))}
                    </span>
                 </div>
                 
                 <Link href="/checkout" className="w-full bg-brand text-ink py-6 rounded-full text-xs font-black uppercase tracking-[0.25em] hover:bg-brand-dim hover:text-white transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-4 group">
                    Begin Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>

              {/* Trust badges footer */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl text-center border border-white/5">
                    <ShieldCheck className="w-5 h-5 text-brand" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-main">Secure Data</span>
                 </div>
                 <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl text-center border border-white/10">
                    <CreditCard className="w-5 h-5 text-brand" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-main">Auth Payments</span>
                 </div>
              </div>

              <div className="flex justify-center gap-4 grayscale opacity-40">
                 {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-6 bg-white/10 rounded" />
                 ))}
              </div>
           </div>

           <div className="mt-8 p-6 bg-surface-3/30 border border-white/5 rounded-2xl text-center">
              <p className="text-[9px] text-muted-main uppercase tracking-[0.3em] font-bold leading-relaxed">
                 Need assistance? Our luxury advisors are available 24/7. <br />
                 <Link href="/contact" className="text-brand hover:underline">Chat with us now</Link>
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
