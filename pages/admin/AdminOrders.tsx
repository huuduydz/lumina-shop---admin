
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, RefreshCw, CheckCircle, Truck, Clock, XCircle, ChevronDown, User, Mail, Phone, MapPin, Loader } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types';

const AdminOrders = () => {
  const { orders, updateOrderStatus, isLoading } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
      switch(status) {
          case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
          case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
          case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
          default: return 'bg-slate-100 text-slate-800';
      }
  };

  const StatusIcon = ({ status }: { status: Order['status'] }) => {
      switch(status) {
          case 'Pending': return <Clock className="size-3" />;
          case 'Processing': return <RefreshCw className="size-3" />;
          case 'Shipped': return <Truck className="size-3" />;
          case 'Delivered': return <CheckCircle className="size-3" />;
          case 'Cancelled': return <XCircle className="size-3" />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 min-h-full pb-20 relative">
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                <Link to="/admin" className="hover:text-primary transition-colors">Home</Link>
                <span className="select-none">/</span>
                <span className="text-slate-900">Order Management</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Orders</h1>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                        Total Orders: <span className="text-slate-900 font-bold">{orders.length}</span>
                    </div>
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                        Total Revenue: <span className="text-emerald-600 font-bold">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="size-8 animate-spin text-primary mr-3" />
            <span className="text-slate-600 font-medium">Loading orders from database...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Truck className="size-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">No orders yet</h3>
            <p className="text-slate-500">Orders will appear here when customers start placing them</p>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
            <div className="w-full md:max-w-md">
                <label className="relative flex h-10 w-full items-center">
                    <div className="absolute left-3 flex items-center justify-center text-slate-400">
                        <Search className="size-5" />
                    </div>
                    <input 
                        className="h-full w-full rounded-lg border-none bg-surface pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary" 
                        placeholder="Search order ID, customer name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 font-medium">Status:</span>
                <select 
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:border-primary focus:ring-primary"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Order ID</th>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Total</th>
                            <th className="px-6 py-4 font-semibold">Payment</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">CRM Sync</th>
                            <th className="px-6 py-4 text-center font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="group hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-slate-900">#{order.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">{order.customer.name}</span>
                                        <span className="text-xs text-slate-500">{order.customer.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900">
                                    ${order.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-600">{order.paymentMethod}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        <StatusIcon status={order.status} />
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {order.crmSynced ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Synced</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Pending</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Eye className="size-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
            <div className="fixed inset-0 z-50 flex justify-end">
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
                <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col border-l border-slate-200 transform transition-transform animate-in slide-in-from-right duration-300">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Order #{selectedOrder.id}</h2>
                            <p className="text-sm text-slate-500">{new Date(selectedOrder.date).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select 
                                className="text-sm border border-slate-200 rounded-lg p-2 font-bold focus:ring-primary focus:border-primary"
                                value={selectedOrder.status}
                                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="size-8" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                        {/* Customer Info */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                <User className="size-4" /> Customer Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500">Name</p>
                                    <p className="font-bold text-slate-900">{selectedOrder.customer.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 flex items-center gap-1"><Mail className="size-3" /> Email</p>
                                    <p className="font-bold text-slate-900">{selectedOrder.customer.email}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 flex items-center gap-1"><Phone className="size-3" /> Phone</p>
                                    <p className="font-bold text-slate-900">{selectedOrder.customer.phone}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 flex items-center gap-1"><MapPin className="size-3" /> Shipping Address</p>
                                    <p className="font-bold text-slate-900">{selectedOrder.customer.address}</p>
                                </div>
                            </div>
                            {selectedOrder.customer.note && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-slate-500 text-xs mb-1">Note:</p>
                                    <p className="text-sm italic text-slate-700">{selectedOrder.customer.note}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                             <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                <Truck className="size-4" /> Order Items
                            </h3>
                            <div className="flex flex-col gap-4">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <img src={item.image} alt="" className="size-16 rounded-lg object-cover bg-slate-100" />
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {item.selectedColor}
                                                {item.selectedSize && ` • Size ${item.selectedSize}`}
                                                {` | x${item.quantity}`}
                                            </p>
                                        </div>
                                        <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                             <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Payment Summary</h3>
                             <div className="space-y-2 text-sm">
                                 <div className="flex justify-between text-slate-600">
                                     <span>Subtotal</span>
                                     <span>${selectedOrder.subtotal.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-slate-600">
                                     <span>Discount</span>
                                     <span>-${selectedOrder.discount.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-slate-600">
                                     <span>Payment Method</span>
                                     <span className="font-medium">{selectedOrder.paymentMethod}</span>
                                 </div>
                                 <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-end">
                                     <span className="font-bold text-slate-900">Total Paid</span>
                                     <span className="text-xl font-bold text-primary">${selectedOrder.total.toFixed(2)}</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminOrders;
