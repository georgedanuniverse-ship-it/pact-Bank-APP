'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Search, Download, Filter, Calendar } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    accountId: 'all',
    type: 'all',
    startDate: '',
    endDate: '',
    search: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters.accountId, filters.type, filters.startDate, filters.endDate]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(data?.accounts ?? []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.accountId !== 'all') params.append('accountId', filters.accountId);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      setTransactions(data?.transactions ?? []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions?.filter((t) => {
    if (!filters.search) return true;
    const searchLower = filters.search?.toLowerCase();
    return (
      t?.description?.toLowerCase()?.includes(searchLower) ||
      t?.category?.toLowerCase()?.includes(searchLower) ||
      t?.recipientName?.toLowerCase()?.includes(searchLower)
    );
  }) ?? [];

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Category', 'Amount', 'Currency', 'Status', 'Reference'];
    const csvData = filteredTransactions?.map((t) => [
      formatDateTime(t?.createdAt),
      t?.description,
      t?.type,
      t?.category || '',
      t?.amount,
      t?.currency,
      t?.status,
      t?.referenceNumber,
    ]) ?? [];

    const csvContent = [
      headers.join(','),
      ...csvData?.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Transactions</h1>
        <p className="text-sage">View and manage your transaction history</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
            <select
              value={filters.accountId}
              onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Accounts</option>
              {accounts?.map((account) => (
                <option key={account?.id} value={account?.id}>
                  {account?.accountType} (•••• {account?.accountNumber?.slice(-4)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
              <option value="transfer">Transfer</option>
              <option value="bill_payment">Bill Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sage" size={20} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by description, category, or recipient..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="px-6 py-2 bg-accent text-primary rounded-lg font-medium hover:bg-accent-dark transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTransactions?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sage">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions?.map((transaction) => (
                  <tr key={transaction?.id} className="hover:bg-cream transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDateTime(transaction?.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-primary">{transaction?.description}</p>
                        {transaction?.recipientName && (
                          <p className="text-xs text-sage">To: {transaction?.recipientName}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {transaction?.type === 'credit' ? (
                          <ArrowDownLeft className="text-green-600" size={16} />
                        ) : (
                          <ArrowUpRight className="text-red-600" size={16} />
                        )}
                        <span className="text-sm capitalize">{transaction?.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-700">
                      {transaction?.category || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p
                        className={`text-sm font-heading font-semibold ${
                          transaction?.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction?.type === 'credit' ? '+' : '-'}
                        {formatCurrency(transaction?.amount ?? 0, transaction?.currency ?? 'USD')}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction?.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : transaction?.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {transaction?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
