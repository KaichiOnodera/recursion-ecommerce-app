import React, { useMemo } from 'react';
import { UserProfileForm } from '../../components/auth/UserProfileForm';
import { useUser } from '../../contexts/UserContext';
import type { PatchReq } from '@shared/types/patches';

export const User: React.FC = () => {
  const { user } = useUser();

  const initialProfile: PatchReq['/users/profile'] = useMemo(
    () => ({
      lastName: user?.lastName ?? '',
      firstName: user?.firstName ?? '',
      email: user?.email ?? '',
    }),
    [user],
  );

  const handleSuccess = () => {
    console.log('プロフィール更新成功');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          プロフィール編集
        </h1>

        <UserProfileForm
          profileInput={initialProfile}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};
