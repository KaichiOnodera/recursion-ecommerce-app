import React, { useState } from 'react';
import { login } from '../../services/api/auth';
import { signup } from '../../services/api/users';
import { useNavigate, Link } from 'react-router';
import { useUser } from '../../contexts/UserContext';
import {
  LockClosedIcon,
  UserPlusIcon,
  EnvelopeIcon,
  KeyIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface AuthFormProps {
  mode: 'login' | 'signup';
  userType: 'admin' | 'user';
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  userType,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        const response = await login({ email, password });

        if (response.user) {
          setUser({
            id: response.user.id,
            lastName: response.user.lastName,
            firstName: response.user.firstName,
            email: response.user.email,
            role: response.user.role,
          });
        }

        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
      } else if (mode === 'signup') {
        const response = await signup({
          lastName,
          firstName,
          email,
          password,
        });

        if (response.user) {
          setUser({
            id: response.user.id,
            lastName: response.user.lastName,
            firstName: response.user.firstName,
            email: response.user.email,
            role: response.user.role,
          });
        }

        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      // axiosのエラーレスポンスからメッセージを取得
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        (mode === 'login' ? 'Login failed' : 'Signup failed');
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-md mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 rounded-full p-3">
            {mode === 'login' ? (
              <LockClosedIcon className="w-8 h-8 text-blue-600" />
            ) : (
              <UserPlusIcon className="w-8 h-8 text-blue-600" />
            )}
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {userType === 'admin' && '管理者'}
          {mode === 'login' ? 'ログイン' : 'アカウント作成'}
        </h2>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* サインアップ時のみ表示 */}
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={lastName}
                  className="block w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                名前
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={firstName}
                  className="block w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* メールアドレス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              className="block w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* パスワード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              className="block w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium rounded-lg py-3 px-4 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {mode === 'login' ? 'ログイン' : 'アカウント作成'}
        </button>
      </form>

      {/* 登録/ログインへのリンク */}
      <div className="mt-6 text-center">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない方は{' '}
            <Link
              to={
                userType === 'admin'
                  ? '/auth/admin/signup'
                  : '/auth/user/signup'
              }
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline underline-offset-2"
            >
              こちらから登録
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちの方は{' '}
            <Link
              to={
                userType === 'admin' ? '/auth/admin/login' : '/auth/user/login'
              }
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline underline-offset-2"
            >
              こちらからログイン
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
