import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCRM } from '../../../context/CRMContext';
import { useOrders } from '../../../context/OrderContext';
import { ArrowLeft, Mail, Phone, MapPin, Award, Star, ShoppingBag, Calendar, Share2 } from 'lucide-react';

const AdminCRMCustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, getCustomerOrders } = useCRM();
  const customer = customers.find(c => c.id === id);
  const customerOrders = customer ? getCustomerOrders(customer.email) : [];

  if (!customer) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-slate-900">Customer not found</h2>
        <Link to="/admin/crm/customers" className="text-primary hover:underline mt-2 block">Back to Customers</Link>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Diamond': return 'bg-blue-600 text-white';
      case 'Gold': return 'bg-yellow-500 text-white';
      case 'Silver': return 'bg-slate-400 text-white';
      default: return 'bg-orange-400 text-white';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 min-h-full pb-20">
      <Link to="/admin/crm/customers" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors w-fit">
        <ArrowLeft className="size-4" /> Back to Customers
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Profile */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-blue-400"></div>
            <div className="px-6 pb-6 relative">
              <div className="size-20 rounded-full border-4 border-white bg-slate-100 absolute -top-10 flex items-center justify-center text-2xl font-bold text-slate-500 shadow-sm">
                {customer.name.charAt(0)}
              </div>
              <div className="mt-12 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{customer.name}</h1>
                  <p className="text-sm text-slate-500">Member since {new Date(customer.joinDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getLevelColor(customer.membershipLevel)}`}>
                  <Award className="size-3" /> {customer.membershipLevel}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="size-4 text-slate-400" /> {customer.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="size-4 text-slate-400" /> {customer.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="size-4 text-slate-400" /> {customer.address}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Total Spent</p>
                  <p className="text-lg font-bold text-slate-900">${customer.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Points</p>
                  <p className="text-lg font-bold text-amber-500 flex items-center justify-center gap-1">
                    <Star className="size-4 fill-current" /> {customer.points}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Share2 className="size-5 text-primary" /> Referral Program
            </h3>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <p className="text-xs text-slate-500 mb-2">Customer's Referral Code</p>
              <div className="text-xl font-mono font-bold text-slate-900 tracking-wider select-all cursor-pointer bg-white p-2 rounded border border-dashed border-slate-300">
                {customer.referralCode}
              </div>
              <p className="text-xs text-slate-400 mt-2">Share this code to earn points!</p>
            </div>
          </div>
        </div>

        {/* Right Column: History & Stats */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" /> Purchase History
            </h3>
            
            {customerOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                      <th className="pb-3 pl-2">Order ID</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerOrders.map(order => (
                      <tr key={order.id} className="text-sm hover:bg-slate-50 transition-colors">
                        <td className="py-3 pl-2 font-medium text-slate-900">{order.id}</td>
                        <td className="py-3 text-slate-500 flex items-center gap-2">
                          <Calendar className="size-3" />
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2 font-bold text-slate-900">
                          ${order.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No orders found for this customer.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCRMCustomerDetail;
