'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Truck, MapPin, ShieldCheck, CheckCircle,
  ArrowRight, ChevronLeft, Apple, Wallet, Loader2, Lock,
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice } from '@/lib/utils';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/routing';

const STEPS = ['Details', 'Delivery', 'Payment', 'Review'];

const inputCls =
  'w-full bg-surface-2 border border-border-custom rounded-xl px-4 py-3.5 text-[14px] text-text-main placeholder:text-muted-main/50 focus:outline-none focus:border-brand/40 transition-colors';

const labelCls = 'block text-[11px] font-medium text-muted-main uppercase tracking-widest mb-2';

const fadeSlide = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -12 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
};

export default function CheckoutPage() {
  const { cart, user, token, clearCart } = useStore();
  const router = useRouter();
  const [currentStep, setCurrentStep]     = useState(0);
  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [isProcessing, setIsProcessing]   = useState(false);
  const [isSuccess, setIsSuccess]         = useState(false);
  const [orderResult, setOrderResult]     = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    name:  user?.name  || '',
    address: '', city: '', zip: '',
    cardName: user?.name || '',
    cardNumber: '', expiry: '', cvc: '',
  });

  const set = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }));

  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = shippingMethod === 'Express' ? 15 : shippingMethod === 'Overnight' ? 45 : 0;
  const taxes    = subtotal * 0.08;
  const total    = subtotal + shipping + taxes;

  const nextStep = () => {
    if (currentStep === STEPS.length - 1) handleCompletePurchase();
    else setCurrentStep(p => p + 1);
  };
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0));

  const handleCompletePurchase = async () => {
    if (!cart.length) return;
    setIsProcessing(true);
    try {
      const res = await api.orders.checkout({
        items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
        shipping_method: shippingMethod,
        shipping_cost: shipping, tax: taxes, total_amount: total,
        payment_method: 'card',
        customer_info: { name: formData.name, email: formData.email, phone: formData.phone, address: formData.address, city: formData.city, zip: formData.zip },
        payment_info: { method: 'card', last_four: formData.cardNumber.slice(-4) },
      }, token);
      setOrderResult(res);
      setIsSuccess(true);
      clearCart();
      toast.success('Order placed successfully.');
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main pt-32 pb-24">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">

        {/* ── Page header ── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-main tracking-widest uppercase mb-6">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-text-main/50">Checkout</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-[42px] md:text-[60px] font-bold tracking-[-2.5px] leading-none uppercase font-display">Checkout</h1>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-main pb-1.5 uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5 text-brand" /> SSL secured
            </div>
          </div>
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-2 mb-12">
          {STEPS.map((step, idx) => {
            const done   = currentStep > idx;
            const active = currentStep === idx;
            return (
              <div key={idx} className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(idx)}
                  className="flex items-center gap-2 group"
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all',
                    done   ? 'bg-mint text-ink' :
                    active ? 'bg-brand text-ink shadow-lg shadow-brand/20' :
                             'bg-surface-3 text-muted-main border border-border-custom'
                  )}>
                    {done ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={cn(
                    'text-[11px] font-bold uppercase tracking-widest hidden sm:block transition-colors',
                    active ? 'text-text-main' : 'text-muted-main'
                  )}>
                    {step}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={cn('w-8 h-px mx-1 transition-colors', done ? 'bg-mint/30' : 'bg-border-custom')} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* ── Left: Forms ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[32px] border border-border-custom bg-surface-2 p-12 text-center space-y-8"
              >
                <div className="w-16 h-16 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-mint" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-medium uppercase tracking-tighter mb-2">Order Confirmed</h2>
                  <p className="text-[13px] text-muted-main uppercase tracking-widest">
                    Order #{orderResult?.order_number || 'LMN-2026'} is on its way.
                    We'll email you a tracking link shortly.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/account" className="flex-1 py-4 rounded-full border border-border-custom text-[11px] font-black uppercase tracking-widest text-text-main hover:bg-surface-3 transition-colors text-center">
                    View Orders
                  </Link>
                  <Link href="/shop" className="flex-1 py-4 rounded-full bg-brand text-ink text-[11px] font-black uppercase tracking-widest hover:bg-ink hover:text-brand transition-colors text-center">
                    Continue Shopping
                  </Link>
                </div>

                <div className="pt-8 border-t border-border-custom/50 mt-8">
                  <div className={cn(
                    "rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all",
                    orderResult?.telegram_linked ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-brand/5 border border-brand/10"
                  )}>
                    <div className="flex items-center gap-4 text-left">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                        orderResult?.telegram_linked ? "bg-emerald-500 shadow-emerald-500/20" : "bg-brand shadow-brand/20"
                      )}>
                         <Image src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" width={24} height={24} className={orderResult?.telegram_linked ? "brightness-0 invert" : ""} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold uppercase tracking-tight">
                          {orderResult?.telegram_linked ? "Telegram Connected" : "Order Tracking"}
                        </p>
                        <p className="text-[11px] text-muted-main font-medium uppercase tracking-widest leading-relaxed">
                          {orderResult?.telegram_notified 
                            ? "We've sent a detailed confirmation to your Telegram." 
                            : orderResult?.telegram_linked 
                            ? "Your account is linked, but notification failed. Please check the bot."
                            : "Connect with our Telegram Bot for instant order updates."}
                        </p>
                      </div>
                    </div>
                    {!orderResult?.telegram_linked && (
                      <a 
                        href="https://t.me/aura_bot_hotel_bot" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="whitespace-nowrap bg-brand text-ink px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                      >
                        Connect Bot
                      </a>
                    )}
                    {orderResult?.telegram_linked && (
                      <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle className="w-4 h-4" /> Active
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="wait">

                  {/* Step 0 — Details */}
                  {currentStep === 0 && (
                    <motion.div key="step0" {...fadeSlide} className="space-y-4">

                      {/* Contact */}
                      <div className="rounded-[24px] border border-border-custom bg-surface-2 p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[14px] font-bold uppercase tracking-widest text-text-main">Contact</h3>
                          <Link href="/login" className="text-[11px] font-black uppercase tracking-widest text-brand hover:text-text-main transition-colors">
                            Log in →
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className={labelCls}>Email</label>
                            <input type="email" value={formData.email} onChange={set('email')} placeholder="you@example.com" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Phone</label>
                            <input type="tel" value={formData.phone} onChange={set('phone')} placeholder="+1 555 000 0000" className={inputCls} />
                          </div>
                        </div>
                      </div>

                      {/* Shipping address */}
                      <div className="rounded-[24px] border border-border-custom bg-surface-2 p-8 space-y-6">
                        <h3 className="text-[14px] font-bold uppercase tracking-widest text-text-main">Shipping Address</h3>
                        <div>
                          <label className={labelCls}>Full Name</label>
                          <input type="text" value={formData.name} onChange={set('name')} placeholder="Jane Smith" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Address</label>
                          <div className="relative">
                            <input type="text" value={formData.address} onChange={set('address')} placeholder="123 Main St" className={inputCls} />
                            <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand pointer-events-none" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className={labelCls}>City</label>
                            <input type="text" value={formData.city} onChange={set('city')} placeholder="New York" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>ZIP / Postal</label>
                            <input type="text" value={formData.zip} onChange={set('zip')} placeholder="10001" className={inputCls} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1 — Delivery */}
                  {currentStep === 1 && (
                    <motion.div key="step1" {...fadeSlide}>
                      <div className="rounded-[24px] border border-border-custom bg-surface-2 p-8 space-y-6">
                        <h3 className="text-[14px] font-bold uppercase tracking-widest mb-6">Shipping Method</h3>
                        <div className="space-y-4">
                          {[
                            { name: 'Standard', price: 0,  arrival: 'Thu, Jun 12', desc: '5–7 business days' },
                            { name: 'Express',  price: 15, arrival: 'Tue, Jun 10', desc: '2–3 business days' },
                            { name: 'Overnight',price: 45, arrival: 'Mon, Jun 9',  desc: 'Next business day' },
                          ].map((opt) => {
                            const selected = shippingMethod === opt.name;
                            return (
                              <button
                                key={opt.name}
                                onClick={() => setShippingMethod(opt.name)}
                                className={cn(
                                  'w-full flex items-center justify-between p-6 rounded-2xl border text-left transition-all',
                                  selected
                                    ? 'border-brand bg-brand/5 shadow-lg shadow-brand/5'
                                    : 'border-border-custom bg-surface-3 hover:border-brand/30'
                                )}
                              >
                                <div className="flex items-center gap-5">
                                  <div className={cn(
                                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                                    selected ? 'border-brand bg-brand' : 'border-border-custom'
                                  )}>
                                    {selected && <div className="w-2 h-2 rounded-full bg-ink" />}
                                  </div>
                                  <div>
                                    <p className="text-[15px] font-bold uppercase tracking-tight">{opt.name}</p>
                                    <p className="text-[11px] font-mono text-muted-main uppercase tracking-widest">{opt.desc} · arrives {opt.arrival}</p>
                                  </div>
                                </div>
                                <span className="text-[13px] font-bold font-mono text-text-main">
                                  {opt.price === 0 ? 'FREE' : formatPrice(opt.price)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 — Payment */}
                  {currentStep === 2 && (
                    <motion.div key="step2" {...fadeSlide}>
                      <div className="rounded-[24px] border border-border-custom bg-surface-2 p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[14px] font-bold uppercase tracking-widest">Payment</h3>
                          <div className="flex items-center gap-4 text-muted-main/40">
                            <Apple className="w-6 h-6 hover:text-text-main transition-colors cursor-pointer" />
                            <Wallet className="w-6 h-6 hover:text-text-main transition-colors cursor-pointer" />
                          </div>
                        </div>

                        {/* Card type selector (decorative) */}
                        <div className="flex items-center gap-4 p-5 rounded-2xl border border-brand/20 bg-brand/5">
                          <div className="w-5 h-5 rounded-full border-2 border-brand bg-brand flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-full bg-ink" />
                          </div>
                          <CreditCard className="w-5 h-5 text-brand" />
                          <span className="text-[12px] font-black uppercase tracking-widest text-text-main">Credit / Debit Card</span>
                        </div>

                        <div className="space-y-5 pt-2">
                          <div>
                            <label className={labelCls}>Cardholder Name</label>
                            <input type="text" value={formData.cardName} onChange={set('cardName')} placeholder="Jane Smith" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Card Number</label>
                            <div className="relative">
                              <input type="text" value={formData.cardNumber} onChange={set('cardNumber')} placeholder="0000 0000 0000 0000" className={inputCls} />
                              <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-main/30 pointer-events-none" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className={labelCls}>Expiry</label>
                              <input type="text" value={formData.expiry} onChange={set('expiry')} placeholder="MM / YY" className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>CVC</label>
                              <input type="password" value={formData.cvc} onChange={set('cvc')} placeholder="•••" className={inputCls} />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 text-[10px] text-muted-main uppercase font-black tracking-widest opacity-60">
                          <ShieldCheck className="w-4 h-4 text-brand" /> 256-BIT SSL EDITORIAL ENCRYPTION
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 — Review */}
                  {currentStep === 3 && (
                    <motion.div key="step3" {...fadeSlide} className="space-y-4">
                      <div className="rounded-[24px] border border-border-custom bg-surface-2 p-8 space-y-8">
                        <h3 className="text-[15px] font-bold uppercase tracking-widest">Review Collection</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Shipping address */}
                          <div className="p-6 rounded-2xl bg-surface-3 border border-border-custom space-y-2">
                            <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-4">Shipping To</p>
                            <p className="text-[14px] font-bold uppercase tracking-tight">{formData.name}</p>
                            <p className="text-[12px] text-muted-main uppercase tracking-widest">{formData.address}</p>
                            <p className="text-[12px] text-muted-main uppercase tracking-widest">{formData.city}{formData.zip ? `, ${formData.zip}` : ''}</p>
                          </div>

                          {/* Contact */}
                          <div className="p-6 rounded-2xl bg-surface-3 border border-border-custom space-y-2">
                            <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-4">Contact Channel</p>
                            <p className="text-[14px] font-bold uppercase tracking-tight">{formData.email}</p>
                            <p className="text-[12px] text-muted-main uppercase tracking-widest">{formData.phone}</p>
                          </div>

                          {/* Delivery */}
                          <div className="p-6 rounded-2xl bg-surface-3 border border-border-custom flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Delivery Priority</p>
                              <p className="text-[14px] font-bold uppercase tracking-tight">{shippingMethod}</p>
                            </div>
                            <span className="text-[13px] font-mono font-bold text-text-main">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                          </div>

                          {/* Payment */}
                          <div className="p-6 rounded-2xl bg-surface-3 border border-border-custom flex items-center gap-4">
                            <CreditCard className="w-5 h-5 text-brand shrink-0" />
                            <div>
                              <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Mechanism</p>
                              <p className="text-[14px] font-bold uppercase tracking-tight">•••• {formData.cardNumber.slice(-4) || '—'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <p className="text-[10px] text-muted-main text-center px-8 leading-relaxed uppercase tracking-widest font-bold opacity-60">
                        By executing this collection you agree to our{' '}
                        <Link href="/terms" className="text-brand hover:underline">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-brand hover:underline">Privacy</Link>.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Step navigation ── */}
                <div className="flex gap-4 pt-4">
                  {currentStep > 0 && (
                    <button
                      onClick={prevStep}
                      disabled={isProcessing}
                      className="flex items-center gap-3 px-8 py-4 rounded-full border border-border-custom text-[11px] font-black uppercase tracking-widest text-text-main hover:bg-surface-3 transition-colors disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    disabled={isProcessing || cart.length === 0}
                    className="flex-1 flex items-center justify-center gap-3 py-5 rounded-full bg-brand text-ink text-[11px] font-black uppercase tracking-[0.2em] hover:bg-ink hover:text-brand disabled:opacity-40 transition-all shadow-xl shadow-brand/10 active:scale-95"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                    ) : currentStep === STEPS.length - 1 ? (
                      'Execute Collection'
                    ) : (
                      <>{STEPS[currentStep + 1]} <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Right: Order summary ── */}
          <div className="w-full xl:w-[400px] shrink-0 sticky top-32">
            <div className="rounded-[32px] border border-border-custom bg-surface-2 p-8 space-y-8 shadow-2xl shadow-black/20">
              <h3 className="text-[15px] font-display font-medium uppercase tracking-tight text-text-main pb-4 border-b border-border-custom">Editorial Selection</h3>

              {/* Items */}
              <div className="space-y-6 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex gap-5 group">
                    <div className="relative w-16 h-24 rounded-2xl overflow-hidden shrink-0 bg-surface-3 border border-border-custom">
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand text-ink text-[10px] font-black flex items-center justify-center shadow-lg">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                      <p className="text-[13px] font-bold uppercase tracking-tight leading-tight line-clamp-2 text-text-main group-hover:text-brand transition-colors">{item.name}</p>
                      {item.variant && <p className="text-[10px] uppercase font-black tracking-widest text-muted-main opacity-60">{item.variant}</p>}
                      <p className="text-[15px] font-mono font-bold text-text-main">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 pt-6 border-t border-border-custom">
                {[
                  { label: 'Sub-Collection', value: formatPrice(subtotal) },
                  { label: 'Priority Delivery', value: shipping === 0 ? 'FREE' : formatPrice(shipping) },
                  { label: 'Editorial Tax (8%)', value: formatPrice(taxes) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-muted-main">
                    <span>{label}</span>
                    <span className="text-text-main font-mono">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-6 border-t border-border-custom">
                  <span className="text-[14px] font-display font-medium uppercase tracking-widest text-text-main">Total Investment</span>
                  <span className="text-[28px] font-mono font-black text-brand tracking-tighter drop-shadow-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-3 pt-2 text-[10px] text-muted-main uppercase font-black tracking-[0.3em] opacity-40">
                <ShieldCheck className="w-4 h-4" />
                SECURE CHECKOUT
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}