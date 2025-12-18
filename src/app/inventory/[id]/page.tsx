'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { itemService } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { BackButton } from '@/components/ui/BackButton';

export default function ItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setLoading(true);
        const itemResponse = await itemService.getById(parseInt(id, 10));
        const itemData = itemResponse.data.data || itemResponse.data;
        setItem(itemData);
      } catch (error: any) {
        console.error('Error fetching item data:', error);
        toast.error(error.response?.data?.message || 'Failed to load item data');
        router.push('/inventory');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItemData();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full"
            role="status"
          />
          <p className="mt-2">Loading item data...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-900">Item not found</h2>
        <p className="mt-2 text-gray-600">
          The item you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission
          to view it.
        </p>
        <BackButton href="/inventory" className="mt-4 inline-flex" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton href="/inventory" className="mb-4" />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{item.name}</h1>
          <div className="flex space-x-3">
            {isAdmin && (
              <button
                onClick={() => router.push(`/inventory/edit/${item.id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Item
              </button>
            )}
          </div>
        </div>

        {/* Item Details */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Item Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details and information about the item.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {item.type || 'N/A'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Current Stock</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.quantity > 10
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {item.quantity} units
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {item.updated_at ? new Date(item.updated_at).toLocaleString() : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
