
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Filter, Headphones, Shirt, Armchair } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Shop = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const categoryCountMap = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
  }, {});
  const categoryOptions = [
      { name: 'Electronics', icon: <Headphones className="size-5" /> },
      { name: 'Fashion', icon: <Shirt className="size-5" /> },
      { name: 'Home Decor', icon: <Armchair className="size-5" /> },
      {
        name: 'Footwear',
        icon: (
          <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-900 text-white text-[10px] font-bold">
            Shoes
          </span>
        )
      },
      {
        name: 'Accessories',
        icon: (
          <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
            +
          </span>
        )
      }
  ];

  const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-[1440px] mx-auto flex w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col gap-6 p-6 border-r border-slate-200 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
        <div>
          <label className="flex flex-col w-full h-10">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 bg-white focus-within:border-primary transition-all">
              <div className="text-slate-400 flex items-center justify-center pl-3">
                <Filter className="size-4" />
              </div>
              <input 
                className="flex w-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400 px-3 text-sm" 
                placeholder={t('shop.filter.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider opacity-70">{t('shop.categories')}</h3>
          <div className="flex flex-col gap-1">
             <button onClick={() => setFilterCategory('All')} className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${filterCategory === 'All' ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 hover:bg-slate-100'}`}>
                <span className="text-sm">All Products</span>
                <span className="text-xs font-semibold">{products.length}</span>
            </button>
            {categoryOptions.map(category => (
              <button
                key={category.name}
                onClick={() => setFilterCategory(category.name)}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  filterCategory === category.name ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {category.icon}
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-xs font-semibold">{categoryCountMap[category.name] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider opacity-70">{t('shop.price')}</h3>
          <div className="px-1">
            <div className="relative h-1.5 w-full rounded-full bg-slate-200">
              <div className="absolute h-full w-2/3 rounded-full bg-primary left-0"></div>
              <div className="absolute top-1/2 -mt-2 -ml-2 h-4 w-4 rounded-full border-2 border-primary bg-white shadow-sm left-2/3 cursor-pointer"></div>
            </div>
            <div className="flex justify-between mt-3 text-xs font-medium text-slate-500">
              <span>$0</span>
              <span>$500+</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col p-6 lg:p-10">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to="/" className="text-slate-500 hover:text-primary transition-colors">{t('nav.home')}</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">{t('nav.shop')}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Products</h1>
              <p className="text-slate-500 mt-1">{t('shop.showing')} {filteredProducts.length} {t('shop.results')}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 whitespace-nowrap">{t('shop.sort')}</span>
              <select className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 cursor-pointer outline-none">
                <option>Most Popular</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Search className="size-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">{t('shop.noResults')}: "{searchTerm}"</p>
                <button onClick={() => {setSearchTerm(''); setFilterCategory('All')}} className="mt-4 text-primary font-bold hover:underline">{t('shop.clearFilters')}</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col rounded-xl bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-slate-100 overflow-hidden">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                    {product.stockStatus === 'Low Stock' && (
                        <span className="absolute top-3 left-3 z-10 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">Low Stock</span>
                    )}
                    {product.stockStatus === 'Out of Stock' && (
                        <span className="absolute top-3 left-3 z-10 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">Sold Out</span>
                    )}
                    <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${product.stockStatus === 'Out of Stock' ? 'opacity-50 grayscale' : ''}`} 
                    />
                    <button className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-white text-slate-900 shadow-md flex items-center justify-center translate-y-14 group-hover:translate-y-0 transition-transform duration-300 hover:text-red-500">
                    <Heart className="size-5" />
                    </button>
                </div>
                <div className="flex flex-col p-4 flex-1">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
                    {/* Static stars for demo */}
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                    <span className="text-slate-400 ml-1">({product.reviews})</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="text-base font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                    </Link>
                    <p className="text-sm text-slate-500 mb-4">{product.category}</p>
                    <div className="mt-auto flex items-center justify-between">
                    <div>
                        {product.originalPrice && <span className="text-xs text-slate-400 line-through mr-1">${product.originalPrice.toFixed(2)}</span>}
                        <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                    </div>
                    <button 
                        onClick={() =>
                          addToCart(
                            product,
                            1,
                            product.availableColors?.[0]?.name || 'Default',
                            product.availableSizes?.[0] || 'Standard'
                          )
                        }
                        disabled={product.stockStatus === 'Out of Stock'}
                        className="rounded-lg bg-primary hover:bg-blue-700 text-white p-2 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="size-5" />
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        <div className="flex items-center justify-center mt-12 mb-6">
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                {t('shop.loadMore')}
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
        </div>
      </main>
    </div>
  );
};

export default Shop;
