
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones, Shirt, Armchair, Watch, Star, ShoppingCart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  // Get top rated products for "Trending" section
  const trendingProducts = products.filter(p => p.rating >= 4.5).slice(0, 4);

  return (
    <div className="flex flex-col w-full bg-surface">
      
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/40"></div>
        </div>
        <div className="relative h-full max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col justify-center text-white">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-wider w-fit mb-4">
            {t('home.hero.badge')}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-2xl">
            {t('home.hero.title1')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">{t('home.hero.title2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl">
            {t('home.hero.desc')}
          </p>
          <div className="flex gap-4">
            <Link to="/shop" className="bg-primary hover:bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 group">
              {t('home.hero.shopNow')} <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/shop" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full font-bold transition-all">
              {t('home.hero.lookbook')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
              <Truck className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{t('home.features.shipping')}</h3>
              <p className="text-sm text-slate-500">{t('home.features.shipping.desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="size-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{t('home.features.secure')}</h3>
              <p className="text-sm text-slate-500">{t('home.features.secure.desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="size-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <RefreshCw className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{t('home.features.returns')}</h3>
              <p className="text-sm text-slate-500">{t('home.features.returns.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-6 md:px-10 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('home.category.title')}</h2>
            <p className="text-slate-500">{t('home.category.subtitle')}</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-blue-700 transition-colors">
            {t('home.trending.more')} <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Link to="/shop" className="group relative h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer">
            <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop" alt="Electronics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <Headphones className="size-8 mb-2 opacity-80" />
              <h3 className="text-xl font-bold">Electronics</h3>
              <p className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">Latest Gadgets</p>
            </div>
          </Link>
          <Link to="/shop" className="group relative h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer md:col-span-2">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Fashion" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
             <div className="absolute bottom-6 left-6 text-white">
              <Shirt className="size-8 mb-2 opacity-80" />
              <h3 className="text-xl font-bold">Fashion</h3>
              <p className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">Trending Styles</p>
            </div>
          </Link>
          <Link to="/shop" className="group relative h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer">
            <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop" alt="Home" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
             <div className="absolute bottom-6 left-6 text-white">
              <Armchair className="size-8 mb-2 opacity-80" />
              <h3 className="text-xl font-bold">Home Decor</h3>
              <p className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">Modern Living</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm uppercase tracking-widest">{t('home.trending.subtitle')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">{t('home.trending.title')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product) => (
               <div key={product.id} className="group flex flex-col rounded-xl bg-white transition-all hover:-translate-y-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                    <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                      <Star className="size-4 text-yellow-400 fill-current" />
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{product.category}</p>
                    <Link to={`/product/${product.id}`} className="text-base font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                    </Link>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</p>
                      <button 
                          onClick={() => addToCart(product, 1, 'Default')}
                          className="rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-900 p-2.5 transition-colors"
                      >
                          <ShoppingCart className="size-4" />
                      </button>
                    </div>
                </div>
                </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/shop" className="inline-flex items-center gap-2 border-b-2 border-slate-900 pb-0.5 text-sm font-bold uppercase tracking-widest hover:text-primary hover:border-primary transition-colors">
              {t('home.trending.more')} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 max-w-[1440px] mx-auto px-6 md:px-10 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[400px] flex items-center">
          <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop" alt="Promo" className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="relative z-10 px-8 md:px-16 max-w-2xl">
            <span className="text-yellow-400 font-bold tracking-wider uppercase mb-2 block">Limited Time Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Up to 50% Off on Selected Electronics</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                 <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center min-w-[70px]">
                    <span className="block text-2xl font-bold text-white">02</span>
                    <span className="text-xs text-slate-300">Days</span>
                 </div>
                 <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center min-w-[70px]">
                    <span className="block text-2xl font-bold text-white">14</span>
                    <span className="text-xs text-slate-300">Hours</span>
                 </div>
                 <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center min-w-[70px]">
                    <span className="block text-2xl font-bold text-white">45</span>
                    <span className="text-xs text-slate-300">Mins</span>
                 </div>
              </div>
            </div>
            <Link to="/shop" className="inline-block mt-8 bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
              Grab Deal Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
             <div className="flex items-center gap-2 mb-4">
                <div className="size-8 text-primary">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Lumina Shop</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Your one-stop destination for premium quality products. We believe in quality, style, and customer satisfaction.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">{t('nav.shop')}</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Customer Care</h3>
             <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="#" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Newsletter</h3>
            <p className="text-slate-500 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm flex-1 focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Sub</button>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© 2024 Lumina Shop. All rights reserved.</p>
          <div className="flex gap-4">
             <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
