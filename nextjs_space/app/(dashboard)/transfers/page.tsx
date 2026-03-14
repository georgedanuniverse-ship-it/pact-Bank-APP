'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Users, Building2, Globe } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type TransferType = 'internal' | 'external' | 'international';

export default function TransfersPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [transferType, setTransferType] = useState<TransferType>('internal');
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: '',
    recipientName: '',
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
      const [accountsRes, beneficiariesRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/beneficiaries'),
      ]);

      const accountsData = await accountsRes.json();
      const beneficiariesData = await beneficiariesRes.json();

      setAccounts(accountsData?.accounts ?? []);
      setBeneficiaries(beneficiariesData?.beneficiaries ?? []);

      if (accountsData?.accounts?.length > 0) {
        setFormData((prev) => ({ ...prev, fromAccountId: accountsData.accounts[0].id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBeneficiarySelect = (beneficiary: any) => {
    setFormData({
      ...formData,
      toAccountNumber: beneficiary?.accountNumber ?? '',
      recipientName: beneficiary?.name ?? '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          transferType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Transfer failed');
        setLoading(false);
        return;
      }

      setReference(data?.reference ?? '');
      setSuccess(true);
      setFormData({
        fromAccountId: accounts?.[0]?.id ?? '',
        toAccountNumber: '',
        amount: '',
        description: '',
        recipientName: '',
      });
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = accounts?.find((a) => a?.id === formData.fromAccountId);
  const filteredBeneficiaries = beneficiaries?.filter((b) => b?.type === transferType) ?? [];

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-primary mb-4">
            Transfer Successful!
          </h2>
          <p className="text-sage mb-6">
            Your transfer has been processed successfully.
          </p>
          <div className="bg-cream rounded-lg p-4 mb-6">
            <p className="text-sm text-sage mb-1">Reference Number</p>
            <p className="text-lg font-heading font-semibold text-primary">{reference}</p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Make Another Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Money Transfer</h1>
        <p className="text-sage">Send money securely to beneficiaries</p>
      </div>

      {/* Transfer Type Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Transfer Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setTransferType('internal')}
            className={`p-4 rounded-lg border-2 transition-all ${
              transferType === 'internal'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className={transferType === 'internal' ? 'text-primary' : 'text-sage'} size={24} />
            <p className="font-medium text-primary mt-2">Internal Transfer</p>
            <p className="text-sm text-sage mt-1">To Pact Bank customers</p>
          </button>

          <button
            onClick={() => setTransferType('external')}
            className={`p-4 rounded-lg border-2 transition-all ${
              transferType === 'external'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Building2 className={transferType === 'external' ? 'text-primary' : 'text-sage'} size={24} />
            <p className="font-medium text-primary mt-2">External Transfer</p>
            <p className="text-sm text-sage mt-1">To other banks</p>
          </button>

          <button
            onClick={() => setTransferType('international')}
            className={`p-4 rounded-lg border-2 transition-all ${
              transferType === 'international'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Globe className={transferType === 'international' ? 'text-primary' : 'text-sage'} size={24} />
            <p className="font-medium text-primary mt-2">International</p>
            <p className="text-sm text-sage mt-1">Cross-border transfers</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-heading font-semibold text-primary">Transfer Details</h2>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter recipient name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                value={formData.toAccountNumber}
                onChange={(e) => setFormData({ ...formData, toAccountNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter account number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage">$</span>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Enter transfer description"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : (
                <>
                  <span>Transfer</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Saved Beneficiaries */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Saved Beneficiaries</h2>
          <div className="space-y-3">
            {filteredBeneficiaries?.length === 0 ? (
              <p className="text-sm text-sage text-center py-4">No saved beneficiaries</p>
            ) : (
              filteredBeneficiaries?.map((beneficiary) => (
                <button
                  key={beneficiary?.id}
                  onClick={() => handleBeneficiarySelect(beneficiary)}
                  className="w-full text-left p-3 bg-cream rounded-lg hover:bg-cream-warm transition-colors"
                >
                  <p className="font-medium text-primary text-sm">{beneficiary?.name}</p>
                  <p className="text-xs text-sage">{beneficiary?.bankName}</p>
                  <p className="text-xs text-sage">•••• {beneficiary?.accountNumber?.slice(-4)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
