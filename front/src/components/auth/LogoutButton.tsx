import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../../services/api/auth';
import { useUser } from '../../contexts/UserContext';
import { LogoutConfirmationModal } from './LogoutConfirmationModal';

interface LogoutButtonProps {
  className?: string;
  onLogout?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  onLogout,
}) => {
  const navigate = useNavigate();
  const { clearUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();

      if (onLogout) {
        onLogout();
      } else {
        navigate('/auth/user/login');
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
