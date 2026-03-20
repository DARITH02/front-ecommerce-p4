'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, CreditCard, ShoppingBag, Truck, MapPin, 
  ShieldCheck, CheckCircle, Info, Lock, ArrowRight, ChevronLeft, Home,
  Apple, Wallet
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice } from '@/lib/utils';

const steps = ['Details', 'Delivery', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { cart } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('Standard');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = shippingMethod === 'Standard' ? 0 : shippingMethod === 'Express' ? 15 : 45;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="bg-background pt-40 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
         <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-7xl font-display font-medium text-text-main uppercase tracking-tighter leading-none mb-4">Secure Checkout</h1>
            <div className="flex items-center gap-6 justify-center md:justify-start">
               {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 group relative cursor-pointer" onClick={() => setCurrentStep(idx)}>
                     <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black tracking-widest transition-all",
                        currentStep === idx ? "bg-brand text-ink shadow-lg shadow-brand/20 scale-110" : 
                        currentStep > idx ? "bg-mint text-ink" : "bg-surface-3 text-muted-main border border-white/5"
                     )}>
                        {currentStep > idx ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                     </div>
                     <span className={cn("text-[9px] uppercase tracking-[0.4em] font-bold hidden sm:block", currentStep >= idx ? "text-text-main" : "text-muted-main")}>{step}</span>
                     {idx < steps.length - 1 && <span className="w-8 h-px bg-white/10 hidden sm:block" />}
                  </div>
               ))}
            </div>
         </div>
         
         <div className="bg-surface-3/30 border border-white/5 px-8 py-4 rounded-2xl flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/60">
            <ShieldCheck className="w-5 h-5 text-brand" /> SSL SECURED TRANSACTION
         </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-16 xl:gap-24 relative items-start">
         
         {/* Left Side: Forms */}
         <div className="flex-1 space-y-12">
            
            <AnimatePresence mode="wait">
               {currentStep === 0 && (
                  <motion.div 
                    key="step0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-12"
                  >
                     <div className="space-y-8 bg-surface-2 p-12 rounded-[40px] border border-white/5 shadow-2xl">
                        <div className="flex justify-between items-center">
                           <h3 className="text-2xl font-display font-medium text-text-main uppercase tracking-tight">Contact Editorial</h3>
                           <Link href="/login" className="text-[10px] text-brand font-black uppercase tracking-widest border-b border-brand/20 pb-1">Log in for faster checkout</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Digital Address (Email)</label>
                              <input type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-surface-3 border border-white/5 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Telephone</label>
                              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-surface-3 border border-white/5 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8 bg-surface-2 p-12 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <h3 className="text-2xl font-display font-medium text-text-main uppercase tracking-tight relative z-10">Shipping Silhouette</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                           <div className="md:col-span-2 space-y-3">
                              <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Full Legal Name</label>
                              <input type="text" placeholder="ALEXANDER VOLT" className="w-full bg-surface-3 border border-white/5 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                           </div>
                           <div className="md:col-span-2 space-y-3">
                              <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Shipping Destination (Full Address)</label>
                              <div className="relative group">
                                 <input type="text" placeholder="123 MODERNIST AVE, EDITORIAL DISTRICT" className="w-full bg-surface-3 border border-white/5 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                                 <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Metropolitan / City</label>
                              <input type="text" placeholder="NEW YORK" className="w-full bg-surface-3 border border-white/5 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Zip / Postal Core</label>
                              <input type="text" placeholder="10001" className="w-full bg-surface-3 border border-white/5 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                           </div>
                        </div>
                        <div className="absolute top-0 right-0 py-12 px-24 font-black text-9xl text-white opacity-[0.02] -rotate-12 select-none pointer-events-none">LUMINA</div>
                     </div>
                  </motion.div>
               )}

               {currentStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-12"
                  >
                     <div className="space-y-12 bg-surface-2 p-12 rounded-[40px] border border-white/5 shadow-2xl">
                        <h3 className="text-2xl font-display font-medium text-white uppercase tracking-tight">Delivery Priority</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {[
                              { name: 'Standard', price: 'COMPLIMENTARY', date: 'Thu, Jun 12', desc: 'Standard editorial delivery' },
                              { name: 'Express', price: '$15.00', date: 'Tue, Jun 10', desc: 'Accelerated global shipping' },
                              { name: 'Overnight', price: '$45.00', date: 'Mon, Jun 9', desc: 'Priority next-day service' },
                           ].map((option) => (
                              <button 
                                key={option.name}
                                onClick={() => setShippingMethod(option.name)}
                                className={cn(
                                   "flex flex-col p-8 rounded-3xl border-2 transition-all text-left space-y-4 group h-full",
                                   shippingMethod === option.name ? "bg-brand/10 border-brand shadow-xl shadow-brand/10" : "bg-surface-3 border-white/5 hover:border-white/20"
                                )}
                              >
                                 <div className="flex justify-between items-center w-full">
                                    <h4 className={cn("text-lg font-display uppercase tracking-tight font-medium", shippingMethod === option.name ? "text-brand" : "text-white group-hover:text-brand")}>{option.name}</h4>
                                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", shippingMethod === option.name ? "border-brand bg-brand" : "border-white/20")}>
                                       {shippingMethod === option.name && <CheckCircle className="w-4 h-4 text-ink" />}
                                    </div>
                                 </div>
                                 <p className="text-xs text-muted-main uppercase tracking-widest font-bold font-mono">{option.price}</p>
                                 <div className="space-y-1 pt-4">
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Estimated Arrival</span>
                                    <p className="text-sm text-white font-bold">{option.date}</p>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               )}

               {currentStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-12"
                  >
                     <div className="space-y-12 bg-surface-2 p-12 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden relative">
                        <div className="flex justify-between items-end relative z-10">
                           <div className="space-y-4">
                              <h3 className="text-2xl font-display font-medium text-white uppercase tracking-tight leading-none">Global Payment Core</h3>
                              <p className="text-[10px] text-brand font-black uppercase tracking-widest uppercase italic">Fully encrypted and specialized data protection</p>
                           </div>
                           <div className="flex gap-4">
                              <Apple className="w-8 h-8 text-white/20 grayscale hover:grayscale-0 hover:text-white transition-all cursor-pointer" />
                              <Wallet className="w-8 h-8 text-white/20 grayscale hover:grayscale-0 hover:text-white transition-all cursor-pointer" />
                           </div>
                        </div>

                        <div className="space-y-12 relative z-10">
                           <div className="space-y-6">
                              <div className="flex items-center gap-6 p-6 bg-surface-3 border border-brand/40 rounded-3xl group cursor-pointer shadow-xl shadow-brand/5">
                                 <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center border-4 border-brand/20">
                                    <div className="w-2 h-2 bg-ink rounded-full" />
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <CreditCard className="w-6 h-6 text-brand" />
                                    <span className="text-sm font-bold uppercase tracking-widest text-white">Credit / Debit Card Element</span>
                                 </div>
                              </div>
                              <div className="p-12 bg-surface-3/50 border border-white/5 rounded-3xl space-y-8 animate-in fade-in duration-700">
                                 <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Cardholder Nominee</label>
                                    <input type="text" placeholder="ALEXANDER VOLT" className="w-full bg-surface-2 border border-white/10 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Card Digest Number</label>
                                    <div className="relative group">
                                       <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-surface-2 border border-white/10 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                                       <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:text-brand transition-colors" />
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Expiry Timeline</label>
                                       <input type="text" placeholder="MM / YY" className="w-full bg-surface-2 border border-white/10 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] uppercase font-bold text-muted-main tracking-widest pl-4">Security CVC</label>
                                       <input type="text" placeholder="•••" className="w-full bg-surface-2 border border-white/10 px-6 py-5 rounded-2xl focus:border-brand/40 transition-all text-xs font-bold uppercase tracking-widest" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center justify-between text-[9px] text-muted-main font-bold uppercase tracking-widest opacity-60">
                              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 256-BIT EDITORIAL SECURITY</span>
                              <span className="flex items-center gap-2 font-mono">STRIKE GATEWAY ACTIVE <div className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" /></span>
                           </div>
                        </div>
                        
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand opacity-5 blur-[120px] rounded-full select-none pointer-events-none" />
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Stepper Controls */}
            <div className="flex flex-col md:flex-row gap-6">
               {currentStep > 0 && (
                  <button onClick={prevStep} className="flex-1 bg-surface-2 text-white border border-white/10 py-6 rounded-full text-xs font-black uppercase tracking-widest hover:bg-surface-3 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                     <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Previous Stage
                  </button>
               )}
               <button 
                 onClick={nextStep}
                 className="flex-[2] bg-brand text-ink py-6 rounded-full text-xs font-black uppercase tracking-[0.25em] hover:bg-brand-dim hover:text-white transition-all shadow-2xl shadow-brand/20 active:scale-95 flex items-center justify-center gap-4 group"
               >
                  {currentStep === steps.length - 1 ? 'Execute Total Investment' : 'Navigate To Next Stage'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>

         {/* Right Sidebar: Summary */}
         <div className="w-full xl:w-[480px] sticky top-32">
            <div className="bg-surface-2 rounded-[40px] border border-white/5 p-12 space-y-12 shadow-2xl shadow-black/40 overflow-hidden relative">
               <h3 className="text-2xl font-display font-medium text-white uppercase tracking-tight border-b border-white/10 pb-8 relative z-10">Editorial Selection</h3>
               <div className="space-y-10 relative z-10">
                  <div className="max-h-[320px] overflow-y-auto scrollbar-hide space-y-6">
                     {cart.map((item) => (
                        <div key={`${item.id}-${item.variant}`} className="flex gap-6 group">
                           <div className="relative w-20 h-28 bg-surface-3 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                              <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-2 right-2 w-5 h-5 bg-brand text-ink text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">{item.quantity}</div>
                           </div>
                           <div className="flex-1 flex flex-col justify-between py-1">
                              <div className="space-y-1">
                                 <h4 className="text-sm font-medium text-white uppercase tracking-tight group-hover:text-brand transition-colors line-clamp-1">{item.name}</h4>
                                 <p className="text-[10px] text-muted-main uppercase tracking-widest font-bold opacity-60">{item.variant || 'Standard Edition'}</p>
                              </div>
                              <p className="text-lg font-mono font-bold text-white tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="space-y-6 pt-10 border-t border-white/10">
                     <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest font-mono">
                        <span className="text-muted-main">Sub-Collection Bag</span>
                        <span className="text-white">{formatPrice(subtotal)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest font-mono">
                        <span className="text-muted-main">Priority Delivery ({shippingMethod})</span>
                        <span className={cn("text-white", shipping === 0 ? "text-mint font-black" : "")}>{shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest font-mono border-b border-white/10 pb-8">
                        <span className="text-muted-main">Editorial Taxes (8%)</span>
                        <span className="text-white">{formatPrice(taxes)}</span>
                     </div>
                     
                     <div className="flex justify-between items-center pt-4">
                        <span className="text-lg font-display font-medium text-white uppercase tracking-widest">Aggregate Total</span>
                        <div className="space-y-1 text-right">
                           <p className="text-4xl font-mono font-black text-brand tracking-widest shadow-brand/20 drop-shadow-xl">{formatPrice(total)}</p>
                           <p className="text-[9px] text-muted-main font-bold uppercase tracking-widest opacity-40">Settling in Store Base Currency (USD)</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Background Accent */}
               <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand/10 blur-[100px] pointer-events-none" />
            </div>

            <div className="mt-8 p-10 bg-surface-3/30 border border-white/5 rounded-[32px] text-center space-y-6">
               <div className="flex justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                  {[Apple, Wallet, ShoppingBag, ShieldCheck].map((Icon, idx) => <Icon key={idx} className="w-5 h-5 text-white" />)}
               </div>
               <p className="text-[9px] text-muted-main uppercase tracking-[0.3em] font-bold leading-relaxed px-4">
                  By executing this total investment, you acknowledge the Lumina Editorial <Link href="/terms" className="text-brand hover:underline">Terms of Craftsmanship</Link> and <Link href="/privacy" className="text-brand hover:underline">Privacy Narrative</Link>.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}
