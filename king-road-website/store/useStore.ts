import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StoreState {
  cartItems: CartItem[];
  cartCount: number;
  language: 'en' | 'ar';
  isMenuOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleLanguage: () => void;
  setMenuOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      cartCount: 0,
      language: 'en',
      isMenuOpen: false,
      
      addToCart: (item) => {
        const { cartItems } = get();
        const existingItem = cartItems.find(i => i.id === item.id);
        
        // Get the product from the API to check current inventory
        const checkAndAddToCart = async (item, existingQuantity = 0) => {
          try {
            // This would be a real API call in production
            // For now we'll just use the item data
            const newQuantity = existingQuantity + item.quantity;
            
            // Add to cart
            if (existingItem) {
              const newItems = cartItems.map(i =>
                i.id === item.id ? { ...i, quantity: newQuantity } : i
              );
              set({
                cartItems: newItems,
                cartCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
              });
            } else {
              const newItems = [...cartItems, item];
              set({
                cartItems: newItems,
                cartCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
              });
            }
          } catch (error) {
            console.error("Failed to add to cart:", error);
            // Could show a toast notification here
          }
        };
        
        if (existingItem) {
          checkAndAddToCart(item, existingItem.quantity);
        } else {
          checkAndAddToCart(item);
        }
      },
      
      removeFromCart: (id) => {
        const { cartItems } = get();
        const newItems = cartItems.filter(i => i.id !== id);
        set({
          cartItems: newItems,
          cartCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
        });
      },
      
      updateQuantity: (id, quantity) => {
        const { cartItems } = get();
        
        // Don't allow negative quantities
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        
        // Get the existing item
        const existingItem = cartItems.find(i => i.id === id);
        if (!existingItem) return;
        
        // In a real app, we would check inventory here
        // For now, we'll just update the quantity
        const newItems = cartItems.map(i =>
          i.id === id ? { ...i, quantity } : i
        );
        set({
          cartItems: newItems,
          cartCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
        });
      },
      
      clearCart: () => set({ cartItems: [], cartCount: 0 }),
      
      toggleLanguage: () => set(state => ({ language: state.language === 'en' ? 'ar' : 'en' })),
      
      setMenuOpen: (open) => set({ isMenuOpen: open }),
    }),
    {
      name: 'king-road-store',
      partialize: (state) => ({ 
        cartItems: state.cartItems, 
        cartCount: state.cartCount,
        language: state.language
      }),
    }
  )
);