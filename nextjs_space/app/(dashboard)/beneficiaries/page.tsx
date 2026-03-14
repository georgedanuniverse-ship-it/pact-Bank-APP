'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Users, Building2, Globe } from 'lucide-react';

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    bankName: '',
    bankCode: '',
    type: 'internal',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/beneficiaries');
      const data = await res.json();
      setBeneficiaries(data?.beneficiaries ?? []);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/beneficiaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to add beneficiary');
        return;
      }

      setShowForm(false);
      setFormData({
        name: '',
        accountNumber: '',
        bankName: '',
        bankCode: '',
        type: 'internal',
      });
      fetchBeneficiaries();
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this beneficiary?')) return;

    try {
      await fetch(`/api/beneficiaries?id=${id}`, {
        method: 'DELETE',
      });
      fetchBeneficiaries();
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internal':
        return <Users className="text-primary" size={24} />;
      case 'external':
        return <Building2 className="text-accent" size={24} />;
      case 'international':
        return <Globe className="text-sage" size={24} />;
      default:
        return <Users className="text-primary" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Beneficiaries</h1>
          <p className="text-sage">Manage your saved transfer recipients</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Beneficiary
        </button>
      </div>

      {/* Add Beneficiary Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Add New Beneficiary</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiary Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="3001234567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Pact Bank"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Code (Optional)</label>
                <input
                  type="text"
                  value={formData.bankCode}
                  onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="044"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="internal">Internal (Pact Bank)</option>
                <option value="external">External (Other Banks)</option>
                <option value="international">International</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Add Beneficiary
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError('');
                  setFormData({ name: '', accountNumber: '', bankName: '', bankCode: '', type: 'internal' });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Beneficiaries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : beneficiaries?.length === 0 ? (
          <div className="text-center py-20">
            <Users className="mx-auto text-sage mb-4" size={48} />
            <p className="text-sage">No beneficiaries added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Add Your First Beneficiary
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {beneficiaries?.map((beneficiary) => (
              <div
                key={beneficiary?.id}
                className="p-4 bg-cream rounded-lg hover:bg-cream-warm transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(beneficiary?.type ?? 'internal')}
                    <div>
                      <p className="font-medium text-primary">{beneficiary?.name}</p>
                      <p className="text-xs text-sage capitalize">{beneficiary?.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(beneficiary?.id ?? '')}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label="Delete beneficiary"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="text-sage">Bank:</span> {beneficiary?.bankName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="text-sage">Account:</span> {beneficiary?.accountNumber}
                  </p>
                  {beneficiary?.bankCode && (
                    <p className="text-sm text-gray-700">
                      <span className="text-sage">Code:</span> {beneficiary?.bankCode}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
