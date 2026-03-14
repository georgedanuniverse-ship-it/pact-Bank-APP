'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart3, Download, FileText, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const REPORT_TYPES = [
  { id: 'income', name: 'Income Statement', description: 'Revenue, expenses, and net income summary', icon: TrendingUp, lastGenerated: '2026-03-01' },
  { id: 'cashflow', name: 'Cash Flow Report', description: 'Cash inflows and outflows analysis', icon: BarChart3, lastGenerated: '2026-03-01' },
  { id: 'balance', name: 'Balance Sheet', description: 'Assets, liabilities, and equity overview', icon: FileText, lastGenerated: '2026-02-28' },
  { id: 'payroll', name: 'Payroll Summary', description: 'Monthly payroll expenditure breakdown', icon: Calendar, lastGenerated: '2026-02-28' },
];

const MONTHLY_SUMMARY = [
  { month: 'March 2026', revenue: 285000, expenses: 198000, net: 87000 },
  { month: 'February 2026', revenue: 312000, expenses: 215000, net: 97000 },
  { month: 'January 2026', revenue: 298000, expenses: 205000, net: 93000 },
  { month: 'December 2025', revenue: 335000, expenses: 242000, net: 93000 },
  { month: 'November 2025', revenue: 278000, expenses: 190000, net: 88000 },
];

export default function ReportsPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('q1-2026');

  useEffect(() => {
    if (session?.user?.accountType !== 'corporate') {
      router.replace('/dashboard');
    }
  }, [session, router]);

  if (session?.user?.accountType !== 'corporate') return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-1">Business Reports</h1>
          <p className="text-sage">Financial reports and business analytics</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="q1-2026">Q1 2026</option>
          <option value="q4-2025">Q4 2025</option>
          <option value="q3-2025">Q3 2025</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-sage mb-1">Total Revenue (Q1)</p>
          <p className="text-2xl font-heading font-bold text-green-600">{formatCurrency(895000, 'USD')}</p>
          <p className="text-xs text-green-500 mt-1">+8.2% vs Q4 2025</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-sage mb-1">Total Expenses (Q1)</p>
          <p className="text-2xl font-heading font-bold text-red-600">{formatCurrency(618000, 'USD')}</p>
          <p className="text-xs text-red-500 mt-1">+3.1% vs Q4 2025</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-sage mb-1">Net Income (Q1)</p>
          <p className="text-2xl font-heading font-bold text-primary">{formatCurrency(277000, 'USD')}</p>
          <p className="text-xs text-green-500 mt-1">+5.4% vs Q4 2025</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_TYPES.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="flex items-start gap-4 p-4 bg-cream rounded-lg hover:bg-cream-warm transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="text-primary" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-primary">{report.name}</h3>
                  <p className="text-sm text-sage mt-0.5">{report.description}</p>
                  <p className="text-xs text-sage mt-1">Last generated: {report.lastGenerated}</p>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-accent hover:text-accent-dark border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors">
                  <Download size={14} />
                  Download
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-heading font-semibold text-primary">Monthly Financial Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream">
                <th className="px-5 py-3 text-left text-xs font-medium text-sage uppercase tracking-wider">Month</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-sage uppercase tracking-wider">Revenue</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-sage uppercase tracking-wider">Expenses</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-sage uppercase tracking-wider">Net Income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MONTHLY_SUMMARY.map((row, idx) => (
                <tr key={idx} className="hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-primary">{row.month}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-green-600 text-right">{formatCurrency(row.revenue, 'USD')}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-red-600 text-right">{formatCurrency(row.expenses, 'USD')}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-primary text-right">{formatCurrency(row.net, 'USD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
