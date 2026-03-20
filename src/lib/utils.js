import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function calculateDiscount(original, sale) {
  return Math.round(((original - sale) / original) * 100);
}
export function resolveImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // If it's already a full URL, handle normalization for Cloudinary
  if (url.startsWith('http')) {
     // Stripping '/v1234567/' from Cloudinary URLs so they match the resolved path during deduplication
     return url.replace(/\/v\d+\//, '/');
  }
  // Handle relative paths from the DB listing (e.g., 'products/reSE7M...')
  if (url.startsWith('products/') || url.startsWith('categories/') || url.startsWith('demo/')) {
    // Cloud name: dnrblpkal
    return `https://res.cloudinary.com/dnrblpkal/image/upload/${url}${!url.includes('.') ? '.avif' : ''}`;
  }
  // Fallback for other relative paths (assuming local storage or similar)
  return url;
}
