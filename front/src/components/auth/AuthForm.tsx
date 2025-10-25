import React, { useState } from 'react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  userType: 'admin' | 'user';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, userType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-gray-slate p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-center">
        {userType === 'admin' ? '管理者' : 'ユーザー'}
        {mode === 'login' ? 'ログイン' : 'サインアップ'}
      </h2>

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
              ></input>
            </div>
            <div>
              <label className="block">名前</label>
              <input
                type="text"
                value={firstName}
                className="block px-2 py-1"
                onChange={(e) => setFirstName(e.target.value)}
                required
              ></input>
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
          ></input>
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
          ></input>
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
