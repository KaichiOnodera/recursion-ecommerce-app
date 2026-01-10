import React, { useMemo } from 'react';
import { Link } from 'react-router';
import { UserProfileForm } from '../../components/auth/UserProfileForm';
import { useUser } from '../../contexts/UserContext';
import type { PatchReq } from '@shared/types/patches';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const User: React.FC = () => {
  const { user } = useUser();

  const initialProfile: PatchReq['/users/profile'] = useMemo(
    () => ({
      lastName: user?.lastName ?? '',
      firstName: user?.firstName ?? '',
    }),
    [user],
  );

  const handleSuccess = () => {
    console.log('プロフィール更新成功');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/mypage"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">マイページに戻る</span>
        </Link>
        <h1 className="text-3xl font-bold">プロフィール編集</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <UserProfileForm
          profileInput={initialProfile}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};
