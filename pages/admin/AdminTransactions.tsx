
import React, { useState } from 'react';
import { ArrowLeftRight, Download, Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Link } from 'react-router-dom';

const AdminTransactions = () => {
  const { transactions, exportData } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(t => 
    t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 lg:px-16 min-h-full pb-20 relative">
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                <Link to="/admin" className="hover:text-primary transition-colors">Home</Link>
                <span className="select-none">/</span>
                <span className="text-slate-900">Transactions</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Transaction History</h1>
                <button onClick={exportData} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
                    <Download className="size-4" />
                    <span>Export JSON</span>
                </button>
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
                        placeholder="Search transactions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>
            </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Type</th>
                            <th className="px-6 py-4 font-semibold">Product</th>
                            <th className="px-6 py-4 font-semibold text-center">Quantity</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Source</th>
                            <th className="px-6 py-4 font-semibold text-right">Total Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="group hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className={`flex items-center gap-2 font-bold ${tx.type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        <div className={`p-1.5 rounded-full ${tx.type === 'IN' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                            {tx.type === 'IN' ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                                        </div>
                                        {tx.type === 'IN' ? 'Import' : 'Export'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 overflow-hidden rounded bg-slate-100 shrink-0">
                                            <img src={tx.productImage} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{tx.productName}</div>
                                            <div className="text-xs text-slate-400 font-mono">{tx.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`font-mono font-bold ${tx.type === 'IN' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                        {tx.type === 'IN' ? '+' : '-'}{tx.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {new Date(tx.date).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <span className="text-slate-900 font-medium">{tx.source}</span>
                                        {tx.note && <div className="text-xs text-slate-500 italic">{tx.note}</div>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                    {tx.totalValue ? `$${tx.totalValue.toFixed(2)}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {filteredTransactions.length === 0 && (
                <div className="p-8 text-center text-slate-500">No transactions found.</div>
            )}
        </div>
    </div>
  );
};

export default AdminTransactions;
