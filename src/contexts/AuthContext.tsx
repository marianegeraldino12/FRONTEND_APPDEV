'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api';
import { toast } from 'react-toastify';

interface User {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
  roles?: any[];
  roles_array?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getUser();

        if (response.data?.status && response.data?.data) {
          setUser(response.data.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });

      // Backend returns { status: true, message: '...', data: { user: {...} } }
      if (response.data && response.data.status) {
        const responseData = response.data.data;
        const user = responseData?.user;

        if (user) {
          try {
            const me = await authService.getUser();
            setUser(me.data?.data || user);
          } catch {
            setUser(user);
          }

          toast.success(response.data.message || 'Login successful');
          router.push('/dashboard');
        } else {
          throw new Error('Invalid response format from server');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle network errors
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Cannot connect to server. Please check if the backend is running.');
        throw error;
      }

      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        toast.error(validationErrors.join(', '));
      } else if (error.response?.status === 401) {
        // Invalid credentials
        const errorMessage = error.response?.data?.message || 'Invalid email or password';
        toast.error(errorMessage);
      } else if (error.response?.status === 403) {
        // Account restricted
        const errorMessage = error.response?.data?.message || 'Your account is restricted';
        toast.error(errorMessage);
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      setLoading(true);
      const response = await authService.register({ name, email, password, password_confirmation });

      // Backend returns { status: true, message: '...', data: { user: {...} } }
      if (response.data && response.data.status) {
        const responseData = response.data.data;
        const user = responseData?.user;

        if (user) {
          setUser(user);
          toast.success(response.data.message || 'Registration successful');
          router.push('/dashboard');
        } else {
          throw new Error('Invalid response format from server');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        toast.error(validationErrors.join(', '));
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        toast.error(errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      // The current backend API does not expose a /user/profile update route.
      // Avoid calling a non-existent endpoint and explain to the user.
      toast.error('Profile update is not available in this version of the API.');
    } finally {
      // no-op
    }
  };

  const changePassword = async (data: any) => {
    try {
      setLoading(true);
      await authService.changePassword(data);
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  // Check if user has admin role - Laravel uses Spatie Permission package
  // The backend returns roles_array with role names
  const isAdmin = user && (
    (Array.isArray(user.roles_array) && user.roles_array.includes('admin')) ||
    (Array.isArray(user.roles) && user.roles.some((role: any) =>
      (typeof role === 'string' && role === 'admin') ||
      (typeof role === 'object' && role?.name === 'admin')
    ))
  ) || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
