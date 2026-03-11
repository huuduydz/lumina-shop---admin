
import React, { useState } from 'react';
import { Download, Plus, Search, Filter, MoreVertical, Edit, Shield, CheckCircle, Clock, AlertTriangle, Trash2, X } from 'lucide-react';
import { SECURITY_LOGS } from '../../data';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

const AdminUsers = () => {
  const { allUsers, addUser, deleteUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New user form state
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Customer' as User['role'] });

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if(!newUser.name || !newUser.email) return;

    const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'Active',
        lastLogin: 'Never',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`
    };
    addUser(user);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Customer' });
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 relative min-h-full pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Users & Security</h1>
                <p className="text-slate-500">Manage access control, user roles, and system security protocols.</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 shadow-sm">
                    <Download className="mr-2 size-5" /> Export Log
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white font-bold text-sm transition-all shadow-md">
                    <Plus className="mr-2 size-5" /> Add New User
                </button>
            </div>
        </div>

        <div className="w-full">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="size-5 text-slate-400" />
                </div>
                <input 
                    className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary shadow-sm" 
                    placeholder="Search users by name, email, or role..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">User Directory</h2>
                        <div className="flex gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-slate-50"><Filter className="size-5" /></button>
                            <button className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-slate-50"><MoreVertical className="size-5" /></button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Login</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="block w-full text-sm text-slate-700">{user.role}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                <span className={`size-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-slate-400'}`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">{user.lastLogin}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100"><Edit className="size-5" /></button>
                                                <button onClick={() => deleteUser(user.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"><Trash2 className="size-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="bg-primary rounded-xl shadow-lg p-6 text-white relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="size-6" />
                            <h3 className="font-bold text-lg">System Secure</h3>
                        </div>
                        <p className="text-blue-100 text-sm mb-6">All systems are operational. Last security scan completed 20 minutes ago.</p>
                        <button className="w-full bg-white text-primary font-bold py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors">Run Security Scan</button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900">Security Logs</h3>
                        <a href="#" className="text-xs font-bold text-primary">View All</a>
                    </div>
                    <div className="space-y-0">
                        {SECURITY_LOGS.map((log) => (
                             <div key={log.id} className="flex gap-3 pb-4 relative">
                                <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-100"></div>
                                <div className={`relative z-10 flex-none p-1 rounded-full h-fit ${log.type === 'Warning' ? 'text-red-500 bg-red-50' : log.type === 'Info' ? 'text-blue-500 bg-blue-50' : 'text-green-500 bg-green-50'}`}>
                                    {log.type === 'Warning' ? <AlertTriangle className="size-4" /> : log.type === 'Info' ? <Clock className="size-4" /> : <CheckCircle className="size-4" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900">{log.title}</span>
                                    <span className="text-xs text-slate-500">{log.detail}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Add User Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Add New User</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X className="size-6" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" className="w-full rounded-lg border-slate-200 p-2.5 text-sm" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" className="w-full rounded-lg border-slate-200 p-2.5 text-sm" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select className="w-full rounded-lg border-slate-200 p-2.5 text-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                                <option value="Customer">Customer</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <button onClick={handleAddUser} className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 mt-4">Create User</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminUsers;
