import React from 'react';
import AuthForm from '../../components/auth/AuthForm';

export const UserSignup: React.FC = () => {
  return <AuthForm mode="signup" userType="user" />;
};
