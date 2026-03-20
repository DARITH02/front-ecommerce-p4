import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking Next.js features
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'en',
}));
