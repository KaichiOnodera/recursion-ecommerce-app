import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { verifyEmail, getMe } from '../../services/api/auth';
import { useUser } from '../../contexts/UserContext';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export const EmailVerificationComplete: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [status, setStatus] = useState<
    'verifying' | 'success' | 'error' | null
  >(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('認証トークンがありません。');
      return;
    }

    const verify = async () => {
      setStatus('verifying');
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('メール認証が完了しました！');

        // ユーザー情報を再取得してemailVerifiedを更新
        try {
          const response = await getMe();
          if (response.user) {
            setUser({
              id: response.user.id,
              lastName: response.user.lastName,
              firstName: response.user.firstName,
              email: response.user.email,
              role: response.user.role,
              emailVerified: response.user.emailVerified ?? true,
            });
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }

        // 3秒後にマイページにリダイレクト
        setTimeout(() => {
          navigate('/mypage');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.message ||
            'メール認証に失敗しました。トークンが無効または期限切れの可能性があります。',
        );
      }
    };

    verify();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-4">
                  <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                認証中...
              </h1>
              <p className="text-gray-600 text-lg">
                メール認証を確認しています。少々お待ちください。
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircleIcon className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                認証完了
              </h1>
              <p className="text-gray-600 text-lg mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">
                3秒後にマイページにリダイレクトします...
              </p>
              <Link
                to="/mypage"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                マイページへ
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <XCircleIcon className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                認証失敗
              </h1>
              <p className="text-gray-600 text-lg mb-6">{message}</p>
              <div className="space-y-4">
                <Link
                  to="/auth/verify-email/pending"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  認証メールを再送信
                </Link>
                <div>
                  <Link
                    to="/auth/user/login"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors underline underline-offset-2"
                  >
                    ログインページに戻る
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
