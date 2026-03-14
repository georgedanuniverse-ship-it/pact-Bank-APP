'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Globe, FileText, Ship, Shield, ArrowRight, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const TRADE_PRODUCTS = [
  {
    title: 'Letters of Credit',
    description: 'Secure international trade with documentary credits',
    icon: FileText,
    stats: { active: 3, totalValue: 450000 },
  },
  {
    title: 'Trade Guarantees',
    description: 'Bank guarantees for trade contracts and bids',
    icon: Shield,
    stats: { active: 2, totalValue: 120000 },
  },
  {
    title: 'Import/Export Finance',
    description: 'Pre and post-shipment financing solutions',
    icon: Ship,
    stats: { active: 1, totalValue: 280000 },
  },
  {
    title: 'Forex Services',
    description: 'Competitive FX rates for cross-border transactions',
    icon: TrendingUp,
    stats: { active: 5, totalValue: 890000 },
  },
];

const RECENT_TRADE_ACTIVITIES = [
  { id: 1, type: 'Letter of Credit', counterparty: 'Shanghai Electronics Co.', amount: 185000, currency: 'USD', status: 'active', date: '2026-03-10' },
  { id: 2, type: 'Bank Guarantee', counterparty: 'Nairobi Infrastructure Ltd', amount: 75000, currency: 'USD', status: 'pending', date: '2026-03-08' },
  { id: 3, type: 'Import Finance', counterparty: 'Mumbai Textiles Export', amount: 280000, currency: 'USD', status: 'completed', date: '2026-03-05' },
  { id: 4, type: 'FX Conversion', counterparty: 'USD to NGN', amount: 50000, currency: 'USD', status: 'completed', date: '2026-03-01' },
];

export default function TradeFinancePage() {
  const { data: session } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.accountType !== 'corporate') {
      router.replace('/dashboard');
    }
  }, [session, router]);

  if (session?.user?.accountType !== 'corporate') return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-1">Trade Finance</h1>
        <p className="text-sage">Manage international trade instruments and cross-border financing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-600" size={20} />
            <p className="text-sm text-sage">Total Trade Volume</p>
          </div>
          <p className="text-2xl font-heading font-bold text-primary">{formatCurrency(1740000, 'USD')}</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="text-accent" size={20} />
            <p className="text-sm text-sage">Active Instruments</p>
          </div>
          <p className="text-2xl font-heading font-bold text-primary">11</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-blue-600" size={20} />
            <p className="text-sm text-sage">Pending Approvals</p>
          </div>
          <p className="text-2xl font-heading font-bold text-primary">1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRADE_PRODUCTS.map((product, idx) => {
          const Icon = product.icon;
          return (
            <div key={idx} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:border-accent/40 transition-colors cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-primary">{product.title}</h3>
                    <ArrowRight size={16} className="text-sage group-hover:text-accent transition-colors" />
                  </div>
                  <p className="text-sm text-sage mt-1">{product.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-sage"><span className="font-semibold text-primary">{product.stats.active}</span> active</span>
                    <span className="text-xs text-sage">Value: <span className="font-semibold text-primary">{formatCurrency(product.stats.totalValue, 'USD')}</span></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-heading font-semibold text-primary">Recent Trade Activities</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream">
                <th className="px-5 py-3 text-left text-xs font-medium text-sage uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-sage uppercase tracking-wider">Counterparty</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-sage uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-sage uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-sage uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RECENT_TRADE_ACTIVITIES.map((activity) => (
                <tr key={activity.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-primary">{activity.type}</td>
                  <td className="px-5 py-4 text-sm text-sage">{activity.counterparty}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-primary text-right">{formatCurrency(activity.amount, activity.currency)}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-sage text-right">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
