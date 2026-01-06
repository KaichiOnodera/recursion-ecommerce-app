import React from 'react';
import AuthForm from '../../components/auth/AuthForm';

export const UserLogin: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <AuthForm mode="login" userType="user" />
    </div>
  );
};
