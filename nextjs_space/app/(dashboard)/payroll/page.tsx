'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, Users, DollarSign, Calendar, Plus, Download, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Amara Okonkwo', role: 'Software Engineer', department: 'Engineering', salary: 8500, currency: 'USD', status: 'active' },
  { id: 2, name: 'Kwame Mensah', role: 'Product Manager', department: 'Product', salary: 9200, currency: 'USD', status: 'active' },
  { id: 3, name: 'Zainab Hassan', role: 'Financial Analyst', department: 'Finance', salary: 7800, currency: 'USD', status: 'active' },
  { id: 4, name: 'Thabo Nkosi', role: 'Marketing Lead', department: 'Marketing', salary: 7500, currency: 'USD', status: 'active' },
  { id: 5, name: 'Fatima Diallo', role: 'Operations Manager', department: 'Operations', salary: 8000, currency: 'USD', status: 'active' },
  { id: 6, name: 'Kofi Adu', role: 'UX Designer', department: 'Design', salary: 7200, currency: 'USD', status: 'on_leave' },
];

const PAYROLL_HISTORY = [
  { month: 'February 2026', totalPaid: 48200, employees: 6, status: 'completed', date: '2026-02-28' },
  { month: 'January 2026', totalPaid: 48200, employees: 6, status: 'completed', date: '2026-01-31' },
  { month: 'December 2025', totalPaid: 46500, employees: 6, status: 'completed', date: '2025-12-31' },
];

export default function PayrollPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (session?.user?.accountType !== 'corporate') {
      router.replace('/dashboard');
    }
  }, [session, router]);

  if (session?.user?.accountType !== 'corporate') return null;

  const totalMonthly = MOCK_EMPLOYEES.filter(e => e.status === 'active').reduce((sum, e) => sum + e.salary, 0);
  const filteredEmployees = MOCK_EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-1">Payroll Management</h1>
          <p className="text-sage">Manage employee salaries and payroll processing</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
          <Plus size={18} />
          Run Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-primary" size={20} />
            <p className="text-sm text-sage">Total Employees</p>
          </div>
          <p className="text-2xl font-heading font-bold text-primary">{MOCK_EMPLOYEES.length}</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-600" size={20} />
            <p className="text-sm text-sage">Monthly Payroll</p>
          </div>
          <p className="text-2xl font-heading font-bold text-green-600">{formatCurrency(totalMonthly, 'USD')}</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="text-accent" size={20} />
            <p className="text-sm text-sage">Active Employees</p>
          </div>
          <p className="text-2xl font-heading font-bold text-primary">{MOCK_EMPLOYEES.filter(e => e.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={20} />
            <p className="text-sm text-sage">Next Payroll</p>
          </div>
          <p className="text-lg font-heading font-bold text-primary">Mar 31, 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-heading font-semibold text-primary">Employees</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream">
                <th className="px-5 py-3 text-left text-xs font-medium text-sage uppercase tracking-wider">Employee</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-sage uppercase tracking-wider">Department</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-sage uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-sage uppercase tracking-wider">Salary</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-sage uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-primary">{emp.name}</td>
                  <td className="px-5 py-4 text-sm text-sage">{emp.department}</td>
                  <td className="px-5 py-4 text-sm text-sage">{emp.role}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-primary text-right">{formatCurrency(emp.salary, emp.currency)}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {emp.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-primary">Payroll History</h2>
          <button className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-dark font-medium">
            <Download size={16} />
            Export
          </button>
        </div>
        <div className="space-y-3">
          {PAYROLL_HISTORY.map((payroll, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-cream rounded-lg">
              <div>
                <p className="font-medium text-primary">{payroll.month}</p>
                <p className="text-sm text-sage">{payroll.employees} employees paid</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-semibold text-primary">{formatCurrency(payroll.totalPaid, 'USD')}</p>
                <span className="text-xs text-green-600 font-medium">Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
