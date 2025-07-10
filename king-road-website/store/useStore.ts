      updateCartQuantity: async (productId, quantity) => {
        try {
          const cartItem = get().cartItems.find(item => item.product_id === productId);
          if (cartItem) {
            if (quantity <= 0) {
              return get().removeFromCart(productId);
            }
            
            const response = await cartApi.updateQuantity(cartItem.id, { quantity });
            if (response.status === 1) {
              // Reload cart after successful update
              get().loadCart();
            }
interface CartItem {

      addToCart: async (product, quantity) => {
interface StoreState {
        try {
      updateQuantity: (id, quantity) => {
          const response = await cartApi.addToCart({
        const { cartItems } = get();
            product_id: product.id,
        if (quantity <= 0) {
            quantity
          get().removeFromCart(id);
          });
          return;
        } catch (error) {
          console.error('Failed to update cart quantity:', error);
          throw error;
        }
      },
        );
      removeFromCart: async (productId) => {
        } catch (error) {
        try {
      
          const cartItem = get().cartItems.find(item => item.product_id === productId);
      toggleLanguage: () => set(state => ({ language: state.language === 'en' ? 'ar' : 'en' })),
          if (cartItem) {
      
            const response = await cartApi.removeFromCart(cartItem.id);
      setMenuOpen: (open) => set({ isMenuOpen: open }),
      clearCart: async () => {
        try {
          const response = await cartApi.clearCart();
          if (response.status === 1) {
            set({ cartItems: [], cartTotal: { subtotal: 0, item_count: 0, total: 0 } });
          }
        } catch (error) {
          console.error('Failed to clear cart:', error);
          // Clear local state even if API call fails
          set({ cartItems: [], cartTotal: { subtotal: 0, item_count: 0, total: 0 } });
        }
      },

      loadCart: async () => {
        try {
          set({ isCartLoading: true });
          
          const [cartResponse, totalResponse] = await Promise.all([
            cartApi.getCart(),
            cartApi.getCartTotal()
          ]);
          
          if (cartResponse.status === 1 && totalResponse.status === 1) {
            set({
              cartItems: cartResponse.data || [],
              cartTotal: totalResponse.data || { subtotal: 0, item_count: 0, total: 0 }
            });
          }
        } catch (error) {
          console.error('Failed to load cart:', error);
          // Set empty cart on error
          set({
            cartItems: [],
            cartTotal: { subtotal: 0, item_count: 0, total: 0 }
          });
        } finally {
          set({ isCartLoading: false });
        }
      },

      refreshCartTotal: async () => {
        try {
          const response = await cartApi.getCartTotal();
          if (response.status === 1) {
            set({ cartTotal: response.data });
          }
        } catch (error) {
          console.error('Failed to refresh cart total:', error);
        }
      }
    }),
              // Reload cart after successful removal
    {
              get().loadCart();
      partialize: (state) => ({ user: state.user }) // Only persist user, cart is loaded from API
            }
      partialize: (state) => ({ 
          }
        cartItems: state.cartItems, 
        } catch (error) {
        cartCount: state.cartCount,
          console.error('Failed to remove from cart:', error);
        language: state.language
          throw error;
      }),
        }
    }
      },
  )
);