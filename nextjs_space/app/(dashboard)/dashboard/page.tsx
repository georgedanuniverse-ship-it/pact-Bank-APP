'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  CreditCard,
  Plus,
  TrendingUp,
  Eye,
  EyeOff,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import SpendingChart from '@/app/components/charts/spending-chart';
import BalanceChart from '@/app/components/charts/balance-chart';

export default function DashboardPage() {
  const { data: session } = useSession() || {};
  const [accounts, setAccounts] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [accountsRes, transactionsRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/transactions?limit=10'),
      ]);

      const accountsData = await accountsRes.json();
      const transactionsData = await transactionsRes.json();

      setAccounts(accountsData?.accounts ?? []);
      setRecentTransactions(transactionsData?.transactions ?? []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts?.reduce((sum, acc) => {
    if (acc?.currency === 'USD') {
      return sum + (acc?.balance ?? 0);
    }
    return sum;
  }, 0) ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">
          Welcome back, {session?.user?.name?.split(' ')?.[0] ?? 'User'}!
        </h1>
        <p className="text-sage">Here's your financial overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-sage">Total Balance</p>
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {hideBalances ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-2xl font-heading font-bold text-primary">
            {hideBalances ? '••••••' : formatCurrency(totalBalance, 'USD')}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="text-green-600" size={20} />
            <p className="text-sm text-sage">Total Credits</p>
          </div>
          <p className="text-2xl font-heading font-bold text-green-600">
            {recentTransactions?.filter((t) => t?.type === 'credit')?.length ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft className="text-red-600" size={20} />
            <p className="text-sm text-sage">Total Debits</p>
          </div>
          <p className="text-2xl font-heading font-bold text-red-600">
            {recentTransactions?.filter((t) => t?.type === 'debit')?.length ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-accent" size={20} />
            <p className="text-sm text-sage">Active Accounts</p>
          </div>
          <p className="text-2xl font-heading font-bold text-primary">
            {accounts?.filter((a) => a?.status === 'active')?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/transfers"
            className="flex flex-col items-center gap-2 p-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors group"
          >
            <Send size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Transfer</span>
          </Link>
          <Link
            href="/bill-payments"
            className="flex flex-col items-center gap-2 p-4 bg-accent hover:bg-accent-dark text-primary rounded-lg transition-colors group"
          >
            <CreditCard size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Pay Bills</span>
          </Link>
          <Link
            href="/beneficiaries"
            className="flex flex-col items-center gap-2 p-4 bg-sage hover:bg-sage-light text-white rounded-lg transition-colors group"
          >
            <Plus size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add Beneficiary</span>
          </Link>
          <Link
            href="/transactions"
            className="flex flex-col items-center gap-2 p-4 bg-cream-warm hover:bg-gray-200 text-primary border border-gray-300 rounded-lg transition-colors group"
          >
            <ArrowUpRight size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">View All</span>
          </Link>
        </div>
      </div>

      {/* Accounts Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-primary mb-4">Your Accounts</h2>
        <div className="space-y-3">
          {accounts?.length === 0 ? (
            <p className="text-sage text-center py-4">No accounts found</p>
          ) : (
            accounts?.map((account) => (
              <div
                key={account?.id}
                className="flex items-center justify-between p-4 bg-cream rounded-lg hover:bg-cream-warm transition-colors"
              >
                <div>
                  <p className="font-medium text-primary">{account?.accountType}</p>
                  <p className="text-sm text-sage">•••• {account?.accountNumber?.slice(-4)}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-semibold text-primary">
                    {hideBalances ? '••••••' : formatCurrency(account?.balance ?? 0, account?.currency ?? 'USD')}
                  </p>
                  <p className="text-xs text-sage">{account?.currency}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Spending by Category</h2>
          <SpendingChart transactions={recentTransactions} />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading font-semibold text-primary mb-4">Balance Trend</h2>
          <BalanceChart transactions={recentTransactions} initialBalance={totalBalance} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-primary">Recent Transactions</h2>
          <Link href="/transactions" className="text-sm text-accent hover:text-accent-dark font-medium">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recentTransactions?.length === 0 ? (
            <p className="text-sage text-center py-4">No transactions found</p>
          ) : (
            recentTransactions?.slice(0, 5)?.map((transaction) => (
              <div
                key={transaction?.id}
                className="flex items-center justify-between p-4 bg-cream rounded-lg hover:bg-cream-warm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction?.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {transaction?.type === 'credit' ? (
                      <ArrowDownLeft className="text-green-600" size={20} />
                    ) : (
                      <ArrowUpRight className="text-red-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{transaction?.description}</p>
                    <p className="text-sm text-sage">{formatDate(transaction?.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-heading font-semibold ${
                      transaction?.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction?.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction?.amount ?? 0, transaction?.currency ?? 'USD')}
                  </p>
                  <p className="text-xs text-sage capitalize">{transaction?.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
