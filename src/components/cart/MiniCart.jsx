'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice } from '@/lib/utils';

export default function MiniCart() {
  const { isMiniCartOpen, setMiniCartOpen, cart, updateQuantity, removeFromCart } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 100;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMiniCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[750]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onMouseLeave={() => setMiniCartOpen(false)}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-surface-2 shadow-2xl z-[800] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-8 border-b border-border-custom">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand" />
                <h3 className="text-xl font-display font-medium text-text-main">Your Cart</h3>
                <span className="text-xs bg-surface-3 text-brand px-2 py-0.5 rounded-full font-bold">
                  {cart.length} ITEMS
                </span>
              </div>
              <button 
                onClick={() => setMiniCartOpen(false)}
                className="p-2 hover:bg-surface-3 rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-muted-main group-hover:text-text-main" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-surface-3 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-muted-main" />
                  </div>
                  <h4 className="text-lg font-medium text-text-main">Your cart is empty</h4>
                  <p className="text-sm text-muted-main max-w-[240px]">
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                  <Link 
                    href="/shop" 
                    onClick={() => setMiniCartOpen(false)}
                    className="inline-flex items-center gap-2 bg-brand text-ink px-6 py-2.5 rounded-full text-xs font-bold hover:bg-brand-dim transition-colors uppercase tracking-widest mt-4"
                  >
                    Start Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Free Shipping Bar */}
                  <div className="bg-surface-3/50 p-4 rounded-xl border border-border-custom/50">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-muted-main uppercase tracking-widest font-bold">Free Shipping</p>
                      <p className="text-xs text-text-main/80 font-mono">
                        {subtotal >= freeShippingThreshold 
                          ? 'UNLOCKED' 
                          : `${formatPrice(freeShippingThreshold - subtotal)} more for free shipping`}
                      </p>
                    </div>
                    <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={cn("h-full transition-all duration-500", progress === 100 ? "bg-mint" : "bg-brand")}
                      />
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="group flex gap-4 p-3 hover:bg-surface-3 rounded-xl transition-colors">
                        <div className="relative w-20 h-24 bg-surface-2 rounded-lg overflow-hidden shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-text-main line-clamp-1 group-hover:text-brand transition-colors">
                                {item.name}
                              </h4>
                              {item.variant && (
                                <p className="text-[10px] text-muted-main uppercase tracking-widest mt-0.5">
                                  Variant: {item.variant}
                                </p>
                              )}
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id, item.variant)}
                              className="p-1 hover:bg-red-500/10 rounded group/trash"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-main group-hover/trash:text-red-500 transition-colors" />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2 bg-surface-2 border border-border-custom rounded-full px-2 py-0.5">
                              <button onClick={() => updateQuantity(item.id, item.variant, -1)} className="p-1 hover:text-brand transition-colors">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.variant, 1)} className="p-1 hover:text-brand transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-sm font-mono font-bold text-text-main">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-border-custom bg-surface-3/30 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-muted-main uppercase tracking-tighter">Subtotal</span>
                  <span className="text-xl font-mono font-bold text-text-main">{formatPrice(subtotal)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/cart" 
                    onClick={() => setMiniCartOpen(false)}
                    className="flex items-center justify-center bg-surface-3 text-text-main border border-border-custom py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-surface-2 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link 
                    href="/checkout" 
                    onClick={() => setMiniCartOpen(false)}
                    className="flex items-center justify-center gap-2 bg-brand text-ink py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-dim transition-colors group"
                  >
                    Checkout <CreditCard className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <p className="text-[10px] text-muted-main text-center mt-6 uppercase tracking-widest opacity-60">
                  Shipping and taxes calculated at checkout.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
