
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, Battery, Mic, Zap } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  
  // Default to first product if not found/id undefined for demo
  const product = products.find(p => p.id === id) || products[0]; 
  const productColors = product.availableColors?.length
    ? product.availableColors
    : [{ name: 'Default', hex: '#0f172a' }];
  const productSizes = product.availableSizes?.length ? product.availableSizes : ['Standard'];
  const productSpecifications = product.specifications?.length
    ? product.specifications
    : [
        { label: 'Category', value: product.category },
        { label: 'SKU', value: product.sku || 'Updating' },
        { label: 'Availability', value: product.stockStatus }
      ];
  const productDetailSections = product.detailSections?.length
    ? product.detailSections
    : [product.description || 'Detailed product content is being updated.'];
  const productReviews = product.customerReviews?.length ? product.customerReviews : [];

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(productColors[0].name);
  const [selectedSize, setSelectedSize] = useState(productSizes[0]);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedColor(productColors[0].name);
    setSelectedSize(productSizes[0]);
    setSelectedImage(product.image);
    setActiveTab('description');
  }, [product.id, product.image, productColors, productSizes]);

  const handleAddToCart = () => {
      addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
      addToCart(product, quantity, selectedColor, selectedSize);
      navigate('/cart');
  };

  const handleQuantityChange = (val: number) => {
      let newQty = Math.max(1, val);
      if (newQty > product.stockQuantity) {
          newQty = product.stockQuantity;
      }
      setQuantity(newQty);
  };

  return (
    <div className="flex-1 px-4 py-6 md:px-10 md:py-8 lg:px-40 lg:py-12 bg-surface">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 text-sm">
          <a href="#" className="text-slate-500 font-medium hover:text-primary transition-colors">{t('nav.home')}</a>
          <span className="text-slate-400 font-medium">/</span>
          <a href="#" className="text-slate-500 font-medium hover:text-primary transition-colors">{product.category}</a>
          <span className="text-slate-400 font-medium">/</span>
          <span className="text-slate-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
             <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:h-[500px] no-scrollbar py-1">
                {(product.thumbnails?.length ? product.thumbnails : [product.image]).map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(thumb)}
                      className={`shrink-0 size-20 rounded-lg overflow-hidden border-2 ${
                        thumb === selectedImage
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                        <img src={thumb} className="w-full h-full object-cover" alt="thumbnail" />
                    </button>
                ))}
             </div>
             <div className="flex-1 relative group overflow-hidden rounded-xl bg-gray-100 min-h-[300px] md:min-h-[500px]">
                <img src={selectedImage} className="absolute inset-0 w-full h-full object-cover" alt={product.name} />
                <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-all text-slate-400 hover:text-red-500">
                    <HeartIcon />
                </button>
             </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
             <div className="border-b border-slate-200 pb-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold border ${product.stockStatus === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        <span className={`size-1.5 rounded-full ${product.stockStatus === 'In Stock' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                        {product.stockStatus}
                    </span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{t('product.newArrival')}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`size-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                    </div>
                    <span className="text-sm text-slate-500 font-medium">({product.reviews} {t('product.reviews')})</span>
                </div>
                <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && <span className="text-lg text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                </div>
             </div>

             <div className="space-y-6 mb-8">
                <div>
                    <span className="block text-sm font-semibold text-slate-900 mb-3">{t('product.color')} <span className="font-normal text-slate-500">{selectedColor}</span></span>
                    <div className="flex gap-3">
                        {productColors.map(color => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            title={color.name}
                            className={`size-10 rounded-full border border-white shadow-sm ring-2 ring-offset-2 transition-all ${
                              selectedColor === color.name ? 'ring-primary' : 'ring-transparent'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          ></button>
                        ))}
                    </div>
                </div>
                <div>
                    <span className="block text-sm font-semibold text-slate-900 mb-3">Model / Size <span className="font-normal text-slate-500">{selectedSize}</span></span>
                    <div className="flex gap-3">
                        {productSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border text-sm font-semibold ${
                              selectedSize === size
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                    </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                   {product.description || 'Experience sound like never before with our latest driver technology. Immerse yourself in pure audio bliss with active noise cancellation and a comfortable, ergonomic fit designed for all-day wear.'}
                </p>
                {product.stockStatus !== 'Out of Stock' && (
                     <div className="flex items-center gap-2">
                         <p className="text-sm text-slate-500">
                            {t('product.stock')} <span className={`font-bold ${product.stockQuantity < 10 ? 'text-orange-600' : 'text-slate-900'}`}>{product.stockQuantity}</span>
                        </p>
                        {quantity >= product.stockQuantity && (
                            <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">{t('product.maxLimit')}</span>
                        )}
                    </div>
                )}
             </div>

             <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="flex items-center justify-between border border-slate-200 rounded-lg bg-white w-full sm:w-32 h-12">
                        <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 h-full hover:bg-slate-50 rounded-l-lg text-slate-500 font-bold text-lg">-</button>
                        <input 
                            className="w-full text-center bg-transparent border-none focus:ring-0 p-0 text-slate-900 font-medium" 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            max={product.stockQuantity}
                            min={1}
                        />
                        <button 
                            onClick={() => handleQuantityChange(quantity + 1)} 
                            className="px-3 h-full hover:bg-slate-50 rounded-r-lg text-slate-500 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={quantity >= product.stockQuantity}
                        >+</button>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex-1 flex gap-3">
                         <button 
                            onClick={handleAddToCart}
                            disabled={product.stockStatus === 'Out of Stock'}
                            className="flex-1 bg-white border border-slate-300 text-slate-900 hover:border-primary hover:text-primary font-bold rounded-lg h-12 px-4 shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag className="size-5" />
                            {t('product.addToCart')}
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            disabled={product.stockStatus === 'Out of Stock'}
                            className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg h-12 px-4 shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            <Zap className="size-5 fill-current" />
                            {product.stockStatus === 'Out of Stock' ? t('product.outOfStock') : t('product.buyNow')}
                        </button>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Truck className="size-4" /> {t('home.features.shipping')}</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="size-4" /> 2 Year Warranty</span>
                    <span className="flex items-center gap-1"><RefreshCw className="size-4" /> {t('home.features.returns')}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mt-8 border-t border-slate-200 pt-8">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <div className="w-full md:w-64 shrink-0">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Product Details</h3>
                    <nav className="flex flex-col gap-1">
                        <button
                          onClick={() => setActiveTab('description')}
                          className={`flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                            activeTab === 'description'
                              ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {t('product.description')}
                        </button>
                        <button
                          onClick={() => setActiveTab('specifications')}
                          className={`flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                            activeTab === 'specifications'
                              ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {t('product.specs')}
                        </button>
                        <button
                          onClick={() => setActiveTab('reviews')}
                          className={`flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                            activeTab === 'reviews'
                              ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          Reviews
                        </button>
                    </nav>
                </div>
                <div className="flex-1 max-w-3xl">
                    {activeTab === 'description' && (
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{product.name}</h2>
                        <div className="space-y-4">
                          {productDetailSections.map((section, index) => (
                            <p key={index} className="text-slate-600 leading-relaxed">
                              {section}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'specifications' && (
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('product.specs')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {productSpecifications.map((specification, index) => (
                              <div key={specification.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                                      {index % 2 === 0 ? <Mic className="size-5" /> : <Battery className="size-5" />}
                                  </div>
                                  <h4 className="font-bold text-slate-900 mb-1">{specification.label}</h4>
                                  <p className="text-sm text-slate-500">{specification.value}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                          <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Customer Reviews</h2>
                            <p className="text-slate-500">
                              {product.reviews} verified ratings with an average score of {product.rating.toFixed(1)}/5
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 min-w-[180px]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-3xl font-bold text-slate-900">{product.rating.toFixed(1)}</span>
                              <div className="flex text-yellow-400 gap-0.5">
                                {[...Array(5)].map((_, index) => (
                                  <Star
                                    key={index}
                                    className={`size-4 ${index < Math.round(product.rating) ? 'fill-current' : 'text-slate-200'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-500">Based on shopper feedback</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {productReviews.map(review => (
                            <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                <div>
                                  <h4 className="font-bold text-slate-900">{review.title}</h4>
                                  <p className="text-sm text-slate-500">
                                    {review.author} • {new Date(review.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex text-yellow-400 gap-0.5">
                                  {[...Array(5)].map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`size-4 ${index < review.rating ? 'fill-current' : 'text-slate-200'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

export default ProductDetail;
