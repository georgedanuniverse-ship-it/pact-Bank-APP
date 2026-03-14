'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function StatementsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(data?.accounts ?? []);
      if (data?.accounts?.length > 0) {
        setSelectedAccount(data.accounts[0].id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleDownload = async (period: string) => {
    setLoading(true);

    try {
      let start = '';
      let end = new Date().toISOString().split('T')[0];

      if (period === 'last_month') {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        start = date.toISOString().split('T')[0];
      } else if (period === 'last_3_months') {
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        start = date.toISOString().split('T')[0];
      } else if (period === 'custom') {
        start = startDate;
        end = endDate;
      }

      const params = new URLSearchParams();
      if (selectedAccount) params.append('accountId', selectedAccount);
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();

      // Generate CSV
      const headers = ['Date', 'Description', 'Type', 'Category', 'Amount', 'Currency', 'Status', 'Reference'];
      const csvData = data?.transactions?.map((t: any) => [
        formatDate(t?.createdAt),
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
        ...csvData?.map((row: any[]) => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statement-${period}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error downloading statement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Account Statements</h1>
        <p className="text-sage">Download your transaction history</p>
      </div>

      {/* Account Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {accounts?.map((account) => (
            <option key={account?.id} value={account?.id}>
              {account?.accountType} (•••• {account?.accountNumber?.slice(-4)}) - {formatCurrency(account?.balance ?? 0, account?.currency ?? 'USD')}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Download Options */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Quick Download</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleDownload('last_month')}
            disabled={loading}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="text-primary mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-medium text-primary">Last Month</p>
            <p className="text-sm text-sage">Download last 30 days</p>
          </button>

          <button
            onClick={() => handleDownload('last_3_months')}
            disabled={loading}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="text-primary mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-medium text-primary">Last 3 Months</p>
            <p className="text-sm text-sage">Download last quarter</p>
          </button>
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Custom Date Range
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => handleDownload('custom')}
            disabled={loading || !startDate || !endDate}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download size={20} />
            {loading ? 'Generating...' : 'Download Statement'}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-accent bg-opacity-10 border border-accent rounded-lg p-4">
        <p className="text-sm text-primary">
          📝 <strong>Note:</strong> Statements are generated in CSV format. You can open them with Excel, Google Sheets, or any spreadsheet application.
        </p>
      </div>
    </div>
  );
}
