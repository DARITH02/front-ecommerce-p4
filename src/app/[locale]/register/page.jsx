'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, Chrome, Github, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { api } from '@/lib/api/client';
import useStore from '@/lib/store/useStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const inputCls =
  'w-full bg-surface-2 border border-border-custom rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-text-main placeholder:text-muted-main/40 focus:outline-none focus:border-brand/40 transition-colors';

const labelCls = 'block text-[11px] font-medium text-muted-main uppercase tracking-widest mb-2';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { setUser, setToken, setRole } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
  });

  const handleChange = (e) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.auth.register(formData);
      if (response.user && (response.access_token || response.token)) {
        const token = response.access_token || response.token;
        setUser(response.user);
        setToken(token);
        if (response.role) setRole(response.role);
        toast.success('Account created. Welcome to Lumina.');
        router.push('/account');
      } else {
        toast.error('Registration failed. Please check your details.');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[420px]"
      >
        {/* Logo / brand mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-3 border border-border-custom mb-6">
            <span className="text-[13px] font-bold text-text-main">L</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-[-1px] text-text-main uppercase font-display">Create an account</h1>
          <p className="text-[13px] text-muted-main mt-1.5 uppercase tracking-widest font-medium opacity-60">Join the editorial inner circle</p>
        </div>

        {/* Card */}
        <div className="rounded-[32px] border border-border-custom bg-surface-2 p-8 shadow-2xl shadow-black/10">
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Name */}
            <div>
              <label className={labelCls}>Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main group-focus-within:text-brand transition-colors pointer-events-none" />
                <input
                  type="text" name="name" required
                  placeholder="Jane Smith"
                  value={formData.name} onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main group-focus-within:text-brand transition-colors pointer-events-none" />
                <input
                  type="email" name="email" required
                  placeholder="you@example.com"
                  value={formData.email} onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelCls}>Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main group-focus-within:text-brand transition-colors pointer-events-none" />
                <input
                  type="tel" name="phone" required
                  placeholder="+1 555 000 0000"
                  value={formData.phone} onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main group-focus-within:text-brand transition-colors pointer-events-none" />
                <input
                  type="password" name="password" required
                  placeholder="Min. 8 characters"
                  value={formData.password} onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className={labelCls}>Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-main group-focus-within:text-brand transition-colors pointer-events-none" />
                <input
                  type="password" name="password_confirmation" required
                  placeholder="Repeat your password"
                  value={formData.password_confirmation} onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 mt-2 rounded-full bg-brand text-ink text-[11px] font-black uppercase tracking-[0.2em] hover:bg-ink hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-brand/10"
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                : <>{t('registerButton')} <ArrowRight className="w-5 h-5" /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="h-px bg-border-custom flex-1" />
            <span className="text-[10px] text-muted-main font-black uppercase tracking-widest opacity-40">Digital Auth</span>
            <div className="h-px bg-border-custom flex-1" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { Icon: Chrome, label: 'Google' },
              { Icon: Github, label: 'GitHub' },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-border-custom bg-surface-3 text-[11px] font-bold uppercase tracking-widest text-muted-main hover:text-text-main hover:border-brand/40 transition-all"
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-[11px] font-bold uppercase tracking-widest text-muted-main mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-brand hover:underline underline-offset-8 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
