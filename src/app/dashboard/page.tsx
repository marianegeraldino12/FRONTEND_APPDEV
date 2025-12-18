'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { itemService, userService } from '@/lib/api';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Always try to load items for the current user
        // but gracefully handle 401 after logout.
        try {
          const itemsRes = await itemService.getUserItems();
          const items = itemsRes.data?.data || itemsRes.data || [];
          setTotalItems(items.length);
          setLowStockItems(items.filter((item: any) => item.quantity < 10));
        } catch (err: any) {
          if (err?.response?.status === 401) {
            // User is not authenticated (e.g. after logout);
            // leave dashboard in a minimal state and let the interceptor redirect.
            setTotalItems(0);
            setLowStockItems([]);
          } else {
            throw err;
          }
        }

        // Only attempt to load users for admins, and ignore 401/403 errors
        if (isAdmin) {
          try {
            const usersRes = await userService.getAllUsers();
            const users = usersRes.data?.data || usersRes.data || [];
            setTotalUsers(users.length);
          } catch (err: any) {
            console.error('Error fetching users for dashboard:', err);
            // If unauthorized/forbidden, just skip users count instead of breaking the page
            if (![401, 403].includes(err?.response?.status)) {
              // For other errors you might still want to know something went wrong
              // but do not throw to avoid crashing the dashboard
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  if (loading) {
    return <Loading text="Loading dashboard data..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Overview of your inventory system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-[#3b82f6] rounded-lg p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-600 truncate">Total Items</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-800">{totalItems}</div>
              </dd>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/inventory" className="text-sm font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors">
              View all items →
            </Link>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-[#fbbf24] rounded-lg p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-600 truncate">Low Stock Items</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-800">{lowStockItems.length}</div>
              </dd>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/inventory?filter=low-stock" className="text-sm font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors">
              View low stock items →
            </Link>
          </div>
        </Card>

        {isAdmin && (
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#22c55e] rounded-lg p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m8-4a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 truncate">Total Users</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-800">{totalUsers}</div>
                </dd>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/users" className="text-sm font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors">
                Manage users →
              </Link>
            </div>
          </Card>
        )}
      </div>

      {lowStockItems.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Items</h2>
          <Card padding="none">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockItems.map((item: any) => {
                    const getStatusBadge = (quantity: number) => {
                      if (quantity === 0) {
                        return (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        );
                      } else if (quantity < 5) {
                        return (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#fbbf24] text-yellow-900">
                            Warning
                          </span>
                        );
                      } else {
                        return (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#3b82f6] text-blue-900">
                            Low Stock
                          </span>
                        );
                      }
                    };

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{item.type || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-800">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item.quantity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/inventory/${item.id}`}
                            className="text-[#22c55e] hover:text-[#16a34a] transition-colors"
                          >
                            View details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}