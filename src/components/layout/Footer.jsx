'use client';

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Instagram, Twitter, Facebook, ArrowRight, MapPin, 
  Phone, Mail, Check, CreditCard, Sparkles, ShoppingBag, Youtube, Send, Apple, Wallet
} from 'lucide-react';

const footerLinks = {
  Shop: ['New Arrivals', 'Best Sellers', 'Men\'s Collection', 'Women\'s Collection', 'Accessories', 'Sale'],
  Help: ['Shipping Policy', 'Returns & Exchanges', 'Size Guide', 'Track Order', 'FAQ', 'Contact Us'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility Statement', 'Legal Notice'],
};

export default function Footer() {
  return (
    <footer className="footer bg-background border-t border-border-custom text-text-main pt-24 pb-12 transition-all duration-500 overflow-hidden relative">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 relative z-10">
        
        {/* Brand Column */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-display font-bold tracking-tight">
              LUMINA<span className="text-brand">.</span>
            </span>
          </div>
          <p className="text-muted-main text-sm max-w-sm leading-relaxed">
            Redefining luxury through minimalist design and premium editorial craftsmanship. 
            Join our global community and experience the future of digital commerce.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, idx) => (
              <Link 
                key={idx} 
                href="#" 
                className="w-10 h-10 rounded-full border border-border-custom flex items-center justify-center text-muted-main hover:text-brand hover:border-brand transition-all duration-300 hover:-translate-y-1 bg-surface-2"
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>

          {/* Newsletter Snippet */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-main/80">Stay Inspired</h4>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-surface-2 border border-border-custom rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-brand transition-all pr-12"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand text-ink rounded-full flex items-center justify-center hover:bg-brand-dim transition-colors">
                <Send className="w-4 h-4 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>

        {/* Links Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand">{title}</h4>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link}>
                  <Link 
                    href="#" 
                    className="text-muted-main hover:text-text-main transition-colors text-sm hover:translate-x-1 inline-block duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 mt-24 pt-12 border-t border-border-custom flex flex-col md:flex-row justify-between items-center gap-8 text-neutral-500">
        <div className="flex flex-col md:flex-row items-center gap-4 text-xs tracking-wider uppercase font-medium">
          <p>© 2025 LUMINA STORE. ALL RIGHTS RESERVED.</p>
          <span className="hidden md:inline">•</span>
          <p>BUILT BY ANTIGRAVITY</p>
        </div>

        {/* Payment Icons */}
        <div className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           {[CreditCard, Apple, Wallet].map((Icon, idx) => (
             <Icon key={idx} className="w-6 h-6 hover:text-brand cursor-default" />
           ))}
           <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest font-bold">Stripe Secured</span>
        </div>

        {/* Language Picker */}
        <div className="flex items-center gap-2 group cursor-pointer hover:text-text-main transition-colors text-muted-main">
          <span className="text-xs font-bold tracking-widest">ENGLISH / USD</span>
          <div className="w-4 h-4 rounded-full bg-surface-3 flex items-center justify-center group-hover:bg-brand">
            <div className="w-1.5 h-1.5 bg-muted-main rounded-full group-hover:bg-ink"></div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand opacity-[0.03] rounded-full blur-[120px] pointer-events-none"></div>
    </footer>
  );
}
