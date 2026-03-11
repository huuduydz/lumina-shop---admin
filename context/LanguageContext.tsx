
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin Dashboard',
    'nav.search': 'Search products...',
    'nav.login': 'Log In',
    'nav.signup': 'Sign Up',
    'nav.signout': 'Sign Out',

    // Home
    'home.hero.badge': 'New Collection 2024',
    'home.hero.title1': 'Discover Your',
    'home.hero.title2': 'Unique Style',
    'home.hero.desc': 'Explore our curated collection of premium electronics, fashion, and home decor.',
    'home.hero.shopNow': 'Shop Now',
    'home.hero.lookbook': 'View Lookbook',
    'home.features.shipping': 'Free Shipping',
    'home.features.shipping.desc': 'On all orders over $50',
    'home.features.secure': 'Secure Payment',
    'home.features.secure.desc': '100% secure payment methods',
    'home.features.returns': '30 Day Returns',
    'home.features.returns.desc': 'Easy returns & exchanges',
    'home.category.title': 'Shop by Category',
    'home.category.subtitle': 'Browse through our diverse collections',
    'home.trending.title': 'Trending Products',
    'home.trending.subtitle': 'Customer Favorites',
    'home.trending.more': 'Discover More Products',

    // Shop
    'shop.filter.placeholder': 'Filter keywords...',
    'shop.categories': 'Categories',
    'shop.price': 'Price Range',
    'shop.sort': 'Sort by:',
    'shop.showing': 'Showing',
    'shop.results': 'results',
    'shop.loadMore': 'Load More Products',
    'shop.noResults': 'No products found',
    'shop.clearFilters': 'Clear Filters',

    // Product Detail
    'product.newArrival': 'New Arrival',
    'product.reviews': 'reviews',
    'product.color': 'Color:',
    'product.stock': 'Available Stock:',
    'product.maxLimit': 'Max limit reached',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.outOfStock': 'Out of Stock',
    'product.description': 'Description',
    'product.specs': 'Specifications',

    // Cart & Checkout
    'cart.empty': 'Your cart is empty',
    'cart.empty.desc': "Looks like you haven't added anything to your cart yet.",
    'cart.startShopping': 'Start Shopping',
    'cart.title': 'Shopping Cart',
    'cart.customerInfo': 'Customer Information',
    'cart.name': 'Full Name',
    'cart.email': 'Email Address',
    'cart.phone': 'Phone Number',
    'cart.address': 'Shipping Address',
    'cart.province': 'Province / City',
    'cart.district': 'District',
    'cart.ward': 'Ward',
    'cart.street': 'House no., Street name',
    'cart.select_province': 'Select Province',
    'cart.select_district': 'Select District',
    'cart.select_ward': 'Select Ward',
    'cart.note': 'Order Note (Optional)',
    'cart.continue': 'Continue Shopping',
    'cart.summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.coupon': 'Coupon Code',
    'cart.apply': 'Apply',
    'cart.payment': 'Payment Method',
    'cart.cod': 'Cash on Delivery (COD)',
    'cart.credit': 'Credit Card',
    'cart.momo': 'Momo Wallet',
    'cart.checkout': 'Checkout Now',
    'cart.processing': 'Processing...',
    'cart.secure': 'Transactions are SSL Encrypted and Secure.',
    'cart.item': 'Item',
    'cart.items': 'Items',
    'cart.order_success': 'Order Placed Successfully!',
    'cart.email_sent': 'Confirmation email sent to',
  },
  vi: {
    // Navbar
    'nav.home': 'Trang chủ',
    'nav.shop': 'Cửa hàng',
    'nav.about': 'Giới thiệu',
    'nav.contact': 'Liên hệ',
    'nav.admin': 'Quản trị viên',
    'nav.search': 'Tìm kiếm sản phẩm...',
    'nav.login': 'Đăng nhập',
    'nav.signup': 'Đăng ký',
    'nav.signout': 'Đăng xuất',

    // Home
    'home.hero.badge': 'Bộ sưu tập mới 2024',
    'home.hero.title1': 'Khám phá',
    'home.hero.title2': 'Phong cách riêng',
    'home.hero.desc': 'Khám phá bộ sưu tập điện tử, thời trang và trang trí nhà cửa cao cấp của chúng tôi.',
    'home.hero.shopNow': 'Mua ngay',
    'home.hero.lookbook': 'Xem bộ sưu tập',
    'home.features.shipping': 'Miễn phí vận chuyển',
    'home.features.shipping.desc': 'Cho đơn hàng trên $50',
    'home.features.secure': 'Thanh toán an toàn',
    'home.features.secure.desc': 'Bảo mật thanh toán 100%',
    'home.features.returns': 'Đổi trả 30 ngày',
    'home.features.returns.desc': 'Đổi trả dễ dàng & nhanh chóng',
    'home.category.title': 'Danh mục sản phẩm',
    'home.category.subtitle': 'Duyệt qua các bộ sưu tập đa dạng',
    'home.trending.title': 'Sản phẩm xu hướng',
    'home.trending.subtitle': 'Được yêu thích nhất',
    'home.trending.more': 'Khám phá thêm sản phẩm',

    // Shop
    'shop.filter.placeholder': 'Lọc từ khóa...',
    'shop.categories': 'Danh mục',
    'shop.price': 'Khoảng giá',
    'shop.sort': 'Sắp xếp:',
    'shop.showing': 'Hiển thị',
    'shop.results': 'kết quả',
    'shop.loadMore': 'Xem thêm',
    'shop.noResults': 'Không tìm thấy sản phẩm',
    'shop.clearFilters': 'Xóa bộ lọc',

    // Product Detail
    'product.newArrival': 'Hàng mới về',
    'product.reviews': 'đánh giá',
    'product.color': 'Màu sắc:',
    'product.stock': 'Kho sẵn có:',
    'product.maxLimit': 'Đã đạt giới hạn',
    'product.addToCart': 'Thêm vào giỏ',
    'product.buyNow': 'Mua ngay',
    'product.outOfStock': 'Hết hàng',
    'product.description': 'Mô tả',
    'product.specs': 'Thông số kỹ thuật',

    // Cart & Checkout
    'cart.empty': 'Giỏ hàng trống',
    'cart.empty.desc': 'Có vẻ như bạn chưa thêm gì vào giỏ hàng.',
    'cart.startShopping': 'Bắt đầu mua sắm',
    'cart.title': 'Giỏ hàng',
    'cart.customerInfo': 'Thông tin khách hàng',
    'cart.name': 'Họ và tên',
    'cart.email': 'Địa chỉ Email',
    'cart.phone': 'Số điện thoại',
    'cart.address': 'Địa chỉ giao hàng',
    'cart.province': 'Tỉnh / Thành phố',
    'cart.district': 'Quận / Huyện',
    'cart.ward': 'Phường / Xã',
    'cart.street': 'Số nhà, Tên đường',
    'cart.select_province': 'Chọn Tỉnh / Thành',
    'cart.select_district': 'Chọn Quận / Huyện',
    'cart.select_ward': 'Chọn Phường / Xã',
    'cart.note': 'Ghi chú đơn hàng (Tùy chọn)',
    'cart.continue': 'Tiếp tục mua sắm',
    'cart.summary': 'Tóm tắt đơn hàng',
    'cart.subtotal': 'Tạm tính',
    'cart.shipping': 'Vận chuyển',
    'cart.free': 'Miễn phí',
    'cart.total': 'Tổng cộng',
    'cart.coupon': 'Mã giảm giá',
    'cart.apply': 'Áp dụng',
    'cart.payment': 'Phương thức thanh toán',
    'cart.cod': 'Thanh toán khi nhận hàng (COD)',
    'cart.credit': 'Thẻ tín dụng',
    'cart.momo': 'Ví Momo',
    'cart.checkout': 'Thanh toán ngay',
    'cart.processing': 'Đang xử lý...',
    'cart.secure': 'Giao dịch được mã hóa SSL và bảo mật.',
    'cart.item': 'Sản phẩm',
    'cart.items': 'Sản phẩm',
    'cart.order_success': 'Đặt hàng thành công!',
    'cart.email_sent': 'Email xác nhận đã được gửi tới',
  }
};

export const LanguageProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
