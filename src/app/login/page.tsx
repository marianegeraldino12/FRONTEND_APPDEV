'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      // Navigation will happen in AuthContext on success
    } catch (error: any) {
      // Error is already handled and displayed via toast in AuthContext
      // Just log for debugging
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f7f3] flex items-center justify-center p-8">
      {/* Centered Navy Blue Login Panel */}
      <div className="w-full max-w-md bg-[#1a2332] rounded-lg p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Sports Equipment Inventory
          </h1>
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">
            Sign in to your account
          </p>
        </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={`block w-full rounded-lg bg-gray-100 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-colors ${
                  errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`block w-full rounded-lg bg-gray-100 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-colors ${
                  errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message as string}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#1a2332] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-sm text-center">
              <Link href="/register" className="font-medium text-gray-300 hover:text-white transition-colors">
                Don&apos;t have an account? <span className="text-[#22c55e] hover:text-[#16a34a]">Register</span>
              </Link>
            </div>
          </form>
      </div>
    </div>
  );
}
