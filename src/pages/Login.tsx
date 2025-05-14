
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AuthForm from '@/components/auth/AuthForm';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-6">
        <AuthForm isLogin={true} />
        <p className="text-center mt-4 text-gray-600 dark:text-qskyn-darkText">
          Don't have an account?{' '}
          <Link to="/signup" className="text-qskin-600 hover:underline dark:text-qskyn-secondary">
            Sign up
          </Link>
        </p>
      </div>
    </MainLayout>
  );
};

export default Login;
