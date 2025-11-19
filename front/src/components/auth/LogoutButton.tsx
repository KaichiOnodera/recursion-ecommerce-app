import React from 'react';
import { useNavigate } from 'react-router';
import { AuthApiService } from '../../services/api/auth';
import { useUser } from '../../contexts/UserContext';

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

  const handleLogout = async () => {
    try {
      await AuthApiService.logout();
      clearUser();

      if (onLogout) {
        onLogout();
      } else {
        navigate('/auth/user/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      ログアウト
    </button>
  );
};
