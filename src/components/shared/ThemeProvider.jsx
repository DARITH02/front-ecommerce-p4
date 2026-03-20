'use client';

import { useLayoutEffect } from 'react';
import useStore from '@/lib/store/useStore';

export function ThemeProvider({ children }) {
  const { isDarkMode } = useStore();

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Preventing flash by using useEffect (though hydration warning is already suppressed in layout)
  return <>{children}</>;
}
