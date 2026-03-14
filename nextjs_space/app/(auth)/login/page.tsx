'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, User, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'personal' | 'corporate'>('personal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        router.replace('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { redirect: true, callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=1200&h=1200&fit=crop"
            alt="African business"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 p-12 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-5xl font-heading font-bold mb-4">PACT</h1>
            <div className="w-16 h-1 bg-accent mb-6"></div>
          </div>
          <div>
            <h2 className="text-4xl font-heading font-bold mb-4">
              Africa&apos;s Global Rise.
            </h2>
            <p className="text-lg text-gray-200 max-w-md">
              {accountType === 'personal'
                ? 'Connecting African entrepreneurs with global capital. Secure, transparent banking that bridges continents.'
                : 'Empowering African businesses with world-class corporate banking. Multi-currency accounts, trade finance, and seamless cross-border transactions.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          {/* Account Type Selector */}
          <div className="mb-8">
            <div className="flex bg-white rounded-xl border border-gray-200 p-1 mb-6">
              <button
                type="button"
                onClick={() => { setAccountType('personal'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  accountType === 'personal'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-sage hover:text-primary'
                }`}
              >
                <User size={18} />
                Personal
              </button>
              <button
                type="button"
                onClick={() => { setAccountType('corporate'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  accountType === 'corporate'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-sage hover:text-primary'
                }`}
              >
                <Building2 size={18} />
                Corporate
              </button>
            </div>

            <h2 className="text-3xl font-heading font-bold text-primary mb-2">
              {accountType === 'personal' ? 'Welcome Back' : 'Corporate Login'}
            </h2>
            <p className="text-sage">
              {accountType === 'personal'
                ? 'Sign in to your personal account'
                : 'Access your corporate banking dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {accountType === 'personal' ? 'Email Address' : 'Business Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sage" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={accountType === 'personal' ? 'you@example.com' : 'admin@company.com'}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sage" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage hover:text-primary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/reset-password" className="text-sm text-primary hover:text-primary-dark">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : (accountType === 'personal' ? 'Sign In' : 'Sign In to Corporate')}
            </button>

            {accountType === 'personal' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-cream text-sage">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>
              </>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href={accountType === 'corporate' ? '/signup?type=corporate' : '/signup'} className="text-primary font-medium hover:text-primary-dark">
              {accountType === 'corporate' ? 'Open Corporate Account' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
