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
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity;
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
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        
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