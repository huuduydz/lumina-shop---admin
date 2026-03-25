
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { useProducts } from './ProductContext';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  applyCoupon: (coupon: Coupon | null) => void;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  finalTotal: number;
  processCheckout: () => void;
  notification: Notification;
  closeNotification: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children?: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: 'success' });
  const { updateStock } = useProducts();

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const addToCart = (product: Product, quantity: number, color: string, size?: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.selectedColor === color && item.selectedSize === size
      );
      
      // Calculate total quantity if we add this new amount
      const currentQty = existingItem ? existingItem.quantity : 0;
      const totalQty = currentQty + quantity;

      if (totalQty > product.stockQuantity) {
          showToast(`Sorry, only ${product.stockQuantity} items available in stock.`, 'error');
          if (existingItem) {
               return prev.map((item) =>
                  item.id === product.id && item.selectedColor === color && item.selectedSize === size
                    ? { ...item, quantity: product.stockQuantity }
                    : item
                );
          }
          return [...prev, { ...product, quantity: product.stockQuantity, selectedColor: color, selectedSize: size }];
      }

      showToast(`Added ${quantity} ${product.name} to cart!`, 'success');

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.selectedColor === color && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from cart', 'success');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems((prev) =>
      prev.map((item) => {
          if (item.id === productId) {
              // Check stock limit
              if (quantity > item.stockQuantity) {
                  showToast(`Cannot add more. Max stock reached (${item.stockQuantity}).`, 'error');
                  return { ...item, quantity: item.stockQuantity };
              }
              return { ...item, quantity };
          }
          return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon);
    if(coupon) showToast(`Coupon ${coupon.code} applied!`, 'success');
  };

  // Checkout Logic connects to Product Inventory
  const processCheckout = () => {
      cartItems.forEach(item => {
          updateStock(
              item.id, 
              item.quantity, 
              'OUT', 
              'Order', 
              `Order Checkout: ${item.quantity} x ${item.name}`
          );
      });
      clearCart();
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
      if (appliedCoupon.type === 'Percentage') {
          discountAmount = (cartTotal * appliedCoupon.value) / 100;
      } else if (appliedCoupon.type === 'Fixed Cart') {
          discountAmount = appliedCoupon.value;
      }
  }

  // Ensure total doesn't go below 0
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        applyCoupon,
        appliedCoupon,
        discountAmount,
        finalTotal,
        processCheckout,
        notification,
        closeNotification,
        showToast
      }}
    >
      {children}
      
      {/* Global Toast Notification Component */}
      <div className={`fixed top-24 right-6 z-[60] transition-all duration-300 transform ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${notification.type === 'success' ? 'bg-white border-green-200 text-slate-800' : 'bg-white border-red-200 text-slate-800'}`}>
              <div className={`p-1 rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {notification.type === 'success' ? <CheckCircle className="size-5" /> : <AlertCircle className="size-5" />}
              </div>
              <p className="text-sm font-semibold">{notification.message}</p>
              <button onClick={closeNotification} className="text-slate-400 hover:text-slate-600 ml-2">
                  <X className="size-4" />
              </button>
          </div>
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
