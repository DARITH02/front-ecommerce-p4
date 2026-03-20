'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RefreshCcw, CreditCard } from 'lucide-react';

const trustItems = [
  { icon: Truck, title: 'Free Global Shipping', desc: 'Complimentary standard shipping on all orders over $200' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: 'Fully encrypted and specialized data protection' },
  { icon: RefreshCcw, title: '30-Day Returns', desc: 'No questions asked policy for premium customer care' },
  { icon: CreditCard, title: 'Installment Options', desc: 'Enjoy 4 interest-free payments with Klarna or Afterpay' },
];

export default function TrustStrip() {
  return (
    <section className="bg-surface-2 border-y border-border-custom py-12 relative overflow-hidden">
      <div className="w-11/12 mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {trustItems.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-start gap-6 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center text-brand border border-white/5 shadow-lg group-hover:scale-110 group-hover:bg-brand group-hover:text-ink transition-all duration-500">
              <item.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-medium uppercase tracking-widest text-text-main">{item.title}</h4>
              <p className="text-xs text-muted-main leading-relaxed font-light">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-brand/5 blur-[100px] pointer-events-none" />
    </section>
  );
}
