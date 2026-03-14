'use client';

import { useSession, signOut } from 'next-auth/react';
import { Menu, Bell, User, LogOut, Settings, Building2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession() || {};
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isCorporate = session?.user?.accountType === 'corporate';

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="text-primary" size={24} />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading font-bold text-primary">
              PACT
            </h1>
            {isCorporate && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                <Building2 size={12} />
                Corporate
              </span>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="text-sage" size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCorporate ? 'bg-accent' : 'bg-primary'
              }`}>
                {isCorporate ? (
                  <Building2 className="text-primary" size={16} />
                ) : (
                  <User className="text-white" size={16} />
                )}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-sm font-medium text-gray-700 block leading-tight">
                  {session?.user?.name || 'User'}
                </span>
                {isCorporate && (
                  <span className="text-xs text-sage leading-tight block">
                    {session?.user?.businessName || 'Business'}
                  </span>
                )}
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="text-sage" />
                    <span className="text-sm text-gray-700">Profile</span>
                  </Link>
                  <Link
                    href="/security"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} className="text-sage" />
                    <span className="text-sm text-gray-700">Security</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <LogOut size={16} className="text-red-600" />
                    <span className="text-sm text-red-600">Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
