'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, Save } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data?.user ?? null);
      setFormData({
        firstName: data?.user?.firstName ?? '',
        lastName: data?.user?.lastName ?? '',
        phone: data?.user?.phone ?? '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error || 'Failed to update profile');
      } else {
        setMessage('Profile updated successfully!');
        fetchProfile();
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Profile</h1>
        <p className="text-sage">Manage your personal information</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <User className="text-white" size={40} />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-primary">{profile?.name}</h2>
            <p className="text-sage">{profile?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-cream rounded-lg">
          <div className="flex items-center gap-2">
            <Mail className="text-sage" size={20} />
            <div>
              <p className="text-xs text-sage">Email</p>
              <p className="text-sm font-medium text-primary">{profile?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-sage" size={20} />
            <div>
              <p className="text-xs text-sage">Phone</p>
              <p className="text-sm font-medium text-primary">{profile?.phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-sage" size={20} />
            <div>
              <p className="text-xs text-sage">Member Since</p>
              <p className="text-sm font-medium text-primary">{formatDate(profile?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className={`px-4 py-3 rounded ${message?.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+234-XXX-XXX-XXXX"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
