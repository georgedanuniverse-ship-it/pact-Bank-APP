'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Phone, Calendar, Save, Building2, Globe, MapPin, Hash, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session } = useSession() || {};
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    businessName: '',
    businessPhone: '',
    businessEmail: '',
    businessAddress: '',
    businessWebsite: '',
    taxId: '',
    registrationNumber: '',
    country: '',
    industry: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const isCorporate = session?.user?.accountType === 'corporate';

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
        businessName: data?.user?.businessName ?? '',
        businessPhone: data?.user?.businessPhone ?? '',
        businessEmail: data?.user?.businessEmail ?? '',
        businessAddress: data?.user?.businessAddress ?? '',
        businessWebsite: data?.user?.businessWebsite ?? '',
        taxId: data?.user?.taxId ?? '',
        registrationNumber: data?.user?.registrationNumber ?? '',
        country: data?.user?.country ?? '',
        industry: data?.user?.industry ?? '',
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
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">
          {isCorporate ? 'Business Profile' : 'Profile'}
        </h1>
        <p className="text-sage">
          {isCorporate ? 'Manage your business and admin information' : 'Manage your personal information'}
        </p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isCorporate ? 'bg-accent' : 'bg-primary'}`}>
            {isCorporate ? (
              <Building2 className="text-primary" size={40} />
            ) : (
              <User className="text-white" size={40} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-primary">
              {isCorporate ? profile?.businessName || profile?.name : profile?.name}
            </h2>
            <p className="text-sage">{profile?.email}</p>
            {isCorporate && profile?.industry && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Briefcase size={10} />
                {profile.industry}
              </span>
            )}
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
          {isCorporate && profile?.country && (
            <div className="flex items-center gap-2">
              <MapPin className="text-sage" size={20} />
              <div>
                <p className="text-xs text-sage">Country</p>
                <p className="text-sm font-medium text-primary">{profile.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Corporate: Business Details */}
      {isCorporate && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-cream rounded-lg">
            <div className="flex items-center gap-2">
              <Building2 className="text-sage" size={20} />
              <div>
                <p className="text-xs text-sage">Business Name</p>
                <p className="text-sm font-medium text-primary">{profile?.businessName || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="text-sage" size={20} />
              <div>
                <p className="text-xs text-sage">Website</p>
                <p className="text-sm font-medium text-primary">{profile?.businessWebsite || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-sage" size={20} />
              <div>
                <p className="text-xs text-sage">Business Phone</p>
                <p className="text-sm font-medium text-primary">{profile?.businessPhone || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-sage" size={20} />
              <div>
                <p className="text-xs text-sage">Business Email</p>
                <p className="text-sm font-medium text-primary">{profile?.businessEmail || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="text-sage" size={20} />
              <div>
                <p className="text-xs text-sage">Tax ID</p>
                <p className="text-sm font-medium text-primary">{profile?.taxId || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="text-sage" size={20} />
              <div>
                <p className="text-xs text-sage">Registration Number</p>
                <p className="text-sm font-medium text-primary">{profile?.registrationNumber || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">
          {isCorporate ? 'Edit Admin & Business Info' : 'Edit Profile'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className={`px-4 py-3 rounded ${message?.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isCorporate ? 'Admin First Name' : 'First Name'}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isCorporate ? 'Admin Last Name' : 'Last Name'}
              </label>
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

          {/* Corporate-specific fields */}
          {isCorporate && (
            <>
              <hr className="my-2" />
              <h3 className="text-md font-heading font-semibold text-primary">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                  <input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                  <input
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <input
                    type="text"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.businessWebsite}
                    onChange={(e) => setFormData({ ...formData, businessWebsite: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </>
          )}

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
