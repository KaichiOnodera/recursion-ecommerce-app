import React, { useState } from 'react';
import { AuthApiService } from '../../services/api/auth';
import { useNavigate } from 'react-router';
import { useUser } from '../../contexts/UserContext';

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
        const response = await AuthApiService.login({ email, password });

        if (response.user) {
          setUser({
            id: response.user.id,
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
        err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-gray-slate p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-center">
        {userType === 'admin' ? '管理者' : 'ユーザー'}
        {mode === 'login' ? 'ログイン' : 'サインアップ'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* サインアップ時のみ表示 */}
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block">姓</label>
              <input
                type="text"
                value={lastName}
                className="block px-2 py-1"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block">名前</label>
              <input
                type="text"
                value={firstName}
                className="block px-2 py-1"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* メールアドレス */}
        <div>
          <label> メールアドレス</label>
          <input
            type="email"
            value={email}
            className="block px-3 py-1"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* パスワード */}
        <div>
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            className="block px-3 py-1"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="bg-black rounded-md text-white py-3 px-4"
        >
          {mode === 'login' ? 'ログイン' : 'サインアップ'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
