'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { itemService } from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Loading } from '@/components/ui/Loading';
import { BackButton } from '@/components/ui/BackButton';

export default function Inventory() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    quantity: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadItems();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadItems = async () => {
    try {
      setLoadingItems(true);
      const itemsResponse = await itemService.getUserItems();
      const itemsData = itemsResponse.data.data || itemsResponse.data || [];
      setItems(itemsData);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoadingItems(false);
    }
  };

  const resetNewItem = () => {
    setNewItem({
      name: '',
      type: '',
      quantity: 1,
    });
  };

  const openAddModal = () => {
    resetNewItem();
    setShowAddModal(true);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Only admins can add items.');
      return;
    }
    if (!newItem.name.trim() || !newItem.type.trim()) {
      toast.error('Name and Type are required.');
      return;
    }
    if (newItem.quantity < 1) {
      toast.error('Quantity must be at least 1.');
      return;
    }

    try {
      setAdding(true);

      const payload = {
        name: newItem.name.trim(),
        type: newItem.type.trim(),
        quantity: newItem.quantity,
      };

      const response = await itemService.createItem(payload);
      toast.success(response.data.message || 'Item added successfully');

      resetNewItem();
      setShowAddModal(false);

      await loadItems();
    } catch (error: any) {
      console.error('Error adding item:', error);
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(', ')
          : 'Failed to add item');
      toast.error(errorMessage);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id);
        setItems(items.filter((item: any) => item.id !== id));
        toast.success('Item deleted successfully');
      } catch (error: any) {
        console.error('Error deleting item:', error);
        toast.error(error.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  const visibleItems = isAdmin
    ? items
    : items.filter((item) => Number(item.quantity) > 0);

  const filteredItems = visibleItems.filter((item) => {
    const matchesType = selectedType === 'all' || (item.type || '').toString() === selectedType;
    const lowerName = (item.name || '').toLowerCase();
    const matchesSearch = lowerName.includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const uniqueTypes = Array.from(
    new Set(items.map((item) => (item.type || '').toString()).filter(Boolean))
  );

  if (loading) {
    return <Loading text="Loading inventory data..." />;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton href="/dashboard" className="mb-4" />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Item
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Filter by Type
            </label>
            <select
              id="type"
              name="type"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-2/3">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Items
            </label>
            <input
              type="text"
              name="search"
              id="search"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingItems ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading items...
                        </td>
                      </tr>
                    ) : filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.type || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/inventory/${item.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                              View
                            </Link>
                            {isAdmin && (
                              <>
                                <Link href={`/inventory/edit/${item.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                  Edit
                                </Link>
                                <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900">
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No items found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* --- FIXED ADD ITEM MODAL SECTION --- */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

              {/* Backdrop - Added z-[-1] to keep it behind the form */}
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[-1]"
                aria-hidden="true"
                onClick={() => !adding && setShowAddModal(false)}
              ></div>

              {/* Centering spacer */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              {/* Modal Content - Added relative z-50 to stay on top */}
              <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200">
                <form onSubmit={handleAddItem}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Add New Item
                        </h3>
                        <div className="mt-2 space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              required
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                              Type
                            </label>
                            <input
                              type="text"
                              name="type"
                              id="type"
                              required
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                              value={newItem.type}
                              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                            />
                          </div>
                          <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                              Quantity
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              id="quantity"
                              min={1}
                              required
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                              value={newItem.quantity}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewItem({
                                  ...newItem,
                                  quantity: val === '' ? 0 : parseInt(val, 10),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button
                      type="submit"
                      disabled={adding}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:opacity-60"
                    >
                      {adding ? 'Adding...' : 'Add Item'}
                    </button>
                    <button
                      type="button"
                      disabled={adding}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-60"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}