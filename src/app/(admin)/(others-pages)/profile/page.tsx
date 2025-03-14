'use client';
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PageMetadata from '@/components/common/PageMetadata';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="px-5 pt-5 pb-20 lg:pt-6 lg:pb-20 2xl:pt-10 2xl:pb-20">
      <PageMetadata title="Profile | Belfast Backoffice" description="User profile page" />
      <div className="mb-6 lg:mb-8">
        <h4 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">Profile</h4>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Manage your personal information and preferences
        </p>
      </div>
    </div>
  );
}
