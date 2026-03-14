'use client';

import { useEffect, useState } from 'react';
import { Shield, Lock, Bell, Clock, History, Save } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function SecurityPage() {
  const [settings, setSettings] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, logsRes] = await Promise.all([
        fetch('/api/security'),
        fetch('/api/activity-logs'),
      ]);

      const settingsData = await settingsRes.json();
      const logsData = await logsRes.json();

      setSettings(settingsData?.settings ?? null);
      setActivityLogs(logsData?.logs ?? []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error || 'Failed to update settings');
      } else {
        setMessage('Security settings updated successfully!');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword?.length < 8) {
      setPasswordMessage('Password must be at least 8 characters');
      return;
    }

    try {
      const res = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordMessage(data?.error || 'Failed to change password');
      } else {
        setPasswordMessage('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordChange(false);
        fetchData();
      }
    } catch (error) {
      setPasswordMessage('An error occurred. Please try again.');
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Security Settings</h1>
        <p className="text-sage">Manage your account security and preferences</p>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4 flex items-center gap-2">
          <Shield size={20} />
          Security Preferences
        </h2>
        <form onSubmit={handleSettingsUpdate} className="space-y-4">
          {message && (
            <div className={`px-4 py-3 rounded ${message?.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-cream rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-primary">Two-Factor Authentication</p>
                <p className="text-sm text-sage">Add an extra layer of security to your account (Demo)</p>
              </div>
              <input
                type="checkbox"
                checked={settings?.twoFactorEnabled ?? false}
                onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-cream rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-primary">Login Notifications</p>
                <p className="text-sm text-sage">Get notified of new login attempts</p>
              </div>
              <input
                type="checkbox"
                checked={settings?.loginNotifications ?? false}
                onChange={(e) => setSettings({ ...settings, loginNotifications: e.target.checked })}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-cream rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-primary">Transaction Alerts</p>
                <p className="text-sm text-sage">Receive alerts for all transactions</p>
              </div>
              <input
                type="checkbox"
                checked={settings?.transactionAlerts ?? false}
                onChange={(e) => setSettings({ ...settings, transactionAlerts: e.target.checked })}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </label>

            <div className="p-4 bg-cream rounded-lg">
              <label className="block mb-2">
                <p className="font-medium text-primary mb-1">Session Timeout</p>
                <p className="text-sm text-sage mb-2">Automatically log out after inactivity</p>
              </label>
              <select
                value={settings?.sessionTimeout ?? 30}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4 flex items-center gap-2">
          <Lock size={20} />
          Change Password
        </h2>
        {!showPasswordChange ? (
          <button
            onClick={() => setShowPasswordChange(true)}
            className="px-6 py-2 bg-accent text-primary rounded-lg font-medium hover:bg-accent-dark transition-colors"
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordMessage && (
              <div className={`px-4 py-3 rounded ${passwordMessage?.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {passwordMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordMessage('');
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4 flex items-center gap-2">
          <History size={20} />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {activityLogs?.length === 0 ? (
            <p className="text-sage text-center py-4">No recent activity</p>
          ) : (
            activityLogs?.map((log) => (
              <div key={log?.id} className="flex items-start justify-between p-4 bg-cream rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-primary capitalize">{log?.action?.replace('_', ' ')}</p>
                  <p className="text-sm text-sage">{log?.description}</p>
                  <div className="flex gap-4 mt-1 text-xs text-sage">
                    {log?.device && <span>💻 {log?.device}</span>}
                    {log?.location && <span>📍 {log?.location}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sage">{formatDateTime(log?.createdAt)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${log?.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {log?.status}
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
