'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Zap, Droplet, Wifi, Smartphone, Tv, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const BILLERS = [
  { name: 'EKEDC', category: 'electricity', icon: Zap },
  { name: 'IKEDC', category: 'electricity', icon: Zap },
  { name: 'Kenya Power & Lighting', category: 'electricity', icon: Zap },
  { name: 'Smile Communications', category: 'internet', icon: Wifi },
  { name: 'Safaricom', category: 'internet', icon: Wifi },
  { name: 'MTN', category: 'airtime', icon: Smartphone },
  { name: 'Airtel', category: 'airtime', icon: Smartphone },
  { name: 'Vodacom', category: 'airtime', icon: Smartphone },
  { name: 'Lagos Water Corporation', category: 'water', icon: Droplet },
  { name: 'Nairobi Water', category: 'water', icon: Droplet },
  { name: 'DSTV', category: 'entertainment', icon: Tv },
  { name: 'GOtv', category: 'entertainment', icon: Tv },
];

export default function BillPaymentsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [billPayments, setBillPayments] = useState<any[]>([]);
  const [selectedBiller, setSelectedBiller] = useState<any>(null);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    accountNumber: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsRes, paymentsRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/bill-payments'),
      ]);

      const accountsData = await accountsRes.json();
      const paymentsData = await paymentsRes.json();

      setAccounts(accountsData?.accounts ?? []);
      setBillPayments(paymentsData?.billPayments ?? []);

      if (accountsData?.accounts?.length > 0) {
        setFormData((prev) => ({ ...prev, fromAccountId: accountsData.accounts[0].id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBillerSelect = (biller: any) => {
    setSelectedBiller(biller);
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bill-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billerName: selectedBiller?.name,
          billerCategory: selectedBiller?.category,
          accountNumber: formData.accountNumber,
          amount: parseFloat(formData.amount),
          currency: 'NGN',
          fromAccountId: formData.fromAccountId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Payment failed');
        setLoading(false);
        return;
      }

      setReference(data?.reference ?? '');
      setSuccess(true);
      setFormData({
        fromAccountId: accounts?.[0]?.id ?? '',
        accountNumber: '',
        amount: '',
      });
      fetchData();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-primary mb-4">
            Payment Successful!
          </h2>
          <p className="text-sage mb-6">
            Your bill payment to {selectedBiller?.name} has been processed.
          </p>
          <div className="bg-cream rounded-lg p-4 mb-6">
            <p className="text-sm text-sage mb-1">Reference Number</p>
            <p className="text-lg font-heading font-semibold text-primary">{reference}</p>
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              setSelectedBiller(null);
            }}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }

  if (selectedBiller) {
    const Icon = selectedBiller?.icon ?? CreditCard;
    const selectedAccount = accounts?.find((a) => a?.id === formData.fromAccountId);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedBiller(null)}
          className="text-primary hover:text-primary-dark font-medium flex items-center gap-2"
        >
          ← Back to Billers
        </button>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <Icon className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-primary">{selectedBiller?.name}</h2>
              <p className="text-sm text-sage capitalize">{selectedBiller?.category}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
              <select
                value={formData.fromAccountId}
                onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                {accounts?.map((account) => (
                  <option key={account?.id} value={account?.id}>
                    {account?.accountType} (•••• {account?.accountNumber?.slice(-4)}) - {formatCurrency(account?.balance ?? 0, account?.currency ?? 'USD')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedBiller?.category === 'airtime' ? 'Phone Number' : 'Account/Meter Number'}
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={selectedBiller?.category === 'airtime' ? '+234 XXX XXX XXXX' : 'Enter account number'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage">₦</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              {selectedAccount && (
                <p className="text-sm text-sage mt-1">
                  Available: {formatCurrency(selectedAccount?.balance ?? 0, selectedAccount?.currency ?? 'USD')}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Bill Payments</h1>
        <p className="text-sage">Pay your bills quickly and securely</p>
      </div>

      {/* Biller Categories */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Select Biller</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BILLERS?.map((biller) => {
            const Icon = biller?.icon ?? CreditCard;
            return (
              <button
                key={biller?.name}
                onClick={() => handleBillerSelect(biller)}
                className="p-4 bg-cream rounded-lg hover:bg-cream-warm transition-colors border border-gray-200 group"
              >
                <Icon className="text-primary mb-2 mx-auto group-hover:scale-110 transition-transform" size={32} />
                <p className="text-sm font-medium text-primary text-center">{biller?.name}</p>
                <p className="text-xs text-sage text-center capitalize">{biller?.category}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Recent Payments</h2>
        <div className="space-y-3">
          {billPayments?.length === 0 ? (
            <p className="text-sage text-center py-4">No bill payments yet</p>
          ) : (
            billPayments?.slice(0, 10)?.map((payment) => (
              <div
                key={payment?.id}
                className="flex items-center justify-between p-4 bg-cream rounded-lg"
              >
                <div>
                  <p className="font-medium text-primary">{payment?.billerName}</p>
                  <p className="text-sm text-sage">{formatDateTime(payment?.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-semibold text-primary">
                    {formatCurrency(payment?.amount ?? 0, payment?.currency ?? 'NGN')}
                  </p>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {payment?.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
