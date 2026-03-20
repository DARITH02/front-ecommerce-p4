import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // UI State
      isDarkMode: true,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      isMegaMenuOpen: false,
      setMegaMenuOpen: (isOpen) => set({ isMegaMenuOpen: isOpen }),
      isMiniCartOpen: false,
      setMiniCartOpen: (isOpen) => set({ isMiniCartOpen: isOpen }),
      toggleCart: () => set((state) => ({ isMiniCartOpen: !state.isMiniCartOpen })),
      isMobileNavOpen: false,
      setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),
      isSearchOpen: false,
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      
      // Search State
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      recentSearches: [],
      addRecentSearch: (query) => set((state) => ({
        recentSearches: [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 5)
      })),
      removeRecentSearch: (term) => set((state) => ({
        recentSearches: state.recentSearches.filter(s => s !== term)
      })),

      // Cart State
      cart: [],
      addToCart: (product, variant, quantity = 1) => set((state) => {
        const variantId = variant?.id || variant; // Handle both object and string
        const existingItem = state.cart.find(
          (item) => item.id === product.id && item.variant === variantId
        );
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id && item.variant === variantId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, variant: variantId, quantity }] };
      }),
      removeFromCart: (productId, variantId) => set((state) => ({
        cart: state.cart.filter((item) => !(item.id === productId && item.variant === variantId))
      })),
      updateQuantity: (productId, variantId, delta) => set((state) => ({
        cart: state.cart.map((item) =>
          (item.id === productId && item.variant === variantId)
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
      })),
      
      // Wishlist State
      wishlist: [],
      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId]
      })),
    }),
    {
      name: 'lumina-store-storage',
      partialize: (state) => ({ 
        isDarkMode: state.isDarkMode, 
        cart: state.cart, 
        wishlist: state.wishlist,
        recentSearches: state.recentSearches
      }),
    }
  )
);

export default useStore;
