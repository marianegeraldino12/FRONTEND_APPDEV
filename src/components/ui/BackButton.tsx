'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  href?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'text' | 'button';
}

export const BackButton: React.FC<BackButtonProps> = ({
  href,
  label = 'Back',
  onClick,
  className = '',
  variant = 'text',
}) => {
  const router = useRouter();

  const handleClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  // Text variant (default) - simple link style
  if (variant === 'text') {
    if (href && !onClick) {
      return (
        <Link
          href={href}
          className={`inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors group ${className}`}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {label}
        </Link>
      );
    }

    return (
      <button
        onClick={handleClick}
        type="button"
        className={`inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md group ${className}`}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        {label}
      </button>
    );
  }

  // Button variant - styled as a button
  const buttonClasses = `inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all group ${className}`;

  if (href && !onClick) {
    return (
      <Link href={href} className={buttonClasses}>
        <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className={buttonClasses}
    >
      <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
      {label}
    </button>
  );
};
