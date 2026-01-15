import React, { useState } from 'react';
import { logout } from '../../services/api/auth';
import { useUser } from '../../contexts/UserContext';
import { useRedirect } from '../../hooks/useRedirect';
import { RedirectReason } from '../../constants/redirectReasons';
import { LogoutConfirmationModal } from './LogoutConfirmationModal';

interface LogoutButtonProps {
  className?: string;
  onLogout?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  onLogout,
}) => {
  const redirect = useRedirect();
  const { clearUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();

      if (onLogout) {
        onLogout();
      } else {
        redirect(RedirectReason.LOGOUT_SUCCESS);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={className}>
        ログアウト
      </button>
      <LogoutConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};
