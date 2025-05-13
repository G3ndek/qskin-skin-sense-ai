
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AuthForm from '@/components/auth/AuthForm';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-6">
        <AuthForm isLogin={false} />
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-qskin-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </MainLayout>
  );
};

export default Signup;
