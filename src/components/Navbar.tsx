'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { NavLink } from '@/components/ui/NavLink';
import {
  HomeIcon,
  CubeIcon,
  ArrowPathIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  TagIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Inventory', href: '/inventory', icon: CubeIcon },
  ];

  const adminNavigation = [
    { name: 'Users', href: '/users', icon: UsersIcon },
  ];

  const userMenuItems = [
    {
      label: 'Your Profile',
      href: '/profile',
      icon: <UserCircleIcon className="h-5 w-5" />,
    },
    {
      label: 'Sign out',
      onClick: () => logout(),
      icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />,
      variant: 'danger' as const,
    },
  ];

  return (
    <Disclosure as="nav" className="bg-gray-800 shadow-lg">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Main Navigation */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <CubeIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-xl">Inventory System</span>
                  </Link>
                </div>
                {isAuthenticated && (
                  <div className="hidden md:block ml-10">
                    <div className="flex items-baseline space-x-1">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-1"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </NavLink>
                        );
                      })}
                      {isAdmin && adminNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-1"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Auth Buttons or User Menu */}
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {isAuthenticated ? (
                    <>
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500">
                            <span className="sr-only">Open user menu</span>
                            <div className="flex items-center space-x-3">
                              <div className="hidden lg:block text-right">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-gray-400">{user?.email}</p>
                              </div>
                              <Avatar
                                name={user?.name || 'User'}
                                imageUrl={user?.profile_image ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.profile_image}` : undefined}
                                size="md"
                              />
                            </div>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                            <div className="py-1">
                              {userMenuItems.map((item, index) => (
                                <Menu.Item key={index}>
                                  {({ active }) => {
                                    const baseClasses = `${active ? 'bg-gray-100' : ''
                                      } flex items-center px-4 py-2 text-sm transition-colors`;

                                    const variantClasses = item.variant === 'danger'
                                      ? 'text-danger-700 hover:bg-danger-50'
                                      : 'text-gray-700';

                                    if (item.href) {
                                      return (
                                        <Link
                                          href={item.href}
                                          className={`${baseClasses} ${variantClasses}`}
                                        >
                                          {item.icon && <span className="mr-3">{item.icon}</span>}
                                          {item.label}
                                        </Link>
                                      );
                                    }

                                    return (
                                      <button
                                        onClick={item.onClick}
                                        className={`${baseClasses} ${variantClasses} w-full text-left`}
                                      >
                                        {item.icon && <span className="mr-3">{item.icon}</span>}
                                        {item.label}
                                      </button>
                                    );
                                  }}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Button
                        as="a"
                        href="/login"
                        variant="secondary"
                        size="sm"
                        className="!bg-gray-700 !text-white hover:!bg-gray-600"
                      >
                        Login
                      </Button>
                      <Button
                        as="a"
                        href="/register"
                        variant="primary"
                        size="sm"
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                {isAuthenticated ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                      <Avatar
                        name={user?.name || 'User'}
                        imageUrl={user?.profile_image ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.profile_image}` : undefined}
                        size="sm"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div className="py-1">
                          {userMenuItems.map((item, index) => (
                            <Menu.Item key={index}>
                              {({ active }) => {
                                const baseClasses = `${active ? 'bg-gray-100' : ''
                                  } flex items-center px-4 py-2 text-sm transition-colors`;

                                const variantClasses = item.variant === 'danger'
                                  ? 'text-danger-700 hover:bg-danger-50'
                                  : 'text-gray-700';

                                if (item.href) {
                                  return (
                                    <Link
                                      href={item.href}
                                      className={`${baseClasses} ${variantClasses}`}
                                    >
                                      {item.icon && <span className="mr-3">{item.icon}</span>}
                                      {item.label}
                                    </Link>
                                  );
                                }

                                return (
                                  <button
                                    onClick={item.onClick}
                                    className={`${baseClasses} ${variantClasses} w-full text-left`}
                                  >
                                    {item.icon && <span className="mr-3">{item.icon}</span>}
                                    {item.label}
                                  </button>
                                );
                              }}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      as="a"
                      href="/login"
                      variant="secondary"
                      size="sm"
                      className="!bg-gray-700 !text-white hover:!bg-gray-600"
                    >
                      Login
                    </Button>
                    <Button
                      as="a"
                      href="/register"
                      variant="primary"
                      size="sm"
                    >
                      Register
                    </Button>
                  </div>
                )}
                <Disclosure.Button className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700">
              {isAuthenticated && (
                <>
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          } flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  {isAdmin && adminNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          } flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
