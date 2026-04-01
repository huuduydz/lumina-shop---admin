import React from 'react';
import { Users, DollarSign, ShoppingBag, Repeat, TrendingUp, UserPlus, Mail } from 'lucide-react';
import { useCRM } from '../../../context/CRMContext';
import { useOrders } from '../../../context/OrderContext';
import { Link } from 'react-router-dom';
import { MembershipLevel, Order } from '../../../types';

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
  
  const returningCustomers = (Object.values(customerOrderCounts) as number[]).filter(count => count > 1).length;
  const returningRate = totalCustomers > 0 ? ((returningCustomers / totalCustomers) * 100).toFixed(1) : 0;

  const ordersByCustomer = orders.reduce((acc, order) => {
    const email = order.customer.email || '';
    if (!email) return acc;
    if (!acc[email]) {
      acc[email] = [];
    }
    acc[email].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const customerPerformance = customers
    .map(customer => {
      const customerOrders = ordersByCustomer[customer.email] || [];
      const orderCount = customerOrders.length;
      const deliveredCount = customerOrders.filter(order => order.status === 'Delivered').length;
      const syncedCount = customerOrders.filter(order => order.crmSynced).length;
      const averageOrderValue = orderCount > 0 ? customer.totalSpent / orderCount : 0;

      const lastOrderDate =
        orderCount > 0
          ? customerOrders.reduce((latestOrder, currentOrder) =>
              new Date(currentOrder.date) > new Date(latestOrder.date) ? currentOrder : latestOrder
            ).date
          : null;

      return {
        ...customer,
        orderCount,
        deliveredCount,
        syncedCount,
        averageOrderValue,
        lastOrderDate
      };
    })
    .sort((first, second) => second.totalSpent - first.totalSpent || second.orderCount - first.orderCount)
    .slice(0, 8);

  const getMembershipColor = (level: MembershipLevel) => {
    switch (level) {
      case 'Diamond':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Silver':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getSyncBadge = (syncedCount: number, orderCount: number) => {
    if (orderCount === 0) {
      return 'bg-slate-100 text-slate-500';
    }

    if (syncedCount === orderCount) {
      return 'bg-green-100 text-green-700';
    }

    return 'bg-amber-100 text-amber-700';
  };

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
            <Link to="/admin/orders" className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <ShoppingBag className="size-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">Open Order Management</span>
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">Customer Performance Dashboard</h3>
            <p className="text-sm text-slate-500">Top customers ranked by total spent and order activity.</p>
          </div>
          <span className="text-sm font-semibold text-slate-500">Top 8 customers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Membership</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Delivered</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Avg Order</th>
                <th className="px-6 py-4">Last Order</th>
                <th className="px-6 py-4">CRM Sync</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {customerPerformance.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold border ${getMembershipColor(customer.membershipLevel)}`}>
                      {customer.membershipLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{customer.orderCount}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{customer.deliveredCount}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${customer.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-700">
                    {customer.orderCount > 0 ? `$${customer.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '$0'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getSyncBadge(customer.syncedCount, customer.orderCount)}`}>
                      {customer.orderCount > 0 ? `${customer.syncedCount}/${customer.orderCount} synced` : 'No data'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customerPerformance.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-500">
            No customer data available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCRM;
