
import React, { useState } from 'react';
import { Tag, TrendingUp, DollarSign, Search, Filter, SlidersHorizontal, Plus, Copy, Trash2, Edit, X, Calendar } from 'lucide-react';
import { useCoupons } from '../../context/CouponContext';
import { Coupon } from '../../types';

const AdminCoupons = () => {
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
      code: '',
      description: '',
      type: 'Percentage',
      value: 0,
      expiryDate: '',
      usageLimit: 100,
  });

  const handleAddCoupon = () => {
      if(!newCoupon.code || !newCoupon.value) return;
      
      const coupon: Coupon = {
          id: Math.random().toString(36).substr(2, 9),
          code: newCoupon.code.toUpperCase(),
          description: newCoupon.description || '',
          type: newCoupon.type as any,
          value: Number(newCoupon.value),
          usageCount: 0,
          usageLimit: Number(newCoupon.usageLimit) || 100,
          expiryDate: newCoupon.expiryDate || 'No Expiry',
          status: 'Active'
      };

      addCoupon(coupon);
      setIsModalOpen(false);
      setNewCoupon({ code: '', description: '', type: 'Percentage', value: 0, expiryDate: '' });
  };

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 min-h-full pb-20 relative">
       {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <span>Marketing</span>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">Coupons</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Coupons & Promotions</h1>
                <p className="text-slate-500 text-base">Manage your store's marketing incentives.</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20">
                <Plus className="size-5" />
                <span>Create New Coupon</span>
            </button>
       </div>

       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard icon={<Tag className="size-10 text-primary" />} label="Active Coupons" value={coupons.filter(c => c.status === 'Active').length} trend="2 new this week" trendUp />
            <StatsCard icon={<TrendingUp className="size-10 text-primary" />} label="Total Redemptions" value="1,450" trend="15% vs last month" trendUp />
            <StatsCard icon={<DollarSign className="size-10 text-primary" />} label="Revenue Generated" value="$12,340" trend="8% vs last month" trendUp />
       </div>

       {/* Toolbar */}
       <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="relative w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="size-5 text-slate-400" />
                </div>
                <input 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" 
                    placeholder="Search by coupon code..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
           </div>
           <div className="flex items-center gap-3 w-full sm:w-auto">
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                   <Filter className="size-4" /> Filter
               </button>
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                   <SlidersHorizontal className="size-4" /> Sort
               </button>
           </div>
       </div>

       {/* Table */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
               <table className="w-full text-left">
                   <thead>
                       <tr className="bg-slate-50 border-b border-slate-200">
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Coupon Code</th>
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Discount Type</th>
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usage</th>
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                           <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-200">
                       {filteredCoupons.map((coupon) => (
                           <tr key={coupon.id} className="hover:bg-slate-50 transition-colors group">
                               <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                       <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                           <Tag className="size-5" />
                                       </div>
                                       <div>
                                           <p className="text-sm font-bold text-slate-900">{coupon.code}</p>
                                           <p className="text-xs text-slate-500">{coupon.description}</p>
                                       </div>
                                   </div>
                               </td>
                               <td className="px-6 py-4">
                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                                       {coupon.type} {coupon.value ? `(${coupon.value}%)` : ''}
                                   </span>
                               </td>
                               <td className="px-6 py-4">
                                   <div className="w-full max-w-[140px]">
                                       <div className="flex justify-between text-xs mb-1">
                                           <span className="font-medium text-slate-700">{coupon.usageCount} / {coupon.usageLimit || '∞'}</span>
                                       </div>
                                       <div className="w-full bg-slate-200 rounded-full h-1.5">
                                           <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((coupon.usageCount / (coupon.usageLimit || 1000)) * 100, 100)}%` }}></div>
                                       </div>
                                   </div>
                               </td>
                               <td className="px-6 py-4 text-sm text-slate-600">{coupon.expiryDate}</td>
                               <td className="px-6 py-4">
                                   <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${coupon.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : coupon.status === 'Expired' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-800'}`}>
                                       <span className={`size-1.5 rounded-full ${coupon.status === 'Active' ? 'bg-emerald-500' : coupon.status === 'Expired' ? 'bg-slate-400' : 'bg-blue-500'}`}></span>
                                       {coupon.status}
                                   </span>
                               </td>
                               <td className="px-6 py-4 text-right text-sm font-medium">
                                   <div className="flex items-center justify-end gap-2">
                                       <button className="p-1 text-slate-400 hover:text-primary transition-colors"><Edit className="size-5" /></button>
                                       <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors"><Copy className="size-5" /></button>
                                       <button onClick={() => deleteCoupon(coupon.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="size-5" /></button>
                                   </div>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
           {/* Pagination */}
           <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
               <p className="text-sm text-slate-600">Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{filteredCoupons.length}</span> of <span className="font-medium text-slate-900">{filteredCoupons.length}</span> results</p>
               <div className="flex gap-2">
                   <button className="px-3 py-1 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-50">Previous</button>
                   <button className="px-3 py-1 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-white">Next</button>
               </div>
           </div>
       </div>

       {/* Create Coupon Slide-over */}
       {isModalOpen && (
           <div className="fixed inset-0 z-50 flex justify-end">
               <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
               <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col border-l border-slate-200 transform transition-transform animate-in slide-in-from-right duration-300">
                   <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                       <h2 className="text-lg font-bold text-slate-900">Create New Coupon</h2>
                       <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                           <X className="size-6" />
                       </button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                       <div className="space-y-2">
                           <div className="flex justify-between items-center">
                               <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Coupon Code</label>
                               <button onClick={() => setNewCoupon({...newCoupon, code: Math.random().toString(36).substring(2,10).toUpperCase()})} className="text-xs text-primary font-semibold hover:underline">Auto-generate</button>
                           </div>
                           <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-400 font-mono uppercase" placeholder="e.g. SUMMER24" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} />
                       </div>
                       <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Description</label>
                           <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary resize-none h-20" placeholder="Internal note..." value={newCoupon.description} onChange={e => setNewCoupon({...newCoupon, description: e.target.value})}></textarea>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                               <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Type</label>
                               <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary" value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value as any})}>
                                   <option value="Percentage">Percentage (%)</option>
                                   <option value="Fixed Cart">Fixed Cart ($)</option>
                                </select>
                           </div>
                           <div className="space-y-2">
                               <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Amount</label>
                               <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary" placeholder="0.00" value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: Number(e.target.value)})} />
                           </div>
                       </div>
                       <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Expiry Date</label>
                           <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 size-5 text-slate-400" />
                                <input type="date" className="w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary" value={newCoupon.expiryDate} onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})} />
                           </div>
                       </div>
                   </div>
                   <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                       <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold text-sm hover:bg-white">Cancel</button>
                       <button onClick={handleAddCoupon} className="flex-1 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg font-bold text-sm">Publish Coupon</button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

const StatsCard = ({ icon, label, value, trend, trendUp }: any) => (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">{icon}</div>
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-slate-900 text-3xl font-bold">{value}</h3>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium w-fit px-2 py-0.5 rounded ${trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
            <span>{trend}</span>
        </div>
    </div>
);

export default AdminCoupons;
