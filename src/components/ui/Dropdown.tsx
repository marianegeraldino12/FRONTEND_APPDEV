import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

interface DropdownItem {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
}) => {
  const alignClasses = {
    left: 'origin-top-left left-0',
    right: 'origin-top-right right-0',
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {trigger}
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
        <Menu.Items
          className={`absolute ${alignClasses[align]} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => {
                  const baseClasses = `${
                    active ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm transition-colors`;
                  
                  const variantClasses = item.variant === 'danger' 
                    ? 'text-red-700 hover:bg-red-50' 
                    : 'text-gray-700';

                  if (item.href) {
                    return (
                      <a
                        href={item.href}
                        className={`${baseClasses} ${variantClasses} flex items-center`}
                      >
                        {item.icon && <span className="mr-3">{item.icon}</span>}
                        {item.label}
                      </a>
                    );
                  }

                  return (
                    <button
                      onClick={item.onClick}
                      className={`${baseClasses} ${variantClasses} w-full text-left flex items-center`}
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
  );
};

