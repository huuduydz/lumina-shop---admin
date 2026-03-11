
import React from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate, Outlet } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, LayoutDashboard, Settings, LogOut, Store, Tag, ShieldCheck, ShoppingCart, LogIn, UserPlus, ArrowLeftRight, ArrowUp, ClipboardList, Globe } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import { CouponProvider } from './context/CouponContext';
import { OrderProvider } from './context/OrderContext';
import { CRMProvider } from './context/CRMContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCRM from './pages/admin/crm/AdminCRM';
import AdminCRMCustomers from './pages/admin/crm/AdminCRMCustomers';
import AdminCRMCustomerDetail from './pages/admin/crm/AdminCRMCustomerDetail';

// --- Components ---

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 text-primary">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Lumina Shop</h2>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-900 hover:text-primary transition-colors">{t('nav.home')}</Link>
          <Link to="/shop" className="text-sm font-bold text-primary">{t('nav.shop')}</Link>
          <Link to="#" className="text-sm font-medium text-slate-900 hover:text-primary transition-colors">{t('nav.about')}</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-900 hover:text-primary transition-colors">{t('nav.contact')}</Link>
          {user && (user.role === 'Admin' || user.role === 'Staff') && (
            <Link to="/admin/orders" className="text-sm font-medium text-white bg-slate-800 px-3 py-1 rounded-full hover:bg-slate-700 transition-colors ml-4 shadow-sm">{t('nav.admin')}</Link>
          )}
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-4 lg:gap-6 items-center">
        {/* Language Switcher */}
        <button 
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
        >
            <Globe className="size-4" />
            <span>{language === 'en' ? 'EN' : 'VI'}</span>
        </button>

        <label className="hidden lg:flex flex-col min-w-[200px] h-10">
          <div className="flex w-full h-full items-center rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden transition-all">
            <Search className="size-5 text-slate-400 mr-2" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder={t('nav.search')} />
          </div>
        </label>
        <div className="flex gap-2">
          <Link to="/cart" className="group flex items-center justify-center rounded-lg size-10 bg-slate-100 hover:bg-primary/10 transition-colors relative">
            <ShoppingCart className="size-5 text-slate-700 group-hover:text-primary" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                    {itemCount}
                </span>
            )}
          </Link>
          
          {user ? (
             <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500">{user.role}</p>
                </div>
                <div className="group relative">
                    <button className="flex items-center justify-center rounded-full size-10 overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all">
                         <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                            <LogOut className="size-4" /> {t('nav.signout')}
                        </button>
                    </div>
                </div>
             </div>
          ) : (
            <div className="flex gap-2">
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:text-primary transition-colors">
                    {t('nav.login')}
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    {t('nav.signup')}
                </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const { user, logout } = useAuth();
  
  // Scroll to top logic
  const mainRef = React.useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const handleScroll = () => {
    if (mainRef.current) {
        setShowScrollTop(mainRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen w-full bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white hidden md:flex">
        <div className="flex h-full flex-col p-4 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 px-2 mb-8 flex-shrink-0">
            <div className="size-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <Store className="size-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">WooAdmin</h1>
              <p className="text-xs text-slate-500">Store Manager</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1 flex-1">
            <div className="px-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Store Management</div>
            <Link to="/admin/orders" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive('/admin/orders') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}>
              <ClipboardList className="size-5" />
              Orders & Shipping
            </Link>
            <Link to="/admin/products" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive('/admin/products') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}>
              <ShoppingBag className="size-5" />
              Inventory & Products
            </Link>
             <Link to="/admin/transactions" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive('/admin/transactions') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}>
              <ArrowLeftRight className="size-5" />
              Transactions
            </Link>
            
            <div className="px-2 mt-6 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">CRM & Marketing</div>
            <Link to="/admin/crm" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive('/admin/crm') && !isActive('/admin/crm/customers') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}>
              <UserPlus className="size-5" />
              CRM Dashboard
            </Link>
            <Link to="/admin/crm/customers" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive('/admin/crm/customers') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}>
              <User className="size-5" />
              Customers
            </Link>
            <Link to="/admin/coupons" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive('/admin/coupons') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Tag className="size-5" />
              Coupons
            </Link>
            <Link to="/admin/users" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive('/admin/users') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'}`}>
              <ShieldCheck className="size-5" />
              System Users
            </Link>
            
            <div className="mt-8">
               <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <LogOut className="size-5" />
                Back to Shop
              </Link>
            </div>
          </nav>
          
          <div className="mt-auto border-t pt-4 flex-shrink-0">
             <div className="flex items-center gap-3 px-2">
                <img src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" className="size-8 rounded-full object-cover" />
                <div className="text-sm overflow-hidden">
                  <p className="font-semibold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@store.com'}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative scroll-smooth bg-surface"
      >
        {/* Mobile Header (simplified) */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
             <span className="font-bold">Admin Panel</span>
             <Link to="/" className="text-primary text-sm font-medium">Exit</Link>
        </header>
        
        {children}

        {/* Scroll To Top Button */}
        <button 
            onClick={scrollToTop} 
            className={`fixed bottom-8 right-8 z-50 p-3 bg-primary text-white rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300 transform ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
            title="Scroll to Top"
        >
            <ArrowUp className="size-6" />
        </button>
      </main>
    </div>
  );
};

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: string[] }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect if logged in but wrong role (e.g. Customer trying to access Admin)
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

// --- Main App Component ---

const App = () => {
  return (
    <LanguageProvider>
        <AuthProvider>
            <ProductProvider>
            <CartProvider>
                <CouponProvider>
                    <OrderProvider>
                        <CRMProvider>
                            <HashRouter>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                
                                {/* Public Shop Routes with Navbar */}
                                <Route path="/" element={<><Navbar /><Home /></>} />
                                <Route path="/shop" element={<><Navbar /><Shop /></>} />
                                <Route path="/product/:id" element={<><Navbar /><ProductDetail /></>} />
                                <Route path="/cart" element={<><Navbar /><Cart /></>} />
                                <Route path="/contact" element={<><Navbar /><Contact /></>} />

                                {/* Admin Routes - Protected */}
                                <Route path="/admin" element={<Navigate to="/admin/crm" replace />} />
                                
                                <Route path="/admin/*" element={
                                    <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                                        <AdminLayout>
                                            <Routes>
                                                <Route path="crm" element={<AdminCRM />} />
                                                <Route path="crm/customers" element={<AdminCRMCustomers />} />
                                                <Route path="crm/customers/:id" element={<AdminCRMCustomerDetail />} />
                                                <Route path="orders" element={<AdminOrders />} />
                                                <Route path="products" element={<AdminProducts />} />
                                                <Route path="products/new" element={<AdminAddProduct />} />
                                                <Route path="products/edit/:id" element={<AdminAddProduct />} />
                                                <Route path="transactions" element={<AdminTransactions />} />
                                                <Route path="coupons" element={<AdminCoupons />} />
                                                <Route path="users" element={<AdminUsers />} />
                                            </Routes>
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                            </Routes>
                            </HashRouter>
                        </CRMProvider>
                    </OrderProvider>
                </CouponProvider>
            </CartProvider>
            </ProductProvider>
        </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
