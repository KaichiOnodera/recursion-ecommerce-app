import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '../../contexts/UserContext';
import { logout } from '../../services/api/auth';
import { LogoutConfirmationModal } from './LogoutConfirmationModal';
import {
  ChevronDownIcon,
  UserIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export const UserAccountMenu: React.FC = () => {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ユーザー名の取得（メモ化）
  const displayName = useMemo(() => {
    return user.firstName && user.lastName
      ? `${user.lastName} ${user.firstName}`
      : user.email || 'ユーザー';
  }, [user.firstName, user.lastName, user.email]);

  // イニシャルの取得（メモ化）
  const initials = useMemo(() => {
    if (user.firstName && user.lastName) {
      return `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`;
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }, [user.firstName, user.lastName, user.email]);

  // ログアウト処理（メモ化）
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      clearUser();
      setIsOpen(false);
      navigate('/auth/user/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [clearUser, navigate]);

  // メニューの外側をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={menuRef} className="relative">
        {/* トリガーボタン */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          aria-label="アカウントメニュー"
          aria-expanded={isOpen}
        >
          {/* アバター */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-700 via-green-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow duration-200 ring-2 ring-green-100">
            {initials}
          </div>

          {/* ユーザー名 */}
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-900">
              {displayName.length > 12
                ? `${displayName.substring(0, 12)}...`
                : displayName}
            </div>
            {user.email && (
              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                {user.email}
              </div>
            )}
          </div>

          {/* ドロップダウンアイコン */}
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* ドロップダウンメニュー */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transform transition-all duration-200 ease-out">
            {/* ユーザー情報セクション */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-700 via-green-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {displayName}
                  </div>
                  {user.email && (
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* メニューアイテム */}
            <div className="py-1">
              <Link
                to="/mypage"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span>マイページ</span>
              </Link>

              {user.email && (
                <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ログアウト確認モーダル */}
      <LogoutConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};
