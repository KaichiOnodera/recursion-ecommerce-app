import React from 'react';
import AuthForm from '../../components/auth/AuthForm';

export const AdminLogin: React.FC = () => {
  return (
    <div>
      <AuthForm mode="login" userType="admin" />
    </div>
  );
};
