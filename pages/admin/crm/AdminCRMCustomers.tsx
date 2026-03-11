import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, X, ChevronRight, Star, Award, User, Loader } from 'lucide-react';
import { useCRM } from '../../../context/CRMContext';
import { Customer, MembershipLevel } from '../../../types';
import { Link } from 'react-router-dom';

const AdminCRMCustomers = () => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  const getLevelColor = (level: MembershipLevel) => {
    switch (level) {
      case 'Diamond': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Silver': return 'bg-slate-200 text-slate-700 border-slate-300';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 min-h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customer Management</h1>
          <p className="text-slate-500">View and manage customer profiles, membership tiers, and history.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white font-bold text-sm transition-all shadow-md">
          <Plus className="mr-2 size-5" /> Add Customer
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader className="size-8 animate-spin text-primary mr-3" />
          <span className="text-slate-600 font-medium">Loading customers from database...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <User className="size-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">No customers yet</h3>
          <p className="text-slate-500 mb-6">Start by adding your first customer to the system</p>
          <button onClick={() => handleOpenModal()} className="px-4 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white font-bold text-sm transition-all">
            <Plus className="inline mr-2 size-4" /> Add First Customer
          </button>
        </div>
      )}

      {/* Search & Filter */}
      {!loading && customers.length > 0 && (
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input 
            className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-primary" 
            placeholder="Search by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-2">
          <Filter className="size-5" /> Filter
        </button>
      </div>
      )}

      {/* Table */}
      {!loading && customers.length > 0 && (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Membership</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <Link to={`/admin/crm/customers/${customer.id}`} className="font-bold text-slate-900 hover:text-primary transition-colors">
                          {customer.name}
                        </Link>
                        <div className="text-xs text-slate-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{customer.email}</span>
                      <span className="text-xs text-slate-500">{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getLevelColor(customer.membershipLevel)}`}>
                      <Award className="size-3" />
                      {customer.membershipLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="size-3 fill-current" />
                      {customer.points}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(customer)} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="size-4" />
                      </button>
                      <button onClick={() => deleteCustomer(customer.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                      <Link to={`/admin/crm/customers/${customer.id}`} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <ChevronRight className="size-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No customers found matching your search.
          </div>
        )}
      </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X className="size-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input 
                    required
                    className="w-full rounded-lg border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <input 
                    required
                    className="w-full rounded-lg border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full rounded-lg border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Address</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full rounded-lg border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  {editingCustomer ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCRMCustomers;
