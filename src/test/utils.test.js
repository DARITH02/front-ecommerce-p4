import { describe, it, expect } from 'vitest';
import { formatPrice, calculateDiscount } from '../lib/utils';

describe('Utility Functions', () => {
  it('should format price correctly in USD', () => {
    expect(formatPrice(100)).toBe('$100.00');
    expect(formatPrice(1250.5)).toBe('$1,250.50');
  });

  it('should calculate discount percentage correctly', () => {
    expect(calculateDiscount(100, 80)).toBe(20);
    expect(calculateDiscount(200, 150)).toBe(25);
  });
});
