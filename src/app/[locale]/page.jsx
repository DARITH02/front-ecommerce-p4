import { Link } from '@/i18n/routing';
import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashSale from '@/components/home/FlashSale';
import BestSellers from '@/components/home/BestSellers';
import EditorialArrivals from '@/components/home/EditorialArrivals';
import BrandStory from '@/components/home/BrandStory';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import InstagramGrid from '@/components/home/InstagramGrid';
import NewsletterSection from '@/components/home/NewsletterSection';

export default async function Home({ params }) {
  const { locale } = await params;
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <FlashSale />
      <BestSellers />
      <EditorialArrivals />
      <BrandStory />
      <ReviewsCarousel />
      <InstagramGrid />
      <NewsletterSection />
    </div>
  );
}
