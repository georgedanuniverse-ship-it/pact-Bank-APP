'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Users,
  CreditCard,
  FileText,
  User,
  Shield,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Transfers', href: '/transfers', icon: ArrowLeftRight },
  { name: 'Bill Payments', href: '/bill-payments', icon: CreditCard },
  { name: 'Beneficiaries', href: '/beneficiaries', icon: Users },
  { name: 'Statements', href: '/statements', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Security', href: '/security', icon: Shield },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen bg-primary text-white w-64 z-50 transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-light">
          <div>
            <h2 className="text-2xl font-heading font-bold">PACT</h2>
            <div className="w-12 h-0.5 bg-accent mt-1"></div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-primary-light rounded transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-accent text-primary font-medium shadow-md'
                        : 'hover:bg-primary-light text-gray-200 hover:text-white'
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-primary-light">
          <p className="text-xs text-gray-300">
            © 2026 Pact Bank
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Africa's Global Rise
          </p>
        </div>
      </aside>
    </>
  );
}
