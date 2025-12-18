import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  exact = false,
  className = '',
}) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname?.startsWith(href);

  const baseClasses = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
  const activeClasses = isActive
    ? 'bg-indigo-600 text-white'
    : 'text-gray-300 hover:bg-gray-700 hover:text-white';

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses} ${className}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
};

