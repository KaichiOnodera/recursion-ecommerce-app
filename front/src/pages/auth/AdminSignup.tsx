import React from 'react';
import AuthForm from '../../components/auth/AuthForm';

export const AdminSignup: React.FC = () => {
  return (
    <div>
      <AuthForm mode="signup" userType="admin" />
    </div>
  );
};
