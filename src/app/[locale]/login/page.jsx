'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, ArrowRight, 
  Github, Chrome, ShieldCheck, Loader2
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { api } from '@/lib/api/client';
import useStore from '@/lib/store/useStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const inputCls =
  'w-full bg-surface-2 border border-border-custom rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-text-main placeholder:text-muted-main/40 focus:outline-none focus:border-brand/40 transition-colors';

const labelCls = 'block text-[11px] font-medium text-muted-main uppercase tracking-widest mb-2';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { setUser, setToken, setRole } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.auth.login(formData);
      
      if (response.user && (response.access_token || response.token)) {
        const token = response.access_token || response.token;
        setUser(response.user);
        setToken(token);
        if (response.role) setRole(response.role);
        toast.success('Welcome back to Lumina. Access granted.');
        router.push('/account');
      } else {
        toast.error('Authentication failed. Please verify your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Logo / brand mark */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-3 border border-border-custom mb-6 hover:border-brand transition-colors">
            <span className="text-[13px] font-bold text-text-main">L</span>
          </Link>
          <h1 className="text-[28px] font-bold tracking-[-1px] text-text-main uppercase font-display">Lumina Access</h1>
          <p className="text-[13px] text-muted-main mt-1.5 uppercase tracking-widest font-medium opacity-60">Authentication Required</p>
        </div>

        {/* Card */}
        <div className="rounded-[32px] border border-border-custom bg-surface-2 p-8 shadow-2xl shadow-black/10">
          
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main group-focus-within:text-brand transition-colors pointer-events-none" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={labelCls.replace('mb-2', '')}>Password</label>
                <button type="button" className="text-[9px] font-black uppercase tracking-widest text-brand hover:text-text-main transition-colors">
                  Recovery Protocols?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main group-focus-within:text-brand transition-colors pointer-events-none" />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 mt-2 rounded-full bg-brand text-ink text-[11px] font-black uppercase tracking-[0.2em] hover:bg-ink hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-brand/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('loading')}</span>
                </>
              ) : (
                <>
                   <span>Initialize Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

             {/* Social Divider */}
             <div className="flex items-center gap-4 py-4">
               <div className="h-px bg-border-custom flex-1" />
               <span className="text-[10px] font-black text-muted-main uppercase tracking-widest opacity-40">Digital Auth</span>
               <div className="h-px bg-border-custom flex-1" />
            </div>

            {/* Social Login Icons */}
            <div className="grid grid-cols-2 gap-3">
               <button type="button" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-border-custom bg-surface-3 text-[11px] font-bold uppercase tracking-widest text-muted-main hover:text-text-main hover:border-brand/40 transition-all group">
                  <Chrome className="w-4 h-4" />
                  <span>Google</span>
               </button>
               <button type="button" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-border-custom bg-surface-3 text-[11px] font-bold uppercase tracking-widest text-muted-main hover:text-text-main hover:border-brand/40 transition-all group">
                  <Github className="w-4 h-4" />
                  <span>Github</span>
               </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
             <p className="text-[11px] text-muted-main font-bold uppercase tracking-widest">
                Novice to the collection?{' '}
                <Link href="/register" className="text-brand hover:underline underline-offset-8 transition-all">
                   Join the Membership
                </Link>
             </p>
          </div>

        </div>

        {/* Branding Subtitle */}
        <div className="mt-12 flex items-center justify-between px-8 opacity-40">
           <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encryption</span>
           </div>
           <div className="text-[9px] font-black uppercase tracking-widest">© 2025 LUMINA STORE</div>
        </div>
      </motion.div>

       {/* Visual Polish */}
       <div className="absolute top-[30%] left-[-10%] text-[20vw] font-black text-white/5 select-none pointer-events-none -rotate-6 tracking-tighter">
         LOGIN.
      </div>

    </div>
  );
}
