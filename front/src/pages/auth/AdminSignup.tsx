import React from 'react';
import AuthForm from '../../components/auth/AuthForm';

export const AdminSignup: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <AuthForm mode="signup" userType="admin" />
    </div>
  );
};
