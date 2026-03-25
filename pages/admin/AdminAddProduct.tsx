
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Eye, Save, Bold, Italic, Underline, List, Link as LinkIcon, Image as ImageIcon, Trash2, CloudUpload, X, Plus, ChevronLeft } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { products, addProduct, updateProduct } = useProducts();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [stockStatus, setStockStatus] = useState<Product['stockStatus']>('In Stock');
  const [image, setImage] = useState<string>('');
  const [sku, setSku] = useState('');

  // Load product data if editing
  useEffect(() => {
    if (id) {
        const product = products.find(p => p.id === id);
        if (product) {
            setName(product.name);
            setCategory(product.category);
            setDescription(product.description || '');
            setStockStatus(product.stockStatus);
            setImage(product.image);
            setSku(product.sku || '');
            
            // Map product prices to form fields
            // Logic: "Price" field in UI is base price (higher), "Discount Price" is selling price (lower)
            if (product.originalPrice) {
                setPrice(product.originalPrice.toString()); // UI "Price" gets original (high)
                setOriginalPrice(product.price.toString()); // UI "Discount Price" gets selling (low)
            } else {
                setPrice(product.price.toString());
                setOriginalPrice('');
            }
        }
    }
  }, [id, products]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !price) {
        alert("Please enter product name and price");
        return;
    }

    const finalPrice = parseFloat(price);
    const finalOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    
    // Logic: If user enters both Price and Discount Price, 
    // Price is "Original" and Discount is "Selling".
    let submitPrice = finalPrice;
    let submitOriginalPrice = undefined;

    if (finalOriginalPrice) {
        submitPrice = finalOriginalPrice; // Selling price is the discounted one
        submitOriginalPrice = finalPrice; // Original price is the higher one
    }

    const productData: Partial<Product> = {
      name,
      price: submitPrice,
      originalPrice: submitOriginalPrice,
      category,
      description,
      stockStatus,
      image: image || 'https://picsum.photos/400/400',
      sku: sku || `SKU-${Math.floor(Math.random() * 10000)}`,
      availableColors: [
        { name: 'Default Black', hex: '#111827' },
        { name: 'Soft White', hex: '#f8fafc' },
        { name: 'Ocean Blue', hex: '#1d4ed8' }
      ],
      availableSizes: ['Standard', 'Plus', 'Pro'],
      ...(id ? {} : { stockQuantity: 25, minStock: 5 })
    };

    if (id) {
        // Update existing product
        updateProduct(id, productData);
    } else {
        // Add new product
        const newProduct: Product = {
            ...productData as Product,
            id: Math.random().toString(36).substr(2, 9),
            rating: 0,
            reviews: 0,
            thumbnails: [],
            stockQuantity: productData.stockQuantity || 25,
            minStock: productData.minStock || 5,
        };
        addProduct(newProduct);
    }

    navigate('/admin/products');
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 min-h-full pb-20">
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                <Link to="/admin" className="hover:text-primary transition-colors">Home</Link>
                <span className="select-none">/</span>
                <Link to="/admin/products" className="hover:text-primary transition-colors">Products</Link>
                <span className="select-none">/</span>
                <span className="text-slate-900">{id ? 'Edit Product' : 'Add New Product'}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/products')} 
                        className="group flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-all hover:border-primary hover:text-primary active:scale-95"
                        title="Back to Products"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{id ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
                        <Eye className="size-5" />
                        <span>Preview</span>
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-95"
                    >
                        <Save className="size-5" />
                        <span>{id ? 'Update Product' : 'Save Product'}</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">General Information</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Product Name</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border-slate-200 bg-surface px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary" 
                                placeholder="e.g., Wireless Noise-Canceling Headphones" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Price ($)</label>
                                <input 
                                    type="number" 
                                    className="w-full rounded-lg border-slate-200 bg-surface px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary" 
                                    placeholder="0.00" 
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                             <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Discount Price ($)</label>
                                <input 
                                    type="number" 
                                    className="w-full rounded-lg border-slate-200 bg-surface px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary" 
                                    placeholder="0.00" 
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Short Description</h2>
                    <div className="mb-2 flex items-center gap-1 overflow-x-auto rounded-t-lg border-b border-slate-200 pb-2">
                        <button className="rounded p-1 text-slate-500 hover:bg-slate-100"><Bold className="size-5" /></button>
                        <button className="rounded p-1 text-slate-500 hover:bg-slate-100"><Italic className="size-5" /></button>
                        <button className="rounded p-1 text-slate-500 hover:bg-slate-100"><Underline className="size-5" /></button>
                        <div className="mx-1 h-4 w-px bg-slate-300"></div>
                        <button className="rounded p-1 text-slate-500 hover:bg-slate-100"><List className="size-5" /></button>
                        <div className="mx-1 h-4 w-px bg-slate-300"></div>
                        <button className="rounded p-1 text-slate-500 hover:bg-slate-100"><LinkIcon className="size-5" /></button>
                        <button className="rounded p-1 text-slate-500 hover:bg-slate-100"><ImageIcon className="size-5" /></button>
                    </div>
                    <textarea 
                        className="w-full rounded-b-lg border-0 bg-transparent p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0" 
                        rows={6} 
                        placeholder="Enter a short description about the product..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                     <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Product Specifications</h2>
                        <button className="text-sm font-medium text-primary hover:text-blue-700">+ Add Row</button>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Attribute</th>
                                    <th className="px-4 py-3 font-medium">Value</th>
                                    <th className="px-4 py-3 text-center font-medium w-16">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                <tr>
                                    <td className="p-2"><input type="text" className="w-full rounded border-slate-200 bg-transparent px-2 py-1.5 text-sm" defaultValue="Brand" /></td>
                                    <td className="p-2"><input type="text" className="w-full rounded border-slate-200 bg-transparent px-2 py-1.5 text-sm" defaultValue="Sony" /></td>
                                    <td className="p-2 text-center"><button className="text-slate-400 hover:text-red-500"><Trash2 className="size-5" /></button></td>
                                </tr>
                                 <tr>
                                    <td className="p-2"><input type="text" className="w-full rounded border-slate-200 bg-transparent px-2 py-1.5 text-sm" defaultValue="Model" /></td>
                                    <td className="p-2"><input type="text" className="w-full rounded border-slate-200 bg-transparent px-2 py-1.5 text-sm" defaultValue="WH-1000XM5" /></td>
                                    <td className="p-2 text-center"><button className="text-slate-400 hover:text-red-500"><Trash2 className="size-5" /></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Product Media</h2>
                    <div className="flex flex-col gap-4">
                        <div className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-primary hover:bg-blue-50/50">
                            <input type="file" className="absolute inset-0 z-10 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                {image ? (
                                    <img src={image} className="h-48 w-full object-contain" alt="Preview" />
                                ) : (
                                    <>
                                    <CloudUpload className="mb-2 size-10 text-slate-400 group-hover:text-primary" />
                                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                             {image && (
                                <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                                    <img src={image} className="h-full w-full object-cover" alt="thumb" />
                                    <button onClick={() => setImage('')} className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5 text-slate-600 hover:bg-red-50 hover:text-red-500"><X className="size-3" /></button>
                                </div>
                             )}
                             <div className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:border-primary hover:text-primary">
                                <Plus className="size-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Organization</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
                            <select 
                                className="w-full rounded-lg border-slate-200 bg-surface px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-primary"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Electronics</option>
                                <option>Accessories</option>
                                <option>Footwear</option>
                                <option>Fashion</option>
                                <option>Home Decor</option>
                            </select>
                        </div>
                        <div>
                             <label className="mb-1.5 block text-sm font-medium text-slate-700">SKU</label>
                             <input 
                                type="text" 
                                className="w-full rounded-lg border-slate-200 bg-surface px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary" 
                                placeholder="e.g. SKU-1234" 
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-surface p-3">
                                <span className="text-sm font-medium text-slate-700">Stock Status</span>
                                <label className="inline-flex cursor-pointer items-center">
                                    <input 
                                        type="checkbox" 
                                        className="peer sr-only" 
                                        checked={stockStatus === 'In Stock'}
                                        onChange={(e) => setStockStatus(e.target.checked ? 'In Stock' : 'Out of Stock')}
                                    />
                                    <div className="peer relative h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                </label>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">Toggle on for "In Stock", off for "Out of Stock".</p>
                        </div>
                        <div>
                             <label className="mb-1.5 block text-sm font-medium text-slate-700">Tags</label>
                             <input type="text" className="w-full rounded-lg border-slate-200 bg-surface px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary" placeholder="Type and press Enter" />
                             <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">Wireless <X className="size-3 cursor-pointer hover:text-red-500" /></span>
                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">Audio <X className="size-3 cursor-pointer hover:text-red-500" /></span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminAddProduct;
