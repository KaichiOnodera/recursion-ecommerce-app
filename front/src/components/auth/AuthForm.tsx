import React from 'react';
import react, { useState } from 'react';

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
    <div className="bg-white">
      <h2 className="text-center">
        {userType === 'admin' ? '管理者' : 'ユーザー'}
        {mode === 'login' ? 'ログイン' : 'サインアップ'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* サインアップ時のみ表示 */}
        {mode === 'signup' && (
          <>
            <div>
              <label>姓： </label>
              <input type="text"></input>
            </div>
            <div>
              <label>名前： </label>
              <input type="text"></input>
            </div>
          </>
        )}

        {/* メールアドレス */}
        <div>
          <label className="mt-1 block">メールアドレス： </label>
          <input type="text"></input>
        </div>

        {/* パスワード */}
        <div>
          <label className="block">パスワード： </label>
          <input type="text"></input>
        </div>

        {/* 送信ボタン */}
        <button type="submit">
          {mode === 'login' ? 'ログイン' : 'サインアップ'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
