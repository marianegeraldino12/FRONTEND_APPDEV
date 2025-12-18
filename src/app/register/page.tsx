'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function Register() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const password = watch('password', '');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, data.password_confirmation);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us today! Fill in your details to get started.
          </p>
        </div>
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name"
              type="text"
              label="Full Name"
              autoComplete="name"
              placeholder="Enter your full name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message as string}
            />
            
            <Input
              id="email"
              type="email"
              label="Email address"
              autoComplete="email"
              placeholder="Enter your email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message as string}
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              autoComplete="new-password"
              placeholder="Enter your password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message as string}
            />
            
            <Input
              id="password_confirmation"
              type="password"
              label="Confirm Password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              {...register('password_confirmation', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.password_confirmation?.message as string}
            />

            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                Create account
              </Button>
            </div>

            <div className="text-sm text-center">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}