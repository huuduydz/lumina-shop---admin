
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Edit, Trash2, ChevronLeft, ChevronRight, Download, RefreshCw, AlertTriangle, Package, CheckCircle, X, Settings2, PenLine } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

const AdminProducts = () => {
  const { products, deleteProduct, updateStock, exportData, syncData } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Unified Stock Modal State
  const [stockModal, setStockModal] = useState<{ 
      open: boolean, 
      product: Product | null, 
      mode: 'ADD' | 'SET' 
  }>({ open: false, product: null, mode: 'ADD' });
  
  const [stockValue, setStockValue] = useState<string>('');
  const [stockNote, setStockNote] = useState<string>('');

  const handleSync = async () => {
      setIsSyncing(true);
      await syncData();
      setIsSyncing(false);
      alert("Inventory synced successfully!");
  };

  const openStockModal = (product: Product, mode: 'ADD' | 'SET') => {
      setStockModal({ open: true, product, mode });
      setStockValue(mode === 'SET' ? product.stockQuantity.toString() : '');
      setStockNote('');
  };

  const handleStockUpdate = () => {
      if (!stockModal.product || !stockValue) return;
      
      const inputVal = parseInt(stockValue);
      if (isNaN(inputVal) || inputVal < 0) {
          alert("Please enter a valid positive number");
          return;
      }

      if (stockModal.mode === 'ADD') {
          // Add mode: Simple addition
          if (inputVal > 0) {
            updateStock(stockModal.product.id, inputVal, 'IN', 'Manual', stockNote || 'Manual Restock');
          }
      } else {
          // Set mode: Calculate difference
          const currentQty = stockModal.product.stockQuantity;
          if (inputVal > currentQty) {
              // Increasing stock
              updateStock(stockModal.product.id, inputVal - currentQty, 'IN', 'Manual', stockNote || 'Stock Correction (Set)');
          } else if (inputVal < currentQty) {
              // Decreasing stock
              updateStock(stockModal.product.id, currentQty - inputVal, 'OUT', 'Manual', stockNote || 'Stock Correction (Set)');
          }
      }

      setStockModal({ open: false, product: null, mode: 'ADD' });
      setStockValue('');
      setStockNote('');
  };

  const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 min-h-full pb-20 relative">
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                <Link to="/admin" className="hover:text-primary transition-colors">Home</Link>
                <span className="select-none">/</span>
                <span className="text-slate-900">Inventory Management</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Inventory & Products</h1>
                <div className="flex gap-2">
                    <button onClick={handleSync} disabled={isSyncing} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
                        <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Syncing...' : 'Sync Stock'}</span>
                    </button>
                    <button onClick={exportData} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
                        <Download className="size-4" />
                        <span>Export JSON</span>
                    </button>
                    <Link to="/admin/products/new" className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-95">
                        <Plus className="size-5" />
                        <span>Add Product</span>
                    </Link>
                </div>
            </div>
        </div>

        {/* Inventory Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Total Products</p>
                    <h3 className="text-2xl font-bold text-slate-900">{products.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-primary rounded-lg"><Package className="size-6" /></div>
             </div>
             <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Total Stock Quantity</p>
                    <h3 className="text-2xl font-bold text-slate-900">{products.reduce((acc, p) => acc + p.stockQuantity, 0)}</h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="size-6" /></div>
             </div>
             <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Low Stock Alerts</p>
                    <h3 className="text-2xl font-bold text-orange-600">{products.filter(p => p.stockQuantity <= p.minStock).length}</h3>
                </div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle className="size-6" /></div>
             </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-md">
                <label className="relative flex h-10 w-full items-center">
                    <div className="absolute left-3 flex items-center justify-center text-slate-400">
                        <Search className="size-5" />
                    </div>
                    <input 
                        className="h-full w-full rounded-lg border-none bg-surface pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary" 
                        placeholder="Search by name or SKU" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {['Category', 'Stock Status', 'Price Range'].map(filter => (
                    <div key={filter} className="relative">
                        <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <span>{filter}</span>
                            <Filter className="size-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Product</th>
                            <th className="px-6 py-4 font-semibold">SKU</th>
                            <th className="px-6 py-4 font-semibold text-center">In Stock</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 text-right font-semibold">Price</th>
                            <th className="px-6 py-4 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((product) => {
                            const isLowStock = product.stockQuantity <= product.minStock;
                            return (
                                <tr key={product.id} className="group hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100 shrink-0">
                                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="font-bold text-slate-900 line-clamp-1">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        {product.sku || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center justify-center group/stock">
                                            <div 
                                                className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-200 transition-colors"
                                                onClick={() => openStockModal(product, 'SET')}
                                                title="Click to edit quantity"
                                            >
                                                <span className={`font-bold text-base ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>{product.stockQuantity}</span>
                                                <PenLine className="size-3 text-slate-400 opacity-0 group-hover/stock:opacity-100 transition-opacity" />
                                            </div>
                                            {isLowStock && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 rounded mt-1">Low (Min: {product.minStock})</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${product.stockQuantity > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            <span className={`size-1.5 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {product.stockQuantity > 0 ? 'Active' : 'Empty'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                             <button 
                                                onClick={() => openStockModal(product, 'ADD')}
                                                title="Quick Restock (Add)"
                                                className="rounded-lg p-2 text-slate-500 hover:bg-green-50 hover:text-green-600 transition-colors"
                                            >
                                                <Plus className="size-5" />
                                            </button>
                                            <Link 
                                                to={`/admin/products/edit/${product.id}`}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors"
                                            >
                                                <Edit className="size-5" />
                                            </Link>
                                            <button 
                                                onClick={() => deleteProduct(product.id)}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="size-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
             <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
                <div className="text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-900">1-{filteredProducts.length}</span> of <span className="font-semibold text-slate-900">{filteredProducts.length}</span> products
                </div>
            </div>
        </div>

        {/* Unified Stock Management Modal */}
        {stockModal.open && stockModal.product && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Manage Stock</h3>
                        <button onClick={() => setStockModal({ ...stockModal, open: false })} className="text-slate-400 hover:text-red-500"><X className="size-6" /></button>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6 p-3 bg-slate-50 rounded-lg">
                        <img src={stockModal.product.image} className="size-12 rounded-lg object-cover" alt="" />
                        <div>
                            <p className="font-bold text-slate-900">{stockModal.product.name}</p>
                            <p className="text-sm text-slate-500">Current Stock: <span className="font-bold text-primary">{stockModal.product.stockQuantity}</span></p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6">
                        <button 
                            onClick={() => { setStockModal({ ...stockModal, mode: 'ADD' }); setStockValue(''); }}
                            className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${stockModal.mode === 'ADD' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Add Stock
                        </button>
                        <button 
                            onClick={() => { setStockModal({ ...stockModal, mode: 'SET' }); setStockValue(stockModal.product?.stockQuantity.toString() || ''); }}
                             className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${stockModal.mode === 'SET' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Set Total
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {stockModal.mode === 'ADD' ? 'Quantity to Add (+)' : 'New Total Quantity (=)'}
                            </label>
                            <input 
                                type="number" 
                                min="0"
                                className="w-full rounded-lg border-slate-200 p-2.5 text-sm focus:ring-primary focus:border-primary font-bold text-lg" 
                                value={stockValue} 
                                onChange={e => setStockValue(e.target.value)} 
                                autoFocus
                                placeholder={stockModal.mode === 'ADD' ? "0" : stockModal.product.stockQuantity.toString()}
                            />
                            {stockModal.mode === 'SET' && stockValue && !isNaN(parseInt(stockValue)) && (
                                <p className="text-xs text-slate-500 mt-1 text-right">
                                    Difference: 
                                    <span className={parseInt(stockValue) > stockModal.product.stockQuantity ? 'text-green-600 font-bold ml-1' : 'text-red-500 font-bold ml-1'}>
                                        {parseInt(stockValue) - stockModal.product.stockQuantity > 0 ? '+' : ''}
                                        {parseInt(stockValue) - stockModal.product.stockQuantity}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Note (Optional)</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border-slate-200 p-2.5 text-sm" 
                                placeholder={stockModal.mode === 'ADD' ? "e.g. Received from Supplier" : "e.g. Audit correction"}
                                value={stockNote} 
                                onChange={e => setStockNote(e.target.value)} 
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setStockModal({ ...stockModal, open: false })} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 rounded-lg hover:bg-slate-50">Cancel</button>
                            <button onClick={handleStockUpdate} className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">
                                {stockModal.mode === 'ADD' ? 'Confirm Restock' : 'Update Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminProducts;
