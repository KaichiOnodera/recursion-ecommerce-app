import React, { useState } from 'react';
import { updateProfile } from '../../services/api/users';
import { useUser } from '../../contexts/UserContext';
import type { PatchReq, PatchRes } from '@shared/types/patches';

export interface UserProfileFormProps {
  profileInput: PatchReq['/users/profile'];
  onSuccess?: () => void;
  className?: string;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  profileInput,
  onSuccess,
  className = '',
}) => {
  const [profileform, setProfileForm] =
    useState<PatchReq['/users/profile']>(profileInput);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();

  const updateLastName = (value: string): void => {
    setProfileForm((prev) => ({ ...prev, lastName: value }));
  };

  const updateFirstName = (value: string): void => {
    setProfileForm((prev) => ({ ...prev, firstName: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result: PatchRes['/users/profile'] =
        await updateProfile(profileform);

      setUser({
        ...user,
        lastName: result.user.lastName,
        firstName: result.user.firstName,
        email: result.user.email,
      });

      setMessage('プロフィールを更新しました');
      onSuccess?.();
    } catch (err: any) {
      setMessage(err.message ?? '更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            姓
          </label>
          <input
            name="lastName"
            value={profileform.lastName}
            onChange={(e) => updateLastName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名
          </label>
          <input
            name="firstName"
            value={profileform.firstName}
            onChange={(e) => updateFirstName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? '更新中…' : '更新する'}
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>
    </form>
  );
};
