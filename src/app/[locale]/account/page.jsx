'use client';

import { useState } from 'react';
import { 
  User, Package, Heart, MapPin, CreditCard, Settings, 
  LogOut, ChevronRight, Star, ShoppingBag, Clock, Calendar, ArrowRight
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
  { id: 'overview', label: 'Editorial Overview', icon: User },
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'wishlist', label: 'Wishlist Silhouette', icon: Heart },
  { id: 'addresses', label: 'Digital addresses', icon: MapPin },
  { id: 'payments', label: 'Payment Core', icon: CreditCard },
  { id: 'settings', label: 'General Settings', icon: Settings },
];

const mockOrders = [
  { id: 'LMN-00452', status: 'Delivered', date: 'Oct 12, 2025', total: 450, items: 2 },
  { id: 'LMN-00431', status: 'Shipped', date: 'Oct 08, 2025', total: 1200, items: 3 },
  { id: 'LMN-00388', status: 'Processing', date: 'Sep 24, 2025', total: 299, items: 1 },
];

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const { wishlist, cart } = useStore();

  return (
    <div className="bg-surface pt-40 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="mb-20 space-y-4">
         <div className="flex items-center gap-3 text-[10px] text-brand font-black uppercase tracking-[0.4em] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-white">Account Portfolio</span>
         </div>
         <h1 className="text-4xl md:text-7xl font-display font-medium text-white uppercase tracking-tighter leading-none">
            Member <span className="text-brand">Lounge.</span>
         </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
         
         {/* Sidebar Navigation */}
         <aside className="w-full lg:w-72 shrink-0 bg-surface-2 p-8 rounded-[40px] border border-white/5 space-y-4 shadow-2xl">
            {sidebarItems.map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveSection(item.id)}
                 className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all group",
                    activeSection === item.id ? "bg-brand text-ink shadow-lg shadow-brand/20" : "text-muted-main hover:bg-white/5 hover:text-white"
                 )}
               >
                 <div className="flex items-center gap-4">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                 </div>
                 {activeSection === item.id ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
               </button>
            ))}
            <div className="pt-8 border-t border-white/10 mt-8">
               <button className="w-full flex items-center gap-4 p-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-2xl">
                  <LogOut className="w-4 h-4" /> Editorial Logout
               </button>
            </div>
         </aside>

         {/* Content Area */}
         <main className="flex-1 space-y-12">
            
            <AnimatePresence mode="wait">
               {activeSection === 'overview' && (
                  <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                     {/* Greeting Card */}
                     <div className="bg-surface-2 p-12 rounded-[40px] border border-white/5 relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                           <div className="space-y-6 text-center md:text-left">
                              <h2 className="text-4xl md:text-5xl font-display font-medium text-white uppercase tracking-tighter leading-none">Greetings, Alexander<span className="text-brand">.</span></h2>
                              <p className="text-sm text-muted-main uppercase tracking-widest font-bold leading-relaxed max-w-sm italic opacity-80">Welcome to your curated editorial lounge. Explore your selection, track your investment, and refine your silhouette.</p>
                              <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                                 <button className="bg-brand text-ink px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-dim hover:text-white transition-all shadow-xl shadow-brand/20">Edit Portfolio</button>
                                 <button className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Member ID: LMN-2401</button>
                              </div>
                           </div>
                           <div className="w-48 h-48 rounded-full border border-brand/20 p-2 shadow-2xl shadow-brand/10 relative group-hover:scale-105 transition-transform duration-700">
                              <div className="w-full h-full rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                                 <Image src="https://i.pravatar.cc/300?u=a" alt="Profile" fill className="object-cover" />
                              </div>
                           </div>
                        </div>
                        <div className="absolute top-0 right-0 py-8 px-12 text-white opacity-[0.02] font-black text-9xl tracking-tighter select-none pointer-events-none">LUMINA</div>
                     </div>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                           { label: 'Lumina Points', value: '4,250', unit: 'PTS', color: 'text-brand' },
                           { label: 'Active Wishlist', value: wishlist.length, unit: 'PIECES' },
                           { label: 'Orders Placed', value: mockOrders.length, unit: 'TOTAL' },
                        ].map((stat, idx) => (
                           <div key={idx} className="bg-surface-2 p-8 rounded-[32px] border border-white/5 shadow-xl hover:border-brand/30 transition-all">
                              <p className="text-[10px] text-muted-main font-black uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                              <div className="flex items-end gap-3">
                                 <span className={cn("text-5xl font-display font-bold tracking-tighter", stat.color || "text-white")}>{stat.value}</span>
                                 <span className="text-[10px] font-bold text-muted-main uppercase tracking-widest mb-1">{stat.unit}</span>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Recent Order Preview */}
                     <div className="space-y-8 h-[400px]">
                        <h3 className="text-2xl font-display font-medium text-white uppercase tracking-tight border-b border-white/5 pb-6">Immediate Investment Status</h3>
                        <div className="bg-surface-2 p-10 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 group">
                           <div className="flex items-center gap-8">
                              <div className="w-20 h-28 bg-surface-3 rounded-2xl flex items-center justify-center text-brand border border-white/5 group-hover:scale-105 transition-transform">
                                 <Package className="w-8 h-8" />
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[10px] text-brand font-black uppercase tracking-widest">ORDER #LMN-00452</p>
                                 <h4 className="text-2xl font-display font-medium text-white uppercase">In Transit Transit</h4>
                                 <p className="text-xs text-muted-main uppercase tracking-widest font-bold">Estimated Delivery: <b>Thu, Jun 12</b></p>
                              </div>
                           </div>
                           <button className="w-full md:w-fit bg-white text-ink px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand hover:text-white transition-all shadow-xl">
                              Track Editorial Package
                           </button>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeSection === 'orders' && (
                  <motion.div 
                    key="orders"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                     <h3 className="text-3xl font-display font-medium text-white uppercase tracking-tight">Investment Chronicles</h3>
                     <div className="space-y-6">
                        {mockOrders.map((order) => (
                           <div key={order.id} className="bg-surface-2 p-8 rounded-[32px] border border-white/5 hover:border-brand/20 transition-all group">
                              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                 <div className="flex gap-8 items-center">
                                    <div className="w-16 h-16 bg-surface-3 rounded-2xl flex items-center justify-center text-muted-main group-hover:text-brand transition-colors">
                                       <Package className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                       <h4 className="text-lg font-display font-medium text-white uppercase tracking-tighter">ORDER NO: {order.id}</h4>
                                       <p className="text-[10px] text-muted-main uppercase tracking-widest font-black flex items-center gap-2">
                                          <Calendar className="w-3 h-3" /> {order.date} • {order.items} Pieces
                                       </p>
                                    </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-12">
                                    <div className="text-right space-y-1">
                                       <p className="text-[10px] text-muted-main uppercase tracking-widest font-black">Investment Total</p>
                                       <p className="text-xl font-mono font-bold text-white tracking-widest">{formatPrice(order.total)}</p>
                                    </div>
                                    <div className={cn(
                                       "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                       order.status === 'Delivered' ? "bg-mint/10 border-mint text-mint" : "bg-brand/10 border-brand text-brand"
                                    )}>
                                       {order.status}
                                    </div>
                                    <button className="p-4 hover:bg-white/5 rounded-full transition-all group/arrow">
                                       <ArrowRight className="w-5 h-5 group-hover/arrow:translate-x-1 transition-transform" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               )}

               {activeSection === 'wishlist' && (
                  <motion.div 
                    key="wishlist"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                     <h3 className="text-3xl font-display font-medium text-white uppercase tracking-tight">Wishlist Library</h3>
                     {wishlist.length === 0 ? (
                        <div className="bg-surface-2 p-24 rounded-[40px] text-center space-y-8 border border-white/5 border-dashed">
                           <Heart className="w-16 h-16 text-muted-main/20 mx-auto" />
                           <h4 className="text-2xl font-display font-medium text-muted-main uppercase tracking-widest">Library Empty</h4>
                           <Link href="/shop" className="inline-flex items-center gap-4 bg-brand text-ink px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-dim hover:text-white transition-all shadow-xl">
                              Browse Collections <ArrowRight className="w-5 h-5" />
                           </Link>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 h-[500px]">
                           {/* Products would be mapped here */}
                        </div>
                     )}
                  </motion.div>
               )}
            </AnimatePresence>

         </main>
      </div>
    </div>
  );
}
