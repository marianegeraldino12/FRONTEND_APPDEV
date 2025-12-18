'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Avatar } from '@/components/ui/Avatar';
import { CameraIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword, watch: watchPassword } = useForm();

  const { ref: profileImageRef, ...profileImageInputProps } = register('profile_image');
  
  const newPassword = watchPassword('new_password');
  const profileImage = watch('profile_image');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email
      });
      // Set profile image preview if user has one
      if (user.profile_image) {
        setProfileImagePreview(
          `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.profile_image}`
        );
      }
    }
  }, [user, reset]);

  // Handle profile image preview
  useEffect(() => {
    if (profileImage && profileImage.length > 0) {
      const file = profileImage[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [profileImage]);

  const onSubmitProfile = async (data: any) => {
    setLoading(true);
    try {
      // Create FormData if profile image is being uploaded
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      
      if (data.profile_image && data.profile_image.length > 0) {
        formData.append('profile_image', data.profile_image[0]);
      }
      
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      // Error is already handled in AuthContext with toast
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmitPassword = async (data: any) => {
    if (!data.current_password) {
      toast.error('Current password is required');
      return;
    }

    if (!data.new_password || data.new_password.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (data.new_password !== data.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({
        current_password: data.current_password,
        password: data.new_password,
        password_confirmation: data.confirm_password
      });
      resetPassword();
    } catch (error: any) {
      console.error('Error changing password:', error);
      // Error is already handled in AuthContext with toast
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return <Loading text="Loading profile..." />;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <BackButton href="/dashboard" label="Back to Dashboard" className="mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`${
                  activeTab === 'password'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Change Password
              </button>
            </nav>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="mt-8">
              <Card>
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Update your account profile information and email address.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit(onSubmitProfile)}>
                      <div className="space-y-6">
                        <div>
                          <Input
                            id="name"
                            type="text"
                            label="Full Name"
                            {...register('name', { required: 'Name is required' })}
                            error={errors.name?.message as string}
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <Input
                            id="email"
                            type="email"
                            label="Email Address"
                            {...register('email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            error={errors.email?.message as string}
                            placeholder="Enter your email address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Picture
                          </label>
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <Avatar
                                name={user.name}
                                imageUrl={profileImagePreview || undefined}
                                size="xl"
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                              />
                              <button
                                type="button"
                                onClick={handleImageClick}
                                className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                title="Change profile picture"
                              >
                                <CameraIcon className="h-4 w-4" />
                              </button>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                className="hidden"
                                {...profileImageInputProps}
                                ref={(el) => {
                                  profileImageRef(el);
                                  fileInputRef.current = el;
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-1">
                                Click the camera icon to change your profile picture
                              </p>
                              <p className="text-xs text-gray-500">
                                Supported formats: JPEG, PNG, JPG, GIF (Max 2MB)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={loading}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Password Tab Content */}
          {activeTab === 'password' && (
            <div className="mt-8">
              <Card>
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Update your password to keep your account secure. Use a strong password with at least 8 characters.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
                      <div className="space-y-6">
                        <div>
                          <Input
                            id="current_password"
                            type="password"
                            label="Current Password"
                            {...registerPassword('current_password', { required: 'Current password is required' })}
                            error={passwordErrors.current_password?.message as string}
                            placeholder="Enter your current password"
                          />
                        </div>

                        <div>
                          <Input
                            id="new_password"
                            type="password"
                            label="New Password"
                            {...registerPassword('new_password', { 
                              required: 'New password is required',
                              minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                              }
                            })}
                            error={passwordErrors.new_password?.message as string}
                            placeholder="Enter your new password"
                            helperText="Must be at least 8 characters long"
                          />
                        </div>

                        <div>
                          <Input
                            id="confirm_password"
                            type="password"
                            label="Confirm New Password"
                            {...registerPassword('confirm_password', { 
                              required: 'Please confirm your password',
                              validate: (value) => value === newPassword || 'Passwords do not match'
                            })}
                            error={passwordErrors.confirm_password?.message as string}
                            placeholder="Confirm your new password"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={passwordLoading}
                        >
                          Change Password
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
