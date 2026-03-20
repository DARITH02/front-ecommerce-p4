import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MiniCart from '@/components/cart/MiniCart';
import SearchOverlay from '@/components/layout/SearchOverlay';
import MobileMenu from '@/components/layout/MobileMenu';
import MegaMenu from '@/components/layout/MegaMenu';
import ChatBot from '@/components/shared/ChatBot';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from 'sonner';
import '../globals.css';

export const metadata = {
  title: {
    default: 'Lumina Store | Editorial Luxury Artifacts',
    template: '%s | Lumina Store'
  },
  description: 'Premium curated e-commerce experience for the discerning editorial eye. Discover minimalist luxury artifacts across fashion, architecture, and design.',
  metadataBase: new URL('https://lumina-store.design'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lumina-store.design',
    siteName: 'Lumina Store',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lumina Store Editorial' }],
  },
  twitter: {
    handle: '@luminastore',
    site: '@luminastore',
    cardType: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  
  if (!['en', 'km', 'fr', 'zh'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=cabinet-grotesk@100,200,300,400,500,700,800,900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-brand selection:text-ink" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <Header />
            <SearchOverlay />
            <MiniCart />
            <MobileMenu />
            <MegaMenu />
            <ChatBot />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
          <Toaster position="bottom-right" theme="dark" expand={false} richColors />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Lumina Store',
                url: 'https://lumina-store.design',
                logo: 'https://lumina-store.design/logo.png',
                sameAs: [
                  'https://instagram.com/luminastore',
                  'https://twitter.com/luminastore'
                ]
              })
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
