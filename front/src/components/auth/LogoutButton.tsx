import React from 'react';
import { useNavigate } from 'react-router';
import { AuthApiService } from '../../services/api/auth';

interface LogoutButtonProps {
  className?: string;
  onLogout?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  onLogout,
}) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await AuthApiService.logout();

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
