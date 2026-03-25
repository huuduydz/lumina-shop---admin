
export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  title: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  thumbnails?: string[];
  stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock';
  stockQuantity: number; // Added for exact inventory tracking
  minStock: number; // BOSP - Buffer/Safety Stock level
  sku?: string;
  description?: string;
  availableColors?: ProductColorOption[];
  availableSizes?: string[];
  specifications?: ProductSpecification[];
  detailSections?: string[];
  customerReviews?: ProductReview[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Staff' | 'Customer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'Percentage' | 'Fixed Cart' | 'Fixed Product' | 'Free Shipping';
  value: number; 
  usageCount: number;
  usageLimit: number;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Scheduled';
}

export interface SecurityLog {
  id: string;
  type: 'Warning' | 'Info' | 'Success';
  title: string;
  detail: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  type: 'IN' | 'OUT'; // IN = Import/Restock, OUT = Sale/Export
  quantity: number;
  date: string;
  source: 'Manual' | 'Order' | 'API Sync';
  note?: string;
  totalValue?: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
}

export type MembershipLevel = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipLevel: MembershipLevel;
  totalSpent: number;
  referralCode: string;
  referredBy?: string;
  points: number;
  joinDate: string;
}

export interface CRMNotification {
  id: string;
  customerId: string;
  message: string;
  type: 'Promotion' | 'System' | 'Order';
  date: string;
  read: boolean;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'COD' | 'Credit Card' | 'PayPal' | 'Momo';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  crmSynced: boolean; // To track if data went to CRM
}
