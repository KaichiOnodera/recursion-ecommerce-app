import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '../../contexts/UserContext';
import { resendVerificationEmail, getMe } from '../../services/api/auth';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export const EmailVerificationPending: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null,
  );

  const handleResend = async () => {
    setIsResending(true);
    setMessage(null);
    setMessageType(null);

    try {
      await resendVerificationEmail();
      setMessage(
        '認証メールを再送信しました。メールボックスをご確認ください。',
      );
      setMessageType('success');
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          '認証メールの送信に失敗しました。しばらくしてから再度お試しください。',
      );
      setMessageType('error');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await getMe();
      if (response.user) {
        setUser({
          id: response.user.id,
          lastName: response.user.lastName,
          firstName: response.user.firstName,
          email: response.user.email,
          role: response.user.role,
          emailVerified: response.user.emailVerified ?? null,
        });

        if (response.user.emailVerified) {
          setMessage('メール認証が完了しました！');
          setMessageType('success');
          // 3秒後にマイページにリダイレクト
          setTimeout(() => {
            navigate('/mypage');
          }, 3000);
        } else {
          setMessage(
            'まだメール認証が完了していません。メールボックスをご確認ください。',
          );
          setMessageType('error');
        }
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          '認証状態の確認に失敗しました。しばらくしてから再度お試しください。',
      );
      setMessageType('error');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <EnvelopeIcon className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            メール認証が必要です
          </h1>
          <p className="text-gray-600 text-lg">
            ご登録いただいたメールアドレスに認証メールを送信しました
          </p>
        </div>

        {/* メッセージ表示 */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              messageType === 'success'
                ? 'bg-green-50 border-green-400 text-green-700'
                : 'bg-red-50 border-red-400 text-red-700'
            }`}
          >
            <div className="flex items-center">
              {messageType === 'success' && (
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* 説明文 */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            次の手順でメール認証を完了してください
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>メールボックス（{user.email}）を確認してください</li>
            <li>認証メール内のリンクをクリックしてください</li>
            <li>
              認証が完了したら、下の「認証状態を確認」ボタンをクリックしてください
            </li>
          </ol>
        </div>

        {/* アクションボタン */}
        <div className="space-y-4">
          <button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
          >
            {isChecking ? (
              <>
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                確認中...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                認証状態を確認
              </>
            )}
          </button>

          <button
            onClick={handleResend}
            disabled={isResending}
            className="w-full flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? (
              <>
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                認証メールを再送信
              </>
            )}
          </button>
        </div>

        {/* 注意事項 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            メールが届かない場合は、迷惑メールフォルダもご確認ください。
            <br />
            それでも届かない場合は、上記の「認証メールを再送信」ボタンをお試しください。
          </p>
        </div>

        {/* ログインリンク */}
        <div className="mt-6 text-center">
          <Link
            to="/auth/user/login"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors underline underline-offset-2"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
};
