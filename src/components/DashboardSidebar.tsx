'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  CubeIcon,
  UsersIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isAdmin, logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Inventory', href: '/inventory', icon: CubeIcon },
  ];

  const adminNavigation = [
    { name: 'Users', href: '/users', icon: UsersIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="w-64 bg-[#1a2332] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2a3441]">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
            <CubeIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Inventory</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#22c55e] text-white'
                  : 'text-gray-300 hover:bg-[#2a3441] hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-4 mt-4 border-t border-[#2a3441]">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin
              </p>
            </div>
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-1 ${
                    active
                      ? 'bg-[#22c55e] text-white'
                      : 'text-gray-300 hover:bg-[#2a3441] hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#2a3441]">
        <div className="flex items-center space-x-3 px-4 py-2 mb-2">
          <div className="h-8 w-8 bg-[#22c55e] rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
        <Link
          href="/profile"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/profile'
              ? 'bg-[#22c55e] text-white'
              : 'text-gray-300 hover:bg-[#2a3441] hover:text-white'
          }`}
        >
          <UserCircleIcon className="h-5 w-5" />
          <span>Profile</span>
        </Link>
        <button
          onClick={() => logout()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#2a3441] hover:text-white transition-colors mt-1"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

