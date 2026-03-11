import React from 'react';
import { Users, DollarSign, ShoppingBag, Repeat, TrendingUp, UserPlus, Mail } from 'lucide-react';
import { useCRM } from '../../../context/CRMContext';
import { useOrders } from '../../../context/OrderContext';
import { Link } from 'react-router-dom';

const AdminCRM = () => {
  const { customers } = useCRM();
  const { orders } = useOrders();

  // KPIs
  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Returning Customer Rate
  const customerOrderCounts = orders.reduce((acc, order) => {
    acc[order.customer.email] = (acc[order.customer.email] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
  const returningRate = totalCustomers > 0 ? ((returningCustomers / totalCustomers) * 100).toFixed(1) : 0;

  // Recent Activity (Simulated)
  const recentActivity = [
    { id: 1, user: 'Cameron Williamson', action: 'Upgraded to Silver', time: '2 hours ago', icon: TrendingUp, color: 'text-blue-500 bg-blue-50' },
    { id: 2, user: 'Esther Howard', action: 'Referred a friend', time: '5 hours ago', icon: UserPlus, color: 'text-green-500 bg-green-50' },
    { id: 3, user: 'Jenny Wilson', action: 'Opened email campaign', time: '1 day ago', icon: Mail, color: 'text-purple-500 bg-purple-50' },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 min-h-full pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">CRM Dashboard</h1>
        <p className="text-slate-500">Overview of customer relationships and performance metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Customers</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalCustomers}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="size-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
            <TrendingUp className="size-3" /> +12% this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <DollarSign className="size-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
            <TrendingUp className="size-3" /> +8% this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalOrders}</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <ShoppingBag className="size-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 w-fit px-2 py-1 rounded">
            <TrendingUp className="size-3 rotate-180" /> -2% this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Returning Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{returningRate}%</h3>
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Repeat className="size-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
            <TrendingUp className="size-3" /> +5% this month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Recent CRM Activity</h3>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${activity.color}`}>
                  <activity.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    <span className="font-bold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <Link to="/admin/crm/customers" className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <UserPlus className="size-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">Add New Customer</span>
              </div>
            </Link>
            <button className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Mail className="size-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">Send Email Campaign</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCRM;
