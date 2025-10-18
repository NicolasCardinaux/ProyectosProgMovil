import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  CartItem, 
  Product, 
  normalizeProduct, 
  NormalizedProduct,
  getNormalizedProductFinalPrice 
} from '../types';

interface CartState {
  items: CartItem[];
  totalPrice: number;
  addItem: (product: Product | NormalizedProduct, quantity?: number) => void;
  addToCart: (product: Product | NormalizedProduct, quantity?: number) => void;
  removeItem: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemQuantity: (productId: number) => number;
}


function isNormalizedProduct(product: Product | NormalizedProduct): product is NormalizedProduct {
  return 'attributes' in product && product.attributes !== undefined;
}

// Este es nuestro `store` para el carrito, creado con Zustand.
// Maneja toda la lógica de agregar, quitar y actualizar productos en el carrito.
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      

      addItem: (product: Product | NormalizedProduct, quantity: number = 1) => {
        const { items } = get();
        

        const productToAdd: NormalizedProduct = isNormalizedProduct(product)
          ? product
          : normalizeProduct(product);
        
        const existingItem = items.find(item => item.product.id === productToAdd.id);
        
        let newItems: CartItem[];
        if (existingItem) {
          newItems = items.map(item =>
            item.product.id === productToAdd.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newCartItem: CartItem = { product: productToAdd, quantity };
          newItems = [...items, newCartItem];
        }


        const newTotalPrice = newItems.reduce((total, item) => {
          const price = getNormalizedProductFinalPrice(item.product);
          return total + (price * item.quantity);
        }, 0);

        set({ 
          items: newItems,
          totalPrice: parseFloat(newTotalPrice.toFixed(2))
        });
      },

      addToCart: (product, quantity) => get().addItem(product, quantity),
      

      removeItem: (productId: number) => {
        const newItems = get().items.filter(item => item.product.id !== productId);
        const newTotalPrice = newItems.reduce((total, item) => total + (getNormalizedProductFinalPrice(item.product) * item.quantity), 0);
        set({ 
          items: newItems,
          totalPrice: parseFloat(newTotalPrice.toFixed(2))
        });
      },

      removeFromCart: (productId) => get().removeItem(productId),
      

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const newItems = get().items.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        const newTotalPrice = newItems.reduce((total, item) => total + (getNormalizedProductFinalPrice(item.product) * item.quantity), 0);
        set({ 
          items: newItems,
          totalPrice: parseFloat(newTotalPrice.toFixed(2))
        });
      },

      increaseQuantity: (productId: number) => {
        const currentQuantity = get().getItemQuantity(productId);
        get().updateQuantity(productId, currentQuantity + 1);
      },

      decreaseQuantity: (productId: number) => {
        const currentQuantity = get().getItemQuantity(productId);
        if (currentQuantity > 1) {
          get().updateQuantity(productId, currentQuantity - 1);
        } else {
          get().removeItem(productId);
        }
      },
      

      clearCart: () => {
        set({ items: [], totalPrice: 0 });
      },
      

      getTotalPrice: () => get().totalPrice,
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getItemQuantity: (productId: number) => {
        const item = get().items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);