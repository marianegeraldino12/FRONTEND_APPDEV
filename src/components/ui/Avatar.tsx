import React from 'react';

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  imageUrl,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${sizeClasses[size]} ${className} relative inline-flex items-center justify-center rounded-full bg-indigo-600 text-white font-medium ring-2 ring-white`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

