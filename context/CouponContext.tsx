import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Coupon } from '../types';
import { COUPONS } from '../data';

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string) => Coupon | null;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider = ({ children }: { children?: ReactNode }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS);

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const validateCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.status === 'Active');
    return coupon || null;
  };

  return (
    <CouponContext.Provider value={{ coupons, addCoupon, deleteCoupon, validateCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) throw new Error('useCoupons must be used within CouponProvider');
  return context;
};