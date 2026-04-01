
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2, ArrowLeft, Lock, ShieldCheck, CreditCard, ShoppingCart, Tag, User, MapPin, Phone, Mail, Banknote, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCoupons } from '../context/CouponContext';
import { useOrders } from '../context/OrderContext';
import { CustomerInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { buildCartItemKey } from '../productVariants';

// Interfaces for Vietnam Address API
interface Province {
  code: number;
  name: string;
}
interface District {
  code: number;
  name: string;
}
interface Ward {
  code: number;
  name: string;
}

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, discountAmount, finalTotal, applyCoupon, appliedCoupon, processCheckout: processInventoryCheckout, showToast } = useCart();
  const { validateCoupon } = useCoupons();
  const { createOrder, isLoading } = useOrders();
  const { t } = useLanguage();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  
  // Customer Form State
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
      name: '',
      email: '',
      phone: '',
      address: '',
      note: ''
  });
  
  // Address Selection State
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | string>('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | string>('');
  const [selectedWardCode, setSelectedWardCode] = useState<number | string>('');
  const [streetAddress, setStreetAddress] = useState('');

  // Fetch Provinces on mount
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
        .then(res => res.json())
        .then(data => setProvinces(data))
        .catch(err => console.error("Failed to fetch provinces", err));
  }, []);

  // Fetch Districts when Province changes
  useEffect(() => {
      if (selectedProvinceCode) {
          fetch(`https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`)
            .then(res => res.json())
            .then(data => {
                setDistricts(data.districts || []);
                setWards([]); 
                setSelectedDistrictCode('');
                setSelectedWardCode('');
            })
            .catch(err => console.error("Failed to fetch districts", err));
      } else {
          setDistricts([]);
          setWards([]);
      }
  }, [selectedProvinceCode]);

  // Fetch Wards when District changes
  useEffect(() => {
      if (selectedDistrictCode) {
          fetch(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`)
            .then(res => res.json())
            .then(data => {
                setWards(data.wards || []);
                setSelectedWardCode('');
            })
            .catch(err => console.error("Failed to fetch wards", err));
      } else {
          setWards([]);
      }
  }, [selectedDistrictCode]);

  // Construct full address string for customerInfo
  useEffect(() => {
      const p = provinces.find(x => x.code == selectedProvinceCode)?.name || '';
      const d = districts.find(x => x.code == selectedDistrictCode)?.name || '';
      const w = wards.find(x => x.code == selectedWardCode)?.name || '';
      
      if (p && d && w && streetAddress) {
          // Format: "123 Street, Ward X, District Y, Province Z"
          const fullAddress = `${streetAddress}, ${w}, ${d}, ${p}`;
          setCustomerInfo(prev => ({ ...prev, address: fullAddress }));
      }
  }, [selectedProvinceCode, selectedDistrictCode, selectedWardCode, streetAddress, provinces, districts, wards]);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
      setCouponError('');
      const coupon = validateCoupon(couponCode);
      if (coupon) {
          applyCoupon(coupon);
      } else {
          setCouponError('Invalid or expired coupon code');
          applyCoupon(null);
      }
  };

  const handleCheckout = async () => {
      // Validate Form
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
          showToast("Please fill in contact information.", 'error');
          return;
      }
      
      // Validate Address Components
      if (!selectedProvinceCode || !selectedDistrictCode || !selectedWardCode || !streetAddress) {
           showToast("Please select a valid shipping address.", 'error');
           return;
      }

      const success = await createOrder(
          customerInfo,
          cartItems,
          cartTotal,
          discountAmount,
          finalTotal,
          paymentMethod
      );

      if (success) {
          processInventoryCheckout(); // Clear cart and update stock
          showToast(`${t('cart.order_success')} ${t('cart.email_sent')} ${customerInfo.email}`, 'success');
          // Navigate back to previous page after a short delay
          setTimeout(() => {
              navigate(-1);
          }, 2000);
      }
  };

  if (cartItems.length === 0) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
              <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                  <ShoppingCart className="size-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('cart.empty')}</h2>
              <p className="text-slate-500 mb-8 max-w-md">{t('cart.empty.desc')}</p>
              <Link to="/" className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                  {t('cart.startShopping')}
              </Link>
          </div>
      );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-16 py-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 pb-6 text-sm">
        <Link to="/" className="text-slate-500 font-medium hover:text-primary transition-colors">{t('nav.home')}</Link>
        <span className="text-slate-400">/</span>
        <Link to="/" className="text-slate-500 font-medium hover:text-primary transition-colors">{t('nav.shop')}</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 font-semibold">{t('cart.title')}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
        {/* Left Column: Cart Items & Customer Info */}
        <div className="flex flex-col flex-[1_1_60%] w-full gap-8">
            
            {/* Cart Items Section */}
            <div>
                <div className="flex items-end justify-between border-b border-slate-200 pb-4 mb-6">
                    <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-tight">{t('cart.title')} <span className="text-lg font-medium text-slate-500 ml-2 align-middle">({cartItems.length} {cartItems.length > 1 ? t('cart.items') : t('cart.item')})</span></h1>
                </div>

                <div className="flex flex-col gap-4">
                    {cartItems.map((item) => (
                        <div
                          key={item.itemKey || buildCartItemKey(item.id, item.selectedColor, item.selectedSize)}
                          className="group flex gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="bg-slate-100 rounded-lg size-24 shrink-0 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-between flex-1 py-1">
                                <div>
                                    <h3 className="text-slate-900 text-lg font-bold leading-tight mb-1">{item.name}</h3>
                                    <p className="text-slate-500 text-sm font-medium">
                                        {t('product.color')} {item.selectedColor}
                                        {item.selectedSize && (
                                            <span className="ml-2">
                                                Model/Size {item.selectedSize}
                                            </span>
                                        )}
                                    </p>
                                    {(item.selectedColorExtra || item.selectedSizeExtra) ? (
                                      <p className="text-xs font-medium text-primary mt-1">
                                        Option surcharge: +${((item.selectedColorExtra || 0) + (item.selectedSizeExtra || 0)).toFixed(2)}
                                      </p>
                                    ) : null}
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className={`text-sm font-medium ${item.stockStatus === 'In Stock' ? 'text-green-600' : 'text-orange-600'}`}>
                                            {item.stockStatus}
                                        </p>
                                        <span className="text-xs text-slate-400">| Stock: {item.stockQuantity}</span>
                                    </div>
                                </div>
                                <div>
                                  <p className="text-primary font-bold text-lg">${item.price.toFixed(2)}</p>
                                  {item.basePrice && item.basePrice !== item.price ? (
                                    <p className="text-xs text-slate-500">
                                      Base ${item.basePrice.toFixed(2)} + options ${(((item.selectedColorExtra || 0) + (item.selectedSizeExtra || 0))).toFixed(2)}
                                    </p>
                                  ) : null}
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between py-1">
                                <button
                                  onClick={() => removeFromCart(item.itemKey || buildCartItemKey(item.id, item.selectedColor, item.selectedSize))}
                                  className="text-slate-400 hover:text-red-500 p-1"
                                ><Trash2 className="size-5" /></button>
                                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                    <button
                                      onClick={() => updateQuantity(item.itemKey || buildCartItemKey(item.id, item.selectedColor, item.selectedSize), item.quantity - 1)}
                                      className="size-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:bg-slate-100 font-medium"
                                    >-</button>
                                    <input className="w-8 p-0 text-center bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-900" value={item.quantity} readOnly />
                                    <button 
                                        onClick={() => updateQuantity(item.itemKey || buildCartItemKey(item.id, item.selectedColor, item.selectedSize), item.quantity + 1)} 
                                        className="size-7 flex items-center justify-center bg-white rounded shadow-sm text-primary hover:bg-slate-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={item.quantity >= item.stockQuantity}
                                    >+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Customer Info Section (Updated with Address Selector) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User className="size-6 text-primary" /> {t('cart.customerInfo')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">{t('cart.name')}</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 size-4 text-slate-400" />
                            <input 
                                type="text" 
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900" 
                                placeholder="John Doe"
                                value={customerInfo.name}
                                onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">{t('cart.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 size-4 text-slate-400" />
                            <input 
                                type="email" 
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900" 
                                placeholder="email@example.com"
                                value={customerInfo.email}
                                onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">{t('cart.phone')}</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 size-4 text-slate-400" />
                            <input 
                                type="tel" 
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900" 
                                placeholder="+1 234 567 890"
                                value={customerInfo.phone}
                                onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Vietnam Address Selector */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">{t('cart.province')}</label>
                            <select 
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-slate-900"
                                value={selectedProvinceCode}
                                onChange={(e) => setSelectedProvinceCode(e.target.value)}
                            >
                                <option value="">{t('cart.select_province')}</option>
                                {provinces.map(p => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">{t('cart.district')}</label>
                            <select 
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white disabled:bg-slate-50 disabled:text-slate-400 text-slate-900"
                                value={selectedDistrictCode}
                                onChange={(e) => setSelectedDistrictCode(e.target.value)}
                                disabled={!selectedProvinceCode}
                            >
                                <option value="">{t('cart.select_district')}</option>
                                {districts.map(d => (
                                    <option key={d.code} value={d.code}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">{t('cart.ward')}</label>
                            <select 
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white disabled:bg-slate-50 disabled:text-slate-400 text-slate-900"
                                value={selectedWardCode}
                                onChange={(e) => setSelectedWardCode(e.target.value)}
                                disabled={!selectedDistrictCode}
                            >
                                <option value="">{t('cart.select_ward')}</option>
                                {wards.map(w => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                ))}
                            </select>
                        </div>
                         <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">{t('cart.street')}</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900" 
                                placeholder="123 Street Name"
                                value={streetAddress}
                                onChange={e => setStreetAddress(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">
                            {t('cart.address')}: {customerInfo.address || '...'}
                        </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">{t('cart.note')}</label>
                        <textarea 
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none h-20 resize-none text-slate-900" 
                            placeholder="Any special instructions for delivery..."
                            value={customerInfo.note}
                            onChange={e => setCustomerInfo({...customerInfo, note: e.target.value})}
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="flex justify-start">
                <button onClick={() => navigate(-1)} className="text-primary hover:text-blue-700 font-bold flex items-center gap-2 text-sm">
                    <ArrowLeft className="size-5" /> {t('cart.continue')}
                </button>
            </div>
        </div>

        {/* Order Summary */}
        <div className="flex flex-col flex-[1_1_40%] w-full min-w-[320px] lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('cart.summary')}</h2>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-slate-600">
                            <span>{t('cart.subtotal')}</span>
                            <span className="font-medium text-slate-900">${cartTotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-slate-600">
                            <span>{t('cart.shipping')}</span>
                            <span className="font-medium text-green-600">{t('cart.free')}</span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded-lg">
                                <span className="flex items-center gap-1"><Tag className="size-3" /> {t('cart.coupon')}: {appliedCoupon.code}</span>
                                <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="h-px bg-slate-200 my-4"></div>
                        <div className="flex justify-between items-end">
                            <span className="text-lg font-bold text-slate-900">{t('cart.total')}</span>
                            <span className="text-2xl font-black text-slate-900">${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">{t('cart.coupon')}</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 bg-slate-50 border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-primary uppercase" 
                                placeholder="Enter code" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button onClick={handleApplyCoupon} className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-lg text-sm transition-colors">{t('cart.apply')}</button>
                        </div>
                        {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
                        {appliedCoupon && <p className="text-xs text-green-600 mt-2">Coupon applied successfully!</p>}
                    </div>

                    <div className="space-y-4 mb-8">
                        <h3 className="text-sm font-semibold uppercase text-slate-500">{t('cart.payment')}</h3>
                        
                        {/* COD Option */}
                        <label className={`border-2 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-primary/[0.02]' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input 
                                type="radio" 
                                name="payment" 
                                className="text-primary focus:ring-primary border-slate-300" 
                                checked={paymentMethod === 'COD'}
                                onChange={() => setPaymentMethod('COD')}
                            />
                            <div className="flex-1 font-bold text-slate-900 flex items-center justify-between">
                                <span>{t('cart.cod')}</span>
                                <Banknote className="size-5 opacity-70" />
                            </div>
                        </label>

                        {/* API Payment Options */}
                        <label className={`border-2 rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-colors ${paymentMethod === 'Credit Card' ? 'border-primary bg-primary/[0.02]' : 'border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    className="text-primary focus:ring-primary border-slate-300" 
                                    checked={paymentMethod === 'Credit Card'}
                                    onChange={() => setPaymentMethod('Credit Card')}
                                />
                                <div className="flex-1 font-bold text-slate-900 flex items-center justify-between">
                                    <span>{t('cart.credit')}</span>
                                    <div className="flex gap-1 opacity-70"><CreditCard className="size-5" /></div>
                                </div>
                            </div>
                            {paymentMethod === 'Credit Card' && (
                                <div className="pl-7 pt-2 text-xs text-slate-500">
                                    <p className="flex items-center gap-1"><Lock className="size-3" /> Secure redirect to Payment Gateway API.</p>
                                </div>
                            )}
                        </label>

                         <label className={`border-2 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'Momo' ? 'border-primary bg-primary/[0.02]' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input 
                                type="radio" 
                                name="payment" 
                                className="text-primary focus:ring-primary border-slate-300" 
                                checked={paymentMethod === 'Momo'}
                                onChange={() => setPaymentMethod('Momo')}
                            />
                            <div className="flex-1 font-bold text-slate-900 flex items-center justify-between">
                                <span>{t('cart.momo')}</span>
                                {/* Mock Momo Logo */}
                                <div className="size-5 bg-pink-600 rounded text-[8px] text-white flex items-center justify-center font-bold">Mo</div>
                            </div>
                        </label>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="size-5 animate-spin" /> {t('cart.processing')}
                            </>
                        ) : (
                            <>
                                <span>{t('cart.checkout')}</span>
                                <ArrowRight className="size-5" />
                            </>
                        )}
                    </button>
                    
                    <div className="mt-6 flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Lock className="size-3" />
                            <span>{t('cart.secure')}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 p-4 flex justify-center gap-4 border-t border-slate-100 grayscale opacity-60">
                    <span className="font-bold text-slate-400 text-sm italic">VISA</span>
                    <span className="font-bold text-slate-400 text-sm italic">Mastercard</span>
                    <span className="font-bold text-slate-400 text-sm italic">PayPal</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
