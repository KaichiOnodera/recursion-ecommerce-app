import React from 'react';
import AuthForm from '../../components/auth/AuthForm';

export const UserLogin: React.FC = () => {
  return (
    <div>
      <AuthForm mode="login" userType="user" />
    </div>
  );
};
