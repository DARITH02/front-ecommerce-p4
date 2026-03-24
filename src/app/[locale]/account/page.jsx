'use client';

import { useState, useEffect } from 'react';
import {
  User, Package, Heart, MapPin, CreditCard, Settings,
  LogOut, ChevronRight, ShoppingBag, Calendar, ArrowRight,
  Loader2, Mail, ShieldCheck, Sparkles, TrendingUp, X,
  Phone as PhoneIcon,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import { cn, formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/routing';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
};

const cardCls = "rounded-[32px] border border-border-custom bg-surface-2 p-8 shadow-2xl shadow-black/5";
const labelCls = "text-[11px] font-bold text-muted-main/80 uppercase tracking-widest mb-2 block";
const inputCls = "w-full pl-11 pr-4 py-3.5 rounded-xl bg-surface-3 border border-border-custom text-[14px] text-text-main placeholder:text-muted-main/40 focus:outline-none focus:border-brand/40 transition-colors";

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isFetchingOrder, setIsFetchingOrder] = useState(false);
  const { wishlist, user, token, setUser, clearAuth, addToCart, hasHydrated } = useStore();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zip: user?.zip || '',
  });
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) { router.replace('/login'); return; }
    const fetchAccountData = async () => {
      try {
        setIsLoading(true);
        const [profileData, ordersData] = await Promise.all([
          api.auth.getUser(token),
          api.orders.getAll(token),
        ]);
        if (profileData) { 
          setUser(profileData); 
          setProfileForm({ 
            name: profileData.name, 
            phone: profileData.phone || '',
            address: profileData.address || '',
            city: profileData.city || '',
            zip: profileData.zip || '',
          }); 
        }
        if (ordersData) {
          const list = Array.isArray(ordersData) ? ordersData : (ordersData.data || ordersData.orders || []);
          setOrders(list);
        }
      } catch (error) {
        if (error.message?.includes('401')) { clearAuth(); router.push('/login'); }
      } finally { setIsLoading(false); }
    };
    fetchAccountData();
  }, [token, router, setUser, clearAuth]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await api.auth.updateProfile(profileForm, token);
      const updatedUser = response.user || response;
      if (updatedUser) { 
        setUser(updatedUser); 
        toast.success('Profile updated.'); 
        setActiveSection('overview'); 
      }
    } catch { toast.error('Failed to update profile.'); }
    finally { setIsUpdating(false); }
  };

  const handleLogout = async () => {
    try { await api.auth.logout(token); } catch {}
    finally { clearAuth(); toast.success('Signed out.'); router.push('/login'); }
  };

  const handleViewOrder = async (order) => {
    if (order.items) {
      setSelectedOrder(order);
      return;
    }

    setIsFetchingOrder(true);
    try {
      const data = await api.orders.getOne(order.order_number, token);
      setSelectedOrder(data);
    } catch (error) {
      toast.error('Failed to load order details.');
      console.error(error);
    } finally {
      setIsFetchingOrder(false);
    }
  };

  const handleReorder = (order) => {
    const items = order.items || [];
    if (!items.length) return;
    items.forEach(item => {
      addToCart({
        id: item.product_id || item.id,
        name: item.product_name || item.name,
        price: item.price,
        image: item.product_image || item.image || '/placeholder.png',
      }, item.variant, item.quantity);
    });
    toast.success('Items added to cart.');
    router.push('/cart');
  };

  if (!hasHydrated || !user || isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-t-2 border-brand animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand/40" />
          </div>
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-main animate-pulse">
           Authenticating Session
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-main pt-32 pb-24 transition-colors duration-500">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] font-black text-muted-main/60 tracking-widest uppercase mb-10">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <span>/</span>
          <span className="text-muted-main">Account</span>
        </div>

        {/* Page title */}
        <div className="mb-14">
          <h1 className="text-[42px] md:text-[64px] font-bold tracking-[-2px] leading-none uppercase font-display">
            My Account
          </h1>
          <p className="text-muted-main text-sm mt-3 font-medium tracking-widest uppercase opacity-60">Manage your profile, orders & preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[240px] shrink-0">
            {/* User pill */}
            <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-surface-2 border border-border-custom shadow-xl shadow-black/5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border-custom shrink-0 ring-2 ring-brand/5">
                <Image
                  src={user.image || `https://i.pravatar.cc/80?u=${user.id}`}
                  alt="avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold truncate">{user.name}</p>
                <p className="text-[11px] text-muted-main truncate font-medium">{user.email}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all duration-300 group',
                      active
                        ? 'bg-brand text-ink shadow-lg shadow-brand/10'
                        : 'text-muted-main hover:text-text-main hover:bg-surface-2'
                    )}
                  >
                    <item.icon className={cn('w-4 h-4 shrink-0 transition-transform group-hover:scale-110', active ? 'text-ink' : 'text-muted-main/60 group-hover:text-brand')} />
                    {item.label}
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="mt-4 pt-4 border-t border-border-custom">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-muted-main/60 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ─ Overview ─ */}
              {activeSection === 'overview' && (
                <motion.div key="overview" {...fadeUp} className="space-y-6">

                  {/* Hero card */}
                  <div className="relative rounded-[32px] overflow-hidden border border-border-custom bg-surface-2 p-8 md:p-10 shadow-2xl shadow-black/5">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-3 border border-border-custom text-[10px] font-black text-muted-main tracking-widest uppercase">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Member ID · LMN-{user.id}
                        </div>
                        <div>
                          <h2 className="text-3xl md:text-5xl font-bold tracking-[-1.5px] leading-none uppercase font-display">
                            Hey, {user?.name?.split(' ')[0] || 'Member'} 👋
                          </h2>
                          <p className="text-muted-main text-sm mt-2 font-medium">Welcome back to your Lumina lounge.</p>
                        </div>
                        <button
                          onClick={() => setActiveSection('settings')}
                          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand text-ink text-[11px] font-black uppercase tracking-widest hover:bg-ink hover:text-brand transition-all shadow-xl shadow-brand/10"
                        >
                          Edit Profile <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-[24px] overflow-hidden border border-border-custom shrink-0 shadow-2xl">
                        <Image
                          src={user.image || `https://i.pravatar.cc/200?u=${user.id}`}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    {/* subtle decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Lumina Points', value: '4,250', sub: 'pts', accent: 'text-amber-500' },
                      { label: 'Wishlist', value: wishlist.length, sub: 'items' },
                      { label: 'Orders', value: orders.length, sub: 'total' },
                    ].map((s, i) => (
                      <div key={i} className="rounded-3xl border border-border-custom bg-surface-2 p-8 space-y-3 hover:border-brand/30 transition-all shadow-xl shadow-black/5 group">
                        <p className="text-[10px] text-muted-main/60 font-black uppercase tracking-widest group-hover:text-brand transition-colors">{s.label}</p>
                        <div className="flex items-end gap-1.5">
                          <span className={cn('text-4xl font-bold tracking-tighter', s.accent || 'text-text-main')}>{s.value}</span>
                          <span className="text-[11px] text-muted-main/40 mb-1.5 font-bold uppercase tracking-widest">{s.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent order */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-[11px] font-black text-muted-main uppercase tracking-[0.2em]">Latest Order</h3>
                      <button onClick={() => setActiveSection('orders')} className="text-[11px] font-black uppercase tracking-widest text-muted-main/60 hover:text-brand transition-colors flex items-center gap-2">
                        View all <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {orders.length > 0 ? (
                      <div className="flex items-center justify-between gap-6 p-6 rounded-[32px] border border-border-custom bg-surface-2 hover:border-brand/20 transition-all shadow-xl shadow-black/5 group">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-surface-3 border border-border-custom flex items-center justify-center shrink-0 group-hover:border-brand/10 transition-colors">
                            <Package className="w-6 h-6 text-muted-main/60 group-hover:text-brand transition-colors" />
                          </div>
                          <div>
                            <p className="text-[15px] font-bold tracking-tight">Order #{orders[0].order_number}</p>
                            <p className="text-[11px] text-muted-main/60 mt-1 font-bold uppercase tracking-widest flex items-center gap-2">
                              {new Date(orders[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              <span>•</span>
                              <span>{orders[0].items_count || orders[0].items?.length || '—'} items</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={cn(
                            'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest',
                            orders[0].status === 'delivered' || orders[0].status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : orders[0].status === 'cancelled'
                              ? 'bg-red-500/10 text-red-500'
                              : orders[0].status === 'shipped'
                              ? 'bg-mint/10 text-mint'
                              : orders[0].status === 'processing'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-amber-500/10 text-amber-600'
                          )}>
                            {orders[0].status}
                          </span>
                          <button 
                            onClick={() => handleViewOrder(orders[0])}
                            className="w-10 h-10 rounded-full bg-surface-3 border border-border-custom hover:bg-brand hover:text-ink flex items-center justify-center transition-all group/btn"
                          >
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-[32px] border-2 border-dashed border-border-custom/50 bg-surface-3/30 text-center">
                        <Package className="w-12 h-12 text-muted-main/20" />
                        <p className="text-[11px] text-muted-main/60 font-black uppercase tracking-widest">No order history available</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─ Orders ─ */}
              {activeSection === 'orders' && (
                <motion.div key="orders" {...fadeUp} className="space-y-8">
                  <div className="px-2">
                    <h3 className="text-3xl font-bold tracking-tight uppercase font-display">Order History</h3>
                    <p className="text-muted-main text-sm mt-2 font-medium uppercase tracking-widest opacity-60">Track and review your past purchases</p>
                  </div>

                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[24px] border border-border-custom bg-surface-2 hover:border-brand/20 transition-all group shadow-sm hover:shadow-xl hover:shadow-black/5">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-surface-3 border border-border-custom flex items-center justify-center shrink-0 group-hover:border-brand/10 transition-colors">
                              <Package className="w-5 h-5 text-muted-main/40" />
                            </div>
                            <div>
                              <p className="text-[15px] font-bold tracking-tight">
                                {order.order_number?.startsWith('#') ? order.order_number : `#${order.order_number}`}
                              </p>
                              <p className="text-[11px] text-muted-main/60 mt-1 flex items-center gap-2 font-bold uppercase tracking-widest">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                <span>•</span>
                                <span>{order.items_count || order.items?.length || 0} Items</span>
                              </p>
                              {order.user_name && (
                                <p className="text-[11px] text-muted-main/40 flex items-center gap-1 font-medium uppercase tracking-widest">
                                  <User className="w-3 h-3" />
                                  {order.user_name}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-8 md:ml-auto">
                            <p className="text-[15px] font-black tabular-nums">{formatPrice(order.total_amount)}</p>
                            <span className={cn(
                              'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest min-w-[100px] text-center',
                              order.status === 'delivered' || order.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : order.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-500'
                                : order.status === 'shipped'
                                ? 'bg-mint/10 text-mint'
                                : order.status === 'processing'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-amber-500/10 text-amber-600'
                            )}>
                              {order.status}
                            </span>
                            <button 
                              onClick={() => handleViewOrder(order)}
                              className="w-10 h-10 rounded-full bg-surface-3 border border-border-custom hover:bg-brand hover:text-ink flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-5 py-24 rounded-[40px] border-2 border-dashed border-border-custom/50">
                      <Package className="w-14 h-14 text-muted-main/10" />
                      <p className="text-[11px] text-muted-main/60 font-black uppercase tracking-widest">No orders found</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─ Wishlist ─ */}
              {activeSection === 'wishlist' && (
                <motion.div key="wishlist" {...fadeUp} className="space-y-8">
                  <div className="px-2">
                    <h3 className="text-3xl font-bold tracking-tight uppercase font-display">Wishlist</h3>
                    <p className="text-muted-main text-sm mt-2 font-medium uppercase tracking-widest opacity-60">Pieces you've saved for later</p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-8 py-24 rounded-[40px] border-2 border-dashed border-border-custom/50 bg-surface-3/20">
                      <div className="w-20 h-20 rounded-full bg-surface-3 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-muted-main/20" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-[15px] font-bold uppercase tracking-widest">Your wishlist is empty</p>
                        <p className="text-[12px] text-muted-main/60 font-medium">Capture the things you love as you explore the collections.</p>
                      </div>
                      <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-brand text-ink text-[11px] font-black uppercase tracking-widest hover:bg-ink hover:text-brand transition-all shadow-xl shadow-brand/10">
                        Explore Shop <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Grid mapping for wishlist would be here */}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─ Addresses ─ */}
              {activeSection === 'addresses' && (
                <motion.div key="addresses" {...fadeUp} className="space-y-8">
                  <div className="px-2">
                    <h3 className="text-3xl font-bold tracking-tight uppercase font-display">Manage Addresses</h3>
                    <p className="text-muted-main text-sm mt-2 font-medium uppercase tracking-widest opacity-60">Primary delivery locations for your collections</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Address Card */}
                    <div className="group relative rounded-[32px] border border-border-custom bg-surface-2 p-10 space-y-8 hover:border-brand/40 transition-all shadow-xl shadow-black/5 overflow-hidden">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-surface-3 border border-border-custom flex items-center justify-center group-hover:bg-brand group-hover:text-ink transition-all">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <span className="px-4 py-1.5 rounded-full bg-mint/10 text-mint text-[10px] font-black uppercase tracking-widest border border-mint/20">
                          Primary
                        </span>
                      </div>
                      
                      <div className="space-y-4 relative z-10">
                        <p className="text-[14px] font-black uppercase tracking-[0.2em] text-brand">Shipment Zone</p>
                        <div className="space-y-1">
                          <p className="text-[18px] font-bold uppercase tracking-tight">{user.name}</p>
                          <p className="text-[14px] text-muted-main uppercase tracking-widest leading-relaxed">
                            {user.address || 'No address set'}<br />
                            {user.city}{user.zip ? `, ${user.zip}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 relative z-10 border-t border-border-custom flex gap-4">
                        <button onClick={() => setActiveSection('settings')} className="flex-1 py-3.5 rounded-full border border-border-custom text-[11px] font-black uppercase tracking-widest text-muted-main hover:bg-surface-3 hover:text-text-main transition-all">
                          Edit Detail
                        </button>
                      </div>

                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors" />
                    </div>

                    <button className="rounded-[32px] border-2 border-dashed border-border-custom/50 bg-surface-3/10 p-10 flex flex-col items-center justify-center gap-4 hover:border-brand/40 hover:bg-surface-3/30 transition-all group group-active:scale-[0.98]">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-border-custom flex items-center justify-center group-hover:border-brand/40 transition-colors">
                        <ArrowRight className="w-6 h-6 text-muted-main/40 rotate-[-45deg] group-hover:text-brand group-hover:rotate-0 transition-all duration-500" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-main/40 group-hover:text-brand">New Location</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─ Payments ─ */}
              {activeSection === 'payments' && (
                <motion.div key="payments" {...fadeUp} className="space-y-8">
                  <div className="px-2">
                    <h3 className="text-3xl font-bold tracking-tight uppercase font-display">Payment Mechanism</h3>
                    <p className="text-muted-main text-sm mt-2 font-medium uppercase tracking-widest opacity-60">Secure methods for your aesthetic investments</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group relative rounded-[32px] border border-border-custom bg-surface-2 p-10 space-y-12 hover:border-brand/40 transition-all shadow-xl shadow-black/5 overflow-hidden">
                       <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-surface-3 border border-border-custom flex items-center justify-center group-hover:bg-brand group-hover:text-ink transition-all">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold uppercase tracking-tight">Visa Platinum</p>
                             <p className="text-[10px] text-muted-main/60 font-black uppercase tracking-widest">Ending in {orders[0]?.payment_info?.last_four || '—'}</p>
                          </div>
                        </div>
                        <span className="px-4 py-1.5 rounded-full bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest border border-brand/20">
                          Active
                        </span>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <p className="text-[20px] font-bold tracking-[0.2em] font-mono">
                          •••• •••• •••• {orders[0]?.payment_info?.last_four || '—'}
                        </p>
                        <div className="flex justify-between items-end">
                           <div>
                            <p className="text-[10px] text-muted-main uppercase font-black tracking-widest mb-1 opacity-40">Card Holder</p>
                            <p className="text-[13px] font-bold uppercase tracking-widest">{user.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-main uppercase font-black tracking-widest mb-1 opacity-40">Expiry</p>
                            <p className="text-[13px] font-bold uppercase tracking-widest">12 / 26</p>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors" />
                    </div>

                    <button className="rounded-[32px] border-2 border-dashed border-border-custom/50 bg-surface-3/10 p-10 flex flex-col items-center justify-center gap-4 hover:border-brand/40 hover:bg-surface-3/30 transition-all group group-active:scale-[0.98]">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-border-custom flex items-center justify-center group-hover:border-brand/40 transition-colors">
                        <ArrowRight className="w-6 h-6 text-muted-main/40 rotate-[-45deg] group-hover:text-brand group-hover:rotate-0 transition-all duration-500" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-main/40 group-hover:text-brand">New Mechanism</p>
                    </button>
                  </div>

                  <div className="mt-8 flex items-center gap-4 p-6 rounded-3xl bg-surface-3/30 border border-border-custom/50">
                    <ShieldCheck className="w-6 h-6 text-mint" />
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-tight">Your data is secured by 256-bit encryption</p>
                      <p className="text-[10px] text-muted-main font-medium uppercase tracking-widest opacity-60 mt-0.5">Payment data is stored with our secure vault provider</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─ Settings ─ */}
              {activeSection === 'settings' && (
                <motion.div key="settings" {...fadeUp} className="space-y-8 max-w-xl">
                  <div className="px-2">
                    <h3 className="text-3xl font-bold tracking-tight uppercase font-display">Profile Settings</h3>
                    <p className="text-muted-main text-sm mt-2 font-medium uppercase tracking-widest opacity-60">Update your core profile details</p>
                  </div>

                  <div className={cardCls}>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">

                      {/* Name */}
                      <div>
                        <label className={labelCls}>Full Name</label>
                        <div className="relative group/field">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main/40 group-focus-within/field:text-brand transition-colors pointer-events-none" />
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            required
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className={labelCls}>Phone Number</label>
                        <div className="relative group/field">
                          <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main/40 group-focus-within/field:text-brand transition-colors pointer-events-none" />
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            placeholder="+1 234 567 890"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Address Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className={labelCls}>Street Address</label>
                          <div className="relative group/field">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main/40 group-focus-within/field:text-brand transition-colors pointer-events-none" />
                            <input
                              type="text"
                              value={profileForm.address}
                              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                              placeholder="123 Designers St"
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                            <label className={labelCls}>City</label>
                            <input
                              type="text"
                              value={profileForm.city}
                              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                              placeholder="New York"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>ZIP Code</label>
                            <input
                              type="text"
                              value={profileForm.zip}
                              onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                              placeholder="10001"
                              className={inputCls}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email (read-only) */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className={labelCls.replace('mb-2', '')}>Email Address</label>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-main/30">Locked</span>
                        </div>
                        <div className="relative opacity-60 grayscale-[0.5]">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main/40 pointer-events-none" />
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className={cn(inputCls, "bg-surface-3/50 cursor-not-allowed")}
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-brand text-ink text-[11px] font-black uppercase tracking-[0.2em] hover:bg-ink hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-brand/10"
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                          Commit Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Danger zone */}
                  <div className="rounded-[24px] border border-red-500/10 bg-red-500/[0.02] p-6 space-y-4">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Critical Protocol</p>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-bold">Revoke Sessions</p>
                        <p className="text-[11px] text-muted-main font-medium mt-1">Sign out and clear all cached credentials on this device.</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 rounded-full border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── Order Details Modal ── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-2 border border-border-custom rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-border-custom flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase font-display">Order details</h3>
                  <p className="text-[11px] text-muted-main mt-1 font-black uppercase tracking-[0.2em]">
                    #{selectedOrder.order_number} • {new Date(selectedOrder.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-12 h-12 rounded-full bg-surface-3 border border-border-custom flex items-center justify-center hover:bg-brand hover:text-ink transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                {/* Items */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-brand uppercase tracking-[0.3em]">Items selection</h4>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="relative w-20 h-28 rounded-2xl overflow-hidden shrink-0 bg-surface-3 border border-border-custom">
                          <Image
                            src={item.product_image || item.image || '/placeholder.png'}
                            alt={item.product_name || item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand text-ink text-[11px] font-black flex items-center justify-center shadow-lg">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
                          <p className="text-[16px] font-bold tracking-tight text-text-main leading-tight line-clamp-2 uppercase">
                            {item.product_name || item.name}
                          </p>
                          {item.variant && (
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-main opacity-60">
                              {item.variant}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                             <p className="text-[16px] font-black tabular-nums">{formatPrice(item.price)}</p>
                             <span className="text-[11px] text-muted-main/40 font-bold uppercase tracking-widest">ea.</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Shipping Info */}
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-brand uppercase tracking-[0.3em]">Delivery point</h4>
                    <div className="space-y-2 p-6 rounded-3xl bg-surface-3 border border-border-custom">
                      <p className="text-[14px] font-bold uppercase tracking-tight">{selectedOrder.customer_info?.name || user.name}</p>
                      <p className="text-[12px] text-muted-main uppercase tracking-widest leading-loose">
                        {selectedOrder.customer_info?.address}<br />
                        {selectedOrder.customer_info?.city}{selectedOrder.customer_info?.zip ? `, ${selectedOrder.customer_info?.zip}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-brand uppercase tracking-[0.3em]">Method of Payment</h4>
                    <div className="p-6 rounded-3xl bg-surface-3 border border-border-custom flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border-custom flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="text-[12px] font-black uppercase tracking-widest text-text-main">
                          {selectedOrder.payment_info?.method === 'card' ? 'Credit / Debit Card' : selectedOrder.payment_method || 'Payment'}
                        </p>
                        <p className="text-[11px] text-muted-main font-bold uppercase tracking-widest mt-0.5">
                          Ending in {selectedOrder.payment_info?.last_four || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="pt-8 border-t border-border-custom">
                  <div className="space-y-4">
                    {[
                      { label: 'Sub-Selection', value: formatPrice(selectedOrder.total_amount - (selectedOrder.shipping_cost || 0) - (selectedOrder.tax || 0)) },
                      { label: 'Priority Delivery', value: selectedOrder.shipping_cost === 0 ? 'FREE' : formatPrice(selectedOrder.shipping_cost || 0) },
                      { label: 'Editorial Tax', value: formatPrice(selectedOrder.tax || 0) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-muted-main">
                        <span>{label}</span>
                        <span className="text-text-main">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-6 border-t border-border-custom">
                      <span className="text-[15px] font-bold uppercase tracking-widest text-text-main">Total Investment</span>
                      <span className="text-[32px] font-bold text-brand tabular-nums tracking-tighter">{formatPrice(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-border-custom flex gap-4 shrink-0">
                <button
                  onClick={() => handleReorder(selectedOrder)}
                  className="flex-1 py-4 rounded-full bg-brand text-ink text-[11px] font-black uppercase tracking-widest hover:bg-ink hover:text-brand transition-all shadow-xl shadow-brand/10"
                >
                  Repeat Order
                </button>
                {selectedOrder.status !== 'cancelled' && (
                  <button className="flex-1 py-4 rounded-full border border-border-custom text-[11px] font-black uppercase tracking-widest text-muted-main hover:bg-surface-3 transition-colors">
                    Track Journey
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Loading Overlay ── */}
      <AnimatePresence>
        {isFetchingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-surface-2 p-8 rounded-full border border-border-custom overflow-hidden">
               <Loader2 className="w-8 h-8 text-brand animate-spin" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}