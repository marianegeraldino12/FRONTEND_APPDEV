'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { Loading } from '@/components/ui/Loading';
import { BackButton } from '@/components/ui/BackButton';

export default function Users() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        // Backend returns { status: true, data: [...] }
        const usersData = response.data.data || response.data || [];
        setUsers(usersData);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast.error(error.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, router]);

  const toggleUserRestriction = async (userId: number, isCurrentlyRestricted: boolean) => {
    try {
      const response = await userService.toggleUserRestriction(userId, 'toggle');
      
      // Backend returns { status: true, message: '...', data: {...} }
      const updatedUser = response.data.data || response.data;
      
      // Update local state
      setUsers(users.map((u: any) => 
        u.id === userId ? updatedUser : u
      ));
      
      toast.success(response.data.message || `User ${isCurrentlyRestricted ? 'unrestricted' : 'restricted'} successfully`);
    } catch (error: any) {
      console.error('Error toggling user restriction:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  if (loading) {
    return <Loading text="Loading users..." />;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton href="/dashboard" className="mb-4" />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {userItem.profile_image ? (
                                  <img 
                                    className="h-10 w-10 rounded-full" 
                                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${userItem.profile_image}`} 
                                    alt={userItem.name} 
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-lg font-medium text-gray-600">
                                      {userItem.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{userItem.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {userItem.roles?.some((role: any) => role.name === 'admin' || typeof role === 'string' && role === 'admin') ? 'Admin' : 'User'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              userItem.is_restricted 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {userItem.is_restricted ? 'Restricted' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* Don't allow admins to restrict themselves */}
                            {userItem.id !== user?.id && (
                              <button
                                onClick={() => toggleUserRestriction(userItem.id, userItem.is_restricted)}
                                className={`${
                                  userItem.is_restricted 
                                    ? 'text-green-600 hover:text-green-900' 
                                    : 'text-red-600 hover:text-red-900'
                                }`}
                              >
                                {userItem.is_restricted ? 'Unrestrict' : 'Restrict'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}